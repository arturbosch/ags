const network = await Service.import("network");
const aps = network.wifi.bind("access_points");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function accesspoint(ap) {
  const connecting = Variable(false);
  const freq = ap.frequency > 3000 ? "5Ghz" : "2.4Ghz";
  const conn = Variable(ap.active ? "Connected (" + freq + ")" : freq);
  const activeClass = Variable(ap.active ? "active" : "");

  const name = Widget.Box({
    children: [
      Widget.Icon({
        icon: ap.iconName,
      }),
      Widget.Label(ap.ssid),
    ],
  });

  const status = Widget.Stack({
    hpack: "end",
    children: {
      state: Widget.Label({
        label: conn.bind(),
      }),
      connecting: Widget.Spinner({
        hpack: "end",
      }),
    },
    shown: connecting.bind().as((conn) => (conn ? "connecting" : "state")),
  });

  return Widget.Button({
    className: activeClass.bind(),
    cursor: "pointer",
    hexpand: true,

    on_clicked: () => {
      const ssid = network.wifi.ssid;
      connecting.value = true;

      if (ssid == ap.ssid) {
        Utils.execAsync(`bash -c "nmcli con down ${ap.ssid}"`)
          .then(() => {
            connecting.value = false;
            conn.value = freq;
            activeClass.value = "";
          })
          .catch(() => (connecting.value = false));
      } else {
        Utils.execAsync(`bash -c "nmcli device wifi connect ${ap.ssid}"`)
          .then(() => {
            connecting.value = false;
            conn.value = "Connected (" + freq + ")";
            activeClass.value = "active";
          })
          .catch(() => {
            connecting.value = false;
            Utils.execAsync(`bash -c "nmcli device wifi connect ${ssid}"`);
          });
      }
    },

    child: Widget.CenterBox({
      startWidget: name,
      endWidget: status,
    }),
  });
}

const scan = () => {
  const scanning = Variable(false);
  return Widget.Stack({
    children: {
      load: Widget.Spinner(),
      button: Widget.Button({
        cursor: "pointer",
        on_clicked: () => {
          scanning.value = true;
          network.wifi.scan();
          sleep(1000).then(() => (scanning.value = false));
        },
        child: Widget.Icon({
          icon: "view-refresh-symbolic",
        }),
      }),
    },
    shown: scanning.bind().as((b) => (b ? "load" : "button")),
  });
};

const settings = () =>
  Widget.Button({
    cursor: "pointer",
    on_clicked: () => {
      Utils.execAsync(
        "env XDG_CURRENT_DESKTOP=gnome gnome-control-center wifi",
      );
    },
    child: Widget.Icon({
      icon: "applications-system-symbolic",
    }),
  });

const tailscale = Variable("", {
  poll: [100000, `bash -c "tailscale status | grep 'linux'"`],
});

const header = () =>
  Widget.CenterBox({
    className: "header",
    hexpand: true,
    startWidget: Widget.Box([
      Widget.Label({
        hpack: "start",
        css: "font-weight: bold;",
        label: "Wifi",
      }),
      Widget.Label({
        hpack: "start",
        css: "color: grey;",
        label: tailscale.bind().as((tail) => (tail ? `via tailscale` : "")),
      }),
    ]),
    endWidget: Widget.Box({
      hpack: "end",
      children: [scan(), settings()],
    }),
  });

const apblocks = () =>
  Widget.Box({
    class_name: "container",
    vertical: true,
    children: aps.as((ap) =>
      ap
        .sort((a, b) => b.strength - a.strength)
        .sort((a, b) => Number(b.active) - Number(a.active))
        .map(accesspoint),
    ),
  });

const apbox = () =>
  Widget.Scrollable({
    css: aps.as((ap) =>
      ap.length < 5
        ? `min-height:unset; min-height: calc(58px * ${ap.length})`
        : `min-height:unset; min-height: calc(55px * 4)`,
    ),
    hscroll: "never",
    child: apblocks(),
  });

const wifi = () =>
  Widget.Box({
    vertical: true,
    class_names: ["networkWidget", "popup"],
    children: [header(), apbox()],
  });

export default function networkWidget(monitor) {
  return Widget.Window({
    name: `networkWidget${monitor}`,
    visible: false,
    anchor: ["top", "right"],
    monitor,
    margins: [7, 70],
    child: wifi(),
  });
}

const bluetooth = await Service.import("bluetooth");
const devices = bluetooth.bind("devices");

function bluedevice(device) {
  const connecting = Variable(false);

  const conn = Utils.merge(
    [device.bind("battery_percentage"), device.bind("connected")],
    (per, conn) => (conn ? "Connected (" + per + "%)" : "Disconnected"),
  );

  const name = Widget.Box({
    children: [
      //Widget.Icon({
      //  icon: device.icon_name + "-symbolic",
      //}),
      Widget.Label(device.name),
    ],
  });

  const status = Widget.Stack({
    hpack: "end",
    children: {
      state: Widget.Label({
        label: conn,
      }),
      connecting: Widget.Spinner({
        hpack: "end",
      }),
    },
    shown: connecting.bind().as((c) => (c ? "connecting" : "state")),
  });

  return Widget.Button({
    className: device.bind("connected").as((ac) => (ac ? "active" : "")),
    cursor: "pointer",
    hexpand: true,

    on_clicked: () => {
      connecting.value = true;
      Utils.execAsync(
        `bash -c "bluetoothctl ${device.connected ? "disconnect" : "connect"} ${device.address}"`,
      )
        .then(() => (connecting.value = false))
        .catch(() => (connecting.value = false));
    },

    child: Widget.CenterBox({
      startWidget: name,
      endWidget: status,
    }),
  });
}

const scanning = Variable(false);

const scan = () =>
  Widget.Stack({
    children: {
      load: Widget.Spinner(),
      button: Widget.Button({
        cursor: "pointer",
        on_clicked: () => {
          scanning.value = true;
          Utils.execAsync(`bash -c "bluetoothctl --timeout 30 scan on"`).then(
            () => (scanning.value = false),
          );
        },
        child: Widget.Icon({
          icon: "view-refresh-symbolic",
        }),
      }),
    },
    shown: scanning.bind().as((b) => (b ? "load" : "button")),
  });

const settings = () =>
  Widget.Button({
    cursor: "pointer",
    on_clicked: () => {
      Utils.execAsync(
        "env XDG_CURRENT_DESKTOP=gnome gnome-control-center bluetooth",
      );
    },
    child: Widget.Icon({
      icon: "applications-system-symbolic",
    }),
  });

const header = () =>
  Widget.CenterBox({
    className: "header",
    hexpand: true,
    startWidget: Widget.Label({
      hpack: "start",
      css: "font-weight: bold;",
      label: "Bluetooth",
    }),
    endWidget: Widget.Box({
      hpack: "end",
      children: [scan(), settings()],
    }),
  });

const deviceblocks = () =>
  Widget.Box({
    class_name: "container",
    vertical: true,
    children: devices.as((dev) =>
      dev
        .filter((a) => a.name)
        .sort((a, b) => Number(b.connected) - Number(a.connected))
        .map(bluedevice),
    ),
  });

const devicebox = () =>
  Widget.Scrollable({
    hscroll: "never",
    css: devices.as((dev) =>
      dev.length < 5
        ? `min-height:unset; min-height: calc(58px * ${dev.length})`
        : `min-height:unset; min-height: calc(55px * 4)`,
    ),

    child: deviceblocks(),
  });

export default function Bluetooth() {
  return Widget.Box({
    vertical: true,
    class_names: ["popup", "bluedemon"],
    children: [header(), devicebox()],
  });
}

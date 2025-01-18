const network = await Service.import("network");

const net = (mode = false) => {
  const icon = Widget.Icon({
    icon: network.wifi.bind("icon_name"),
  });
  const label = Widget.Label({
    label: network.wifi.bind("ssid").as((ssid) => ssid || "unknown"),
  });

  return Widget.Button({
    onClicked: () => {
      togglePopup("netdemon");
    },
    child: Widget.Box({
      children: mode ? [icon, label] : [icon],
    }),
  });
};

const eth = (mode = false) => {
  const icon = Widget.Icon({
    icon: Utils.merge(
      [network.wired.bind("icon_name"), network.wired.bind("internet")],
      (icon, state) => icon,
    ),
  });
  const label = Widget.Label({
    label: "Wired",
  });

  return Widget.Button({
    onClicked: () =>
      Utils.execAsync(
        "env XDG_CURRENT_DESKTOP=gnome gnome-control-center network",
      ),
    child: Widget.Box({
      children: mode ? [icon, label] : [icon],
    }),
  });
};

export default function Network(m) {
  return Widget.Stack({
    className: "network",
    children: {
      wifi: net(m),
      wired: eth(m),
    },
    shown: network.bind("primary").as((p) => p || "wifi"),
  });
}

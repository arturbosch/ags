const network = await Service.import("network");

const net = () => {
  return Widget.Button({
    onClicked: () => {
      togglePopup("networkWidget");
    },
    child: Widget.Icon({
      icon: network.wifi.bind("icon_name"),
    }),
  });
};

const eth = () => {
  const icon = Widget.Icon({
    icon: Utils.merge(
      [network.wired.bind("icon_name"), network.wired.bind("internet")],
      (icon, state) => icon,
    ),
  });

  return Widget.Button({
    onClicked: () =>
      Utils.execAsync(
        "env XDG_CURRENT_DESKTOP=gnome gnome-control-center network",
      ),
    child: icon,
  });
};

export default function Network() {
  return Widget.Stack({
    className: "network",
    children: {
      wifi: net(),
      wired: eth(),
    },
    shown: network.bind("primary").as((p) => p || "wifi"),
  });
}

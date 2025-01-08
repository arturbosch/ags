const network = await Service.import("network");

const WifiIndicator = () =>
  Widget.Box({
    children: [
      Widget.Icon({
        icon: network.wifi.bind("icon_name"),
      }),
      Widget.Label({
        label: network.wifi
          .bind("ssid")
          .as((ssid) => ` ${ssid} ]` || " Unknown ]"),
      }),
    ],
  });

const WiredIndicator = () =>
  Widget.Icon({
    icon: Utils.merge(
      [network.wired.bind("icon_name"), network.wired.bind("internet")],
      (icon, state) => icon,
    ),
  });

const tailscale = Variable("", {
  poll: [10000, `bash -c "tailscale status | grep 'linux'"`],
});

export default function Network() {
  return Widget.Box({
    className: "memory",
    children: [
      Widget.Label({
        label: tailscale.bind().as((t) => (t != "" ? "[ tailscale - " : "[ ")),
      }),
      Widget.Stack({
        children: {
          wifi: WifiIndicator(),
          wired: WiredIndicator(),
        },
        shown: network.bind("primary").as((p) => p || "wifi"),
      }),
    ],
  });
}

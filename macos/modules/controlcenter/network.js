import { togglePopup } from "../../lib.js";
const network = await Service.import("network");

const net = () => {
  const icon = Widget.Icon({
    icon: Utils.merge(
      [network.wired.bind("icon_name"), network.wired.bind("internet")],
      (icon, state) => icon,
    ),
  });
  const label = Widget.Label({
    hpack: "start",
    truncate: "end",
    label: network.wifi.bind("ssid").as((ssid) => ssid || "unknown"),
  });

  return Widget.Box({
    hexpand: true,
    classNames: network.wifi
      .bind("enabled")
      .as((b) => (b ? ["active", "togglebtn"] : ["togglebtn"])),
    children: [
      Widget.Button({
        className: "toggle",
        hexpand: true,
        onClicked: () => {
          network.toggleWifi();
        },
        child: Widget.Box({
          children: [icon, label],
        }),
      }),
      Widget.Button({
        hpack: "end",
        onClicked: () => {
          togglePopup("netdemon");
        },

        child: Widget.Icon("go-next-symbolic"),
      }),
    ],
  });
};

const eth = () => {
  const icon = Widget.Icon({
    icon: network.wired.bind("icon_name"),
  });
  const label = Widget.Label({
    truncate: "end",
    label: "Wired",
  });

  return Widget.Box({
    hexpand: true,
    classNames: ["active", "togglebtn"],
    children: [
      Widget.Button({
        className: "toggle",
        hexpand: true,
        onClicked: () => {
          network.toggleWifi();
        },
        child: Widget.Box({
          children: [icon, label],
        }),
      }),
      Widget.Button({
        hpack: "end",
        onClicked: () =>
          Utils.execAsync(
            "env XDG_CURRENT_DESKTOP=gnome gnome-control-center network",
          ),
        child: Widget.Icon("go-next-symbolic"),
      }),
    ],
  });
};

export default function networkButton() {
  return Widget.Stack({
    children: {
      wifi: net(),
      wired: eth(),
    },
    shown: network.bind("primary").as((p) => p || "wifi"),
  });
}

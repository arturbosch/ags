import { togglePopup } from "../../config.js";
const network = await Service.import("network");

const net = Widget.Button({
  css: "padding: inherit;",
  onClicked: () => {
    togglePopup("netdemon");
  },
  child: Widget.Icon({
    icon: network.wifi.bind("icon_name"),
  }),
});

const eth = Widget.Button({
  onClicked: () =>
    Utils.exec(
      "env XDG_CURRENT_DESKTOP=gnome gnome-control-center network",
    ),
  child: Widget.Icon({
    icon: network.wired.bind("icon_name"),
  }),
});

export default function Network() {
  return Widget.Stack({
    className: "network",
    children: {
      wifi: net,
      wired: eth,
    },
    shown: network.bind("primary").as((p) => p || "wifi"),
  });
}

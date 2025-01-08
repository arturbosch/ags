import { togglePopup } from "../../lib.js";
const bluetooth = await Service.import("bluetooth");

export default function bluetoothButton() {
  const icon = Widget.Icon({
    icon: bluetooth
      .bind("connected_devices")
      .as((devs) =>
        devs.length != 0
          ? "bluetooth-active-symbolic"
          : "bluetooth-disconnected-symbolic",
      ),
  });

  const label = Widget.Label({
    truncate: "end",
    hpack: "start",
    label: bluetooth
      .bind("connected_devices")
      .as((devs) => (devs.length != 0 ? devs[0].alias : "Bluetooth")),
  });

  return Widget.Box({
    hexpand: true,
    classNames: bluetooth
      .bind("enabled")
      .as((b) => (b ? ["active", "togglebtn"] : ["togglebtn"])),
    children: [
      Widget.Button({
        className: "toggle",
        hexpand: true,
        onClicked: () => {
          bluetooth.toggle();
        },
        child: Widget.Box({
          children: [icon, label],
        }),
      }),
      Widget.Button({
        hpack: "end",
        onClicked: () => {
          togglePopup("bluedemon");
        },

        child: Widget.Icon("go-next-symbolic"),
      }),
    ],
  });
}

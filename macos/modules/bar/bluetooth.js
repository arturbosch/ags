import { togglePopup } from "../../config.js";
const bluetooth = await Service.import("bluetooth");

const bstatus = (mode = false) => {
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
    label: bluetooth.bind("connected_devices").as((devs) => devs[0].alias),
  });

  return Widget.Box({
    children: mode ? [icon, label] : [icon],
  });
};

export default function Bluetooth(m) {
  return Widget.Button({
    class_name: "bluetooth",
    onClicked: () => togglePopup("bluedemon"),
    child: bstatus(m),
  });
}

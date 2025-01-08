import { togglePopup } from "../../lib.js";
const bluetooth = await Service.import("bluetooth");

const bstatus = () => {
  const icon = Widget.Icon({
    icon: bluetooth
      .bind("connected_devices")
      .as((devs) =>
        devs.length != 0
          ? "bluetooth-active-symbolic"
          : "bluetooth-disconnected-symbolic",
      ),
  });

  return Widget.Box({
    children: [icon],
  });
};

export default function Bluetooth(m) {
  return Widget.Button({
    class_name: "bluetooth",
    onClicked: () => togglePopup("bluedemon"),
    child: bstatus(m),
  });
}

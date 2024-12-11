import { togglePopup } from "../../config.js";
const bluetooth = await Service.import("bluetooth");

export default function Bluetooth() {
  const icon = Widget.Icon({
    icon: bluetooth
      .bind("connected_devices")
      .as((devs) =>
        devs.length != 0
          ? "bluetooth-active-symbolic"
          : "bluetooth-disconnected-symbolic",
      ),
  });

  const butt = Widget.Button({
    class_name: "bluetooth",
    child: icon,
  });

  butt.connect("clicked", () => {
    togglePopup("bluedemon");
  });

  return butt;
}

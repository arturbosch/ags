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

  return Widget.Button({
    class_name: "bluetooth",
    onClicked: () => togglePopup("bluetoothWidget"),
    child: Widget.Box({
      children: [icon],
    }),
  });
}

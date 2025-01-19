const battery = await Service.import("battery");

export default function Battery() {
  const icon = Utils.merge(
    [battery.bind("percent"), battery.bind("charging")],
    (p, charging) =>
      charging
        ? `battery-level-${Math.floor(p / 10) * 10}-charging-symbolic`
        : `battery-level-${Math.floor(p / 10) * 10}-symbolic`,
  );

  const widgetButton = Widget.Button({
    class_name: "battery",
    visible: battery.bind("available"),
    child: Widget.Box({
      children: [
        Widget.Icon({ icon }),
        Widget.Label({ label: battery.bind("percent").as((p) => `${p}%`) }),
      ],
    }),
  });

  widgetButton.connect("clicked", () => togglePopup("powerWidget"));

  return widgetButton;
}

const battery = await Service.import("battery");

export default function Battery() {
  const value = battery.bind("percent").as((p) => (p > 0 ? p / 100 : 0));

  const icon = Utils.merge(
    [battery.bind("percent"), battery.bind("charging")],
    (p, charging) =>
      charging
        ? `battery-level-${Math.floor(p / 10) * 10}-charging-symbolic`
        : `battery-level-${Math.floor(p / 10) * 10}-symbolic`,
  );

  const butt = Widget.Button({
    class_name: "battery",
    visible: battery.bind("available"),
    child: Widget.Box({
      children: [
        Widget.Icon({ icon }),
        Widget.Label({ label: battery.bind("percent").as((p) => `${p}%`) }),
        //Widget.LevelBar({
        //  vpack: "center",
        //  value,
        //}),
      ],
    }),
  });

  butt.connect("clicked", () => togglePopup("powerdemon"));

  return butt;
}

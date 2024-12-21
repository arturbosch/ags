const hyprland = await Service.import("hyprland");
import brightness from "../../services/brightness.js";

hyprland.connect("monitor-added", () => {
  brightness.newstate();
});

hyprland.connect("monitor-removed", () => {
  brightness.newstate();
});

export default function brightnessSlider() {
  const icon = Widget.Button({
    cursor: "pointer",
    child: Widget.Icon({
      icon: "display-brightness-symbolic",
    }),
  });

  return Widget.Box({
    className: "slider",
    sensitive: brightness.bind("enabled").as((cond) => cond),
    children: [
      icon,
      Widget.Slider({
        css: brightness.bind("screen_value").as((v) => {
          if (v < 0.97)
            return "scale highlight {border-radius: 0px 4px 4px 0px;}";
          else {
            const vol = v * 100 - 97;
            return `scale highlight {border-radius: 0px calc(3px * ${vol} + 4px) calc(3px * ${vol}+4px) 0px;}`;
          }
        }),
        hexpand: true,
        drawValue: false,
        onChange: ({ value }) => {
          brightness.screen_value = value;
        },
        value: brightness.bind("screen_value"),
      }),
    ],
  });
}

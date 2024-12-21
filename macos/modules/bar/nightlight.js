const night = (mode = false) => {
  const icon = Widget.Icon("night-light-symbolic");
  const label = Widget.Label("Night Light");

  return Widget.Box({
    children: mode ? [icon, label] : [icon],
  });
};

export default function Nightlight(m) {
  return Widget.Button({
    onClicked: () => {
      const active =
        Utils.exec(`bash -c "systemctl --user is-active nightlight"`) ==
        "active";
      if (active) {
        Utils.exec(`bash -c "systemctl --user stop nightlight"`);
      } else {
        Utils.exec(`bash -c "systemctl --user start nightlight"`);
      }
    },
    child: night(m),
  });
}

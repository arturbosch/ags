export default function nightlightButton() {
  const icon = Widget.Icon("night-light-symbolic");
  const label = Widget.Label("Night Light");

  const active = Variable(
    Utils.exec(`bash -c "systemctl --user is-active nightlight"`) == "active",
  );

  return Widget.Box({
    hexpand: true,
    classNames: active
      .bind()
      .as((b) => (b ? ["togglebtn", "active"] : ["togglebtn"])),
    children: [
      Widget.Button({
        hexpand: true,
        onClicked: () => {
          if (active.value) {
            Utils.exec(`bash -c "systemctl --user stop nightlight"`);
          } else {
            Utils.exec(`bash -c "systemctl --user start nightlight"`);
          }
          active.value =
            Utils.exec(`bash -c "systemctl --user is-active nightlight"`) ==
            "active";
        },
        child: Widget.Box({
          children: [icon, label],
        }),
      }),
    ],
  });
}

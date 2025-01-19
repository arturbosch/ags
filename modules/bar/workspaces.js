const hyprland = await Service.import("hyprland");

export default function Workspaces() {
  const activeId = hyprland.active.workspace.bind("id");

  const workspaces = [...Array(11).keys()]
    .filter((a) => a != 0)
    .map((n) =>
      Widget.Button({
        hexpand: false,
        vexpand: false,
        on_clicked: () => hyprland.messageAsync(`dispatch workspace ${n}`),
        setup: (self) =>
          self.hook(
            hyprland,
            () => {
              if (
                typeof hyprland.workspaces.find(
                  (workspace) => workspace.id == n,
                ) == "undefined"
              ) {
                self.class_name = "";
              } else if (activeId.emitter.id == n) {
                self.class_name = "focused";
              } else {
                self.class_name = "visible";
              }
            },
            "changed",
          ),
      }),
    );

  return Widget.Box({
    class_name: "workspaces",
    children: workspaces,
  });
}

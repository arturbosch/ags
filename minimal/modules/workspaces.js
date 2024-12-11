const hyprland = await Service.import("hyprland");

export default function Workspaces() {
  const activeId = hyprland.active.workspace.bind("id");

  const workspaces = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) =>
    Widget.Button({
      on_clicked: () => hyprland.messageAsync(`dispatch workspace ${n}`),
      child: Widget.Label(`${n}`),
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

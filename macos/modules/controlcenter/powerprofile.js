const powerprofiles = await Service.import("powerprofiles");

const nameMap = {
  "power-saver": "Power Saver",
  balanced: "Balanced",
  performance: "Performance",
};

export default function powerProfilesButton() {
  const icon = Widget.Icon({
    icon: powerprofiles.bind("icon_name"),
  });
  const label = Widget.Label({
    truncate: "end",
    hpack: "start",
    label: powerprofiles
      .bind("active_profile")
      .as((profile) => nameMap[profile]),
  });

  return Widget.Box({
    classNames: powerprofiles
      .bind("active_profile")
      .as((profile) =>
        profile == "performance" ? ["togglebtn", "active"] : ["togglebtn"],
      ),

    children: [
      Widget.Button({
        className: "toggle",
        hexpand: true,
        onClicked: () => {
          switch (powerprofiles.active_profile) {
            case "balanced":
              powerprofiles.active_profile = "performance";
              break;
            default:
              powerprofiles.active_profile = "balanced";
              break;
          }
        },
        child: Widget.Box({
          children: [icon, label],
        }),
      }),
      Widget.Button({
        hpack: "end",
        onClicked: () => {
          togglePopup("powerdemon");
        },

        child: Widget.Icon("go-next-symbolic"),
      }),
    ],
  });
}

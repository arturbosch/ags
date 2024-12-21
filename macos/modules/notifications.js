const notifications = await Service.import("notifications");
const ations = notifications.bind("notifications");

function notification(fication) {
  return Widget.Button({
    child: Widget.CenterBox({
      cursor: "pointer",
      hexpand: true,

      startWidget: Widget.Box({
        children: [
          //Widget.Box({
          //  class_name: "notimg",
          //  vpack: "start",
          //  css: fication.bind("image").as(
          //    (p) => `
          //            background-image: url('${p}');
          //        `,
          //  ),
          //}),
          Widget.Label({
            label: fication.bind("summary"),
          }),
        ],
      }),

      endWidget: Widget.Button({
        hpack: "end",
        vpack: "start",
        child: Widget.Icon({
          icon: "window-close-symbolic",
        }),
      }),
    }),
  });
}

const footer = Widget.Button({
  hpack: "end",
  child: Widget.Label({ label: "Clear All" }),
});

const apblocks = Widget.Box({
  class_name: "container",
  vertical: true,
  children: ations.as((ap) => ap.map(notification)),
});

const apbox = Widget.Scrollable({
  hscroll: "never",
  vexpand: true,
  child: Widget.Box({
    children: [apblocks, footer],
  }),
});

export default function Notifications() {
  return Widget.Box({
    vertical: true,
    class_names: ["notifications", "popup"],
    children: [apbox],
  });
}

const notifications = await Service.import("notifications");
const events = notifications.bind("notifications");

function notification(event) {
  const currentTime = Variable(0, {
    poll: [60000, 'date "+%s"'],
  });

  const emitted = Widget.Label({
    css: "color: grey; font-size: 0.8em; font-weight: bold;",
    label: currentTime.bind().as((now) => {
      const seconds = now - event.time;
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      if (days) {
        const rstring = days > 1 ? days + " days ago" : days + " day ago";
        return rstring;
      }
      if (hours) {
        const rstring = hours > 1 ? hours + " hours ago" : hours + " hour ago";
        return rstring;
      } else if (minutes > 1) {
        return minutes + " minutes ago";
      }
      return "Just now";
    }),
    hpack: "start",
  });

  const body = Widget.Box({
    className: "body",
    spacing: 4,
    vertical: true,
    vexpand: true,
    vpack: "center",
    children: [
      Widget.Box({
        hpack: "start",
        spacing: 10,
        children: [
          Widget.Label({
            label: event.summary,
            hpack: "start",
            truncate: "end",
          }),
          emitted,
        ],
      }),
      Widget.Label({
        label: event.body,
        hpack: "start",
        truncate: "end",
        css: "color: lightgrey; font-weight: normal;",
      }),
    ],
  });

  const icon = Widget.Icon({
    className: "image",
    icon: "dialog-information-symbolic",
    vexpand: true,
    vpack: "center",
  });

  if (event.app_icon) {
    icon.icon = event.app_icon;
  } else if (event.image && event.image == "nm-signal-100") {
    icon.icon = "network-wireless-signal-excellent-symbolic";
  } else if (event.image && event.image == "nm-device-wired") {
    icon.icon = "network-wired-symbolic";
  } else if (event.image) {
    icon.icon = "";
    icon.css = `background-image: url('${event.image}')`;
  }

  const closer = () =>
    Widget.Button({
      vpack: "start",
      child: Widget.Icon({
        icon: "window-close-symbolic",
      }),
      onClicked: () => {
        event.close();
      },
    });

  const close = Widget.Revealer({
    hexpand: true,
    revealChild: false,
    hpack: "end",
    vpack: "start",
    child: closer(),
  });

  return Widget.EventBox({
    className: "event",
    cursor: "pointer",
    hexpand: true,
    vexpand: false,

    on_hover: () => {
      close.reveal_child = true;
    },
    on_hover_lost: () => {
      close.reveal_child = false;
    },
    onPrimaryClick: () => {
      if (event.actions.length) {
        event.invoke(0);
      }
    },

    child: Widget.Box({
      children: [icon, body, close],
    }),
  });
}

const fications = () =>
  Widget.Box({
    class_name: "container",
    spacing: 10,
    vertical: true,
    children: events.as((e) => e.map(notification)),
  });

const eventList = () =>
  Widget.Scrollable({
    hscroll: "never",
    css: events.as((dev) =>
      dev.length < 6
        ? `min-height: calc(90px * ${dev.length})`
        : `min-height: calc(90px * 6)`,
    ),

    child: fications(),
  });

const dnd = () =>
  Widget.Box({
    hpack: "start",
    children: [
      Widget.Label({
        vexpand: true,
        vpack: "center",
        label: "Do Not Disturb",
      }),
      Widget.Switch({
        active: notifications.dnd,
        className: "siitch",
        onActivate: () => (notifications.dnd = !notifications.dnd),
      }),
    ],
  });

const footer = () =>
  Widget.Box({
    className: "footer",
    hexpand: true,
    children: [
      dnd(),
      Widget.Button({
        hexpand: true,
        hpack: "end",
        cursor: "pointer",
        child: Widget.Label({
          label: "Clear",
        }),
        onClicked: () => {
          notifications.clear();
        },
      }),
    ],
  });

const history = () =>
  Widget.Box({
    vertical: true,
    class_names: ["popup", "notifications"],
    children: [eventList(), footer()],
  });

export default function notificationWidget(monitor) {
  return Widget.Window({
    margins: [7, 90],
    visible: false,
    name: `notificationWidget${monitor}`,
    monitor,
    anchor: ["top", "center"],
    child: history(),
  });
}

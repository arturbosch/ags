const notifications = await Service.import("notifications");
const popups = notifications.bind("popups");

notifications.popupTimeout = 6000;
notifications.cacheActions = false;

function notification(event) {
  const time = Variable(0, {
    poll: [60000, 'date "+%H:%M"'],
  });

  const emitted = Widget.Label({
    css: "color: grey; font-size: 0.8em; font-weight: bold;",
    label: time.bind().as((now) => `${now}`),
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
    icon.icon = event.app_icon + "symbolic";
  } else if (event.image && event.image == "nm-signal-100") {
    icon.icon = "network-wireless-signal-excellent-symbolic";
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
        event.dismiss();
      },
    });

  const close = Widget.Revealer({
    hexpand: true,
    revealChild: false,
    hpack: "end",
    vpack: "start",
    child: closer(),
  });

  const main = Widget.EventBox({
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

  return Widget.Box({
    className: "extraLayer",
    children: [main],
  });
}

const fications = () =>
  Widget.Box({
    class_name: "container",
    spacing: 10,
    vertical: true,
    children: popups.as((p) => p.map(notification)),
  });

const popupList = () =>
  Widget.Scrollable({
    hscroll: "never",
    css: popups.as((dev) =>
      dev.length < 11
        ? `min-height: calc(100px * ${dev.length}); background-color: transparent;`
        : `min-height: calc(100px * 11); background-color: transparent;`,
    ),

    child: fications(),
  });

const pops = () =>
  Widget.Box({
    vertical: true,
    class_names: ["popup", "notifications"],
    css: "background-color: transparent;",
    children: [popupList()],
  });

export default function notificationPopup(monitor) {
  return Widget.Window({
    margins: [7],
    visible: notifications
      .bind("popups")
      .as((p) => (p.length > 0 ? true : false)),
    name: `notificationPopup${monitor}`,
    monitor,
    anchor: ["top", "right"],
    child: pops(),
  });
}

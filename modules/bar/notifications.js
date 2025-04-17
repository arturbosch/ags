const notifications = await Service.import("notifications");

export default function history() {
  return Widget.Button({
    onClicked: () => {
      notifications.dnd = !notifications.dnd;
    },
    child: Widget.Icon({
      icon: notifications
        .bind("dnd")
        .as((dnd) =>
          dnd
            ? "notifications-disabled-symbolic"
            : "preferences-system-notifications-symbolic"
        ),
    }),
  });
}

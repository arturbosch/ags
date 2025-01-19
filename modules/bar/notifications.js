const notifications = await Service.import("notifications");

export default function history() {
  return Widget.Button({
    onClicked: () => togglePopup("notificationWidget"),
    child: Widget.Icon({
      icon: notifications
        .bind("dnd")
        .as((dnd) =>
          dnd
            ? "notifications-disabled-symbolic"
            : "preferences-system-notifications-symbolic",
        ),
    }),
  });
}

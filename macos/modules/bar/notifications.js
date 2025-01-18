import { togglePopup } from "../../lib.js";
const notifications = await Service.import("notifications");

export default function history() {
  return Widget.Button({
    onClicked: () => togglePopup("notificationdemon"),
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

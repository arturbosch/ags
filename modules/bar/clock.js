const date = Variable("", {
  poll: [1000, 'date "+%a %d. %b %H:%M"'],
});

export default function Clock() {
  return Widget.Button({
    class_name: "clock",
    onClicked: () => togglePopup("notificationWidget"),
    child: Widget.Label({
      css: "font-size: 0.95rem;",
      label: date.bind(),
    }),
  });
}

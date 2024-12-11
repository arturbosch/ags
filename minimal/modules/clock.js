const date = Variable("", {
  poll: [1000, 'date "+%A %H:%M"'],
});

export default function Clock() {
  return Widget.Box({
    children: [
      Widget.Label({
        class_name: "clock",
        label: date.bind(),
      }),
    ],
  });
}

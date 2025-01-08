import { togglePopup } from "../../lib.js";
const date = Variable("", {
  poll: [1000, 'date "+%a %d %b %H:%M"'],
});

export default function Clock() {
  return Widget.Button({
    onClicked: () => togglePopup("controldemon"),
    child: Widget.Label({
      class_name: "clock",
      label: date.bind(),
    }),
  });
}

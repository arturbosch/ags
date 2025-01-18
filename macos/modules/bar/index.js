import history from "./notifications.js";
import Workspaces from "./workspaces.js";
import Keymap from "./keymap.js";
import Volume from "./volume.js";
import Clock from "./clock.js";
import Battery from "./battery.js";
import Network from "./network.js";
import Bluetooth from "./bluetooth.js";

// layout of the Bar
function Left() {
  return Widget.Box({
    className: "left",
    hpack: "start",
    children: [Workspaces()],
  });
}

function Center() {
  return Widget.Box({
    className: "center",
    children: [],
  });
}

function Right() {
  return Widget.Box({
    className: "right",
    hpack: "end",
    children: [
      Keymap(),
      history(),
      Bluetooth(),
      Network(),
      Volume(),
      Battery(),
      Clock(),
    ],
  });
}

export default function bar(monitor) {
  return Widget.Window({
    name: `bar${monitor}`, // name has to be unique
    anchor: ["top", "left", "right"],
    class_name: "bar",
    monitor,
    exclusivity: "exclusive",
    child: Widget.CenterBox({
      start_widget: Left(),
      center_widget: Center(),
      end_widget: Right(),
    }),
  });
}

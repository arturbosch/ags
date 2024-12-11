import Workspaces from "./modules/workspaces.js";
import Keymap from "./modules/keymap.js";
import Volume from "./modules/audio.js";
import Clock from "./modules/clock.js";
import Stats from "./modules/stats.js";
import Network from "./modules/network.js";

// layout of the bar
function Left() {
  return Widget.Box({
    spacing: 8,
    children: [Workspaces(), Keymap()],
  });
}

function Right() {
  return Widget.Box({
    className: "right",
    hpack: "end",
    spacing: 8,
    children: [Network(), Stats(), Volume(), Clock()],
  });
}

function Bar(monitor = 0) {
  return Widget.Window({
    monitor,
    name: `bar${monitor}`, // name has to be unique
    anchor: ["top", "left", "right"],
    class_name: "bar",
    exclusivity: "exclusive",
    child: Widget.CenterBox({
      start_widget: Left(),
      end_widget: Right(),
    }),
  });
}

App.config({ style: "./style.css", windows: [Bar(0)] });

Utils.monitorFile(
  `${App.configDir}`,

  // reload function
  function () {
    // main scss file
    const css = `${App.configDir}/style.css`;
    App.resetCss();
    App.applyCss(css);
  },
);

export {};

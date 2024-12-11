import * as bar from "./macos/modules/bar/index.js";
import Sound from "./macos/modules/sound.js";
import Bluetooth from "./macos/modules/bluedemon.js";
import Wifi from "./macos/modules/wifi.js";
import Power from "./macos/modules/power.js";

const openWindow = [];

export function togglePopup(name) {
  if (openWindow[0] == name) {
    App.closeWindow(name);
    App.closeWindow("windowCloser");
    openWindow[0] = "";
  } else {
    if (openWindow[0]) {
      App.closeWindow(openWindow[0]);
    }
    openWindow[0] = name;
    App.openWindow("windowCloser");
    App.openWindow(name);
  }
}

// layout of the bar
function Left() {
  return Widget.Box({
    className: "left",
    hpack: "start",
    children: [bar.Workspaces(), bar.Keymap()],
  });
}

function Right() {
  return Widget.Box({
    className: "right",
    hpack: "end",
    children: [
      bar.Bluetooth(),
      bar.Network(),
      bar.Volume(),
      bar.Battery(),
      bar.Clock(),
    ],
  });
}

function Bar(monitor = 0) {
  return Widget.Window({
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

const netdemon = Widget.Window({
  name: "netdemon",
  visible: false,
  anchor: ["top", "right"],
  margins: [10, 70, 10, 70],
  child: Wifi(),
});

const bluedemon = Widget.Window({
  name: "bluedemon",
  visible: false,
  anchor: ["top", "right"],
  margins: [10, 110],
  child: Bluetooth(),
});

const sounddemon = Widget.Window({
  margins: [10, 20],
  visible: false,
  name: "sounddemon",
  anchor: ["top", "right"],
  child: Sound(),
});

const powerdemon = Widget.Window({
  margins: [10, 20],
  visible: false,
  name: "powerdemon",
  anchor: ["top", "right"],
  child: Power(),
});

const closer = Widget.Window({
  name: "windowCloser",
  className: "windowCloser",
  layer: "top",
  visible: false,
  anchor: ["top", "bottom", "left", "right"],
  child: Widget.EventBox({
    onPrimaryClick: () => {
      if (openWindow[0]) {
        App.closeWindow(openWindow[0]);
      }
      App.closeWindow("windowCloser");
    },
  }),
});

App.config({
  iconTheme: "MoreWaita",
  style: "./style.css",
  windows: [Bar(), sounddemon, bluedemon, netdemon, powerdemon, closer],
});

Utils.monitorFile(
  `${App.configDir}`,
  // reload function
  () => {
    // main scss file
    const css = `${App.configDir}/style.css`;
    App.resetCss();
    App.applyCss(css);
  },
);

export {};

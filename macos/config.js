import bar from "./modules/bar/index.js";
import Sound from "./modules/sounddemon.js";
import Bluetooth from "./modules/bluedemon.js";
import Wifi from "./modules/netdemon.js";
import Power from "./modules/powerdemon.js";
import Control from "./modules/controldemon.js";
const hyprland = await Service.import("hyprland");

const openWindow = [];
const monitors = [];

export function togglePopup(name) {
  let mon = 0;
  hyprland.monitors.forEach((monitor) => {
    if (monitor.focused == true) {
      mon = monitors.indexOf(monitor.id);
    }
  });

  if (openWindow[0] == name + mon) {
    App.closeWindow(name + mon);
    App.closeWindow(`windowCloser${mon}`);
    openWindow[0] = "";
  } else {
    if (openWindow[0]) {
      App.closeWindow(openWindow[0]);
    }
    openWindow[0] = name + mon;
    App.openWindow(`windowCloser${mon}`);
    App.openWindow(name + mon);
  }
}

const netdemon = (monitor) =>
  Widget.Window({
    name: `netdemon${monitor}`,
    visible: false,
    anchor: ["top", "right"],
    monitor,
    margins: [7, 70],
    child: Wifi(),
  });

const bluedemon = (monitor) =>
  Widget.Window({
    name: `bluedemon${monitor}`,
    visible: false,
    anchor: ["top", "right"],
    monitor,
    margins: [7, 110],
    child: Bluetooth(),
  });

const sounddemon = (monitor = 0) =>
  Widget.Window({
    margins: [7, 20],
    visible: false,
    name: `sounddemon${monitor}`,
    monitor,
    anchor: ["top", "right"],
    child: Sound(),
  });

const powerdemon = (monitor) =>
  Widget.Window({
    margins: [7, 20],
    visible: false,
    name: `powerdemon${monitor}`,
    monitor,
    anchor: ["top", "right"],
    child: Power(),
  });

const controldemon = (monitor) =>
  Widget.Window({
    margins: [7],
    visible: false,
    name: `controldemon${monitor}`,
    monitor,
    anchor: ["top", "right"],
    child: Control(),
  });

const closer = (monitor) =>
  Widget.Window({
    name: `windowCloser${monitor}`,
    className: "windowCloser",
    layer: "top",
    visible: false,
    anchor: ["top", "bottom", "left", "right"],
    monitor,
    child: Widget.EventBox({
      onPrimaryClick: () => {
        if (openWindow[0]) {
          App.closeWindow(openWindow[0]);
        }
        App.closeWindow(`windowCloser${monitor}`);
      },
    }),
  });

App.config({
  iconTheme: "MoreWaita",
  style: `${App.configDir}/macos/style.css`,
});

const windows = [
  bar,
  sounddemon,
  bluedemon,
  netdemon,
  powerdemon,
  controldemon,
  closer,
];

function populateMon() {
  hyprland.monitors.forEach((mon) => {
    monitors.push(mon.id);
    windows.forEach((win) => App.addWindow(win(monitors.length - 1)));
  });
}

populateMon();

function refreshMon() {
  monitors.length = 0;
  App.windows.forEach((window) => {
    App.removeWindow(window);
  });
  populateMon();
}

hyprland.connect("monitor-added", () => refreshMon());

hyprland.connect("monitor-removed", () => refreshMon());

Utils.monitorFile(
  `${App.configDir}`,
  // reload function
  () => {
    // main scss file
    const css = `${App.configDir}/macos/style.css`;
    App.resetCss();
    App.applyCss(css);
  },
);

export {};

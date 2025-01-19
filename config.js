const hyprland = await Service.import("hyprland");
import bar from "./modules/bar/index.js";
import soundWidget from "./modules/soundWidget.js";
import bluetoothWidget from "./modules/bluetoothWidget.js";
import networkWidget from "./modules/networkWidget.js";
import powerWidget from "./modules/powerWidget.js";
import controlWidget from "./modules/controlcenter/index.js";
import notificationWidget from "./modules/notifications/widget.js";
import notificationPopup from "./modules/notifications/popup.js";
import { powermenu, powermenuRight } from "./modules/powermenu.js";
import { populateMon, refreshMon, closer } from "./lib.js";

App.config({
  iconTheme: "MoreWaita",
  style: `${App.configDir}/style.css`,
});

App.addIcons(`${App.configDir}/icons`);

const windows = [
  bar,
  soundWidget,
  bluetoothWidget,
  networkWidget,
  powerWidget,
  controlWidget,
  notificationWidget,
  notificationPopup,
  powermenu,
  powermenuRight,
  closer,
];

populateMon(windows);

hyprland.connect("monitor-added", () => refreshMon(windows));
hyprland.connect("monitor-removed", () => refreshMon(windows));

Utils.monitorFile(`${App.configDir}`, () => {
  // main scss file
  const css = `${App.configDir}/style.css`;
  App.resetCss();
  App.applyCss(css);
});

export {};

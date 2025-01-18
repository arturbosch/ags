const battery = await Service.import("battery");
import { togglePopup } from "../lib.js";

import bluetoothButton from "./controlcenter/bluetooth.js";
import networkButton from "./controlcenter/network.js";
import nightlightButton from "./controlcenter/nightlight.js";
import powerProfileButton from "./controlcenter/powerprofile.js";
import brightnessSlider from "./components/brightnessSlider.js";
import volumeSlider from "./components/volumeSlider.js";
import mediaPlayer from "./components/mediaPlayer.js";

const settings = () =>
  Widget.Button({
    cursor: "pointer",
    on_clicked: () => {
      Utils.execAsync("env XDG_CURRENT_DESKTOP=gnome gnome-control-center");
    },
    child: Widget.Icon({
      icon: "applications-system-symbolic",
    }),
  });

const batteryStatus = () => {
  const value = battery.bind("percent").as((p) => (p > 0 ? p / 100 : 0));

  const icon = Utils.merge(
    [battery.bind("percent"), battery.bind("charging")],
    (p, charging) =>
      charging
        ? `battery-level-${Math.floor(p / 10) * 10}-charging-symbolic`
        : `battery-level-${Math.floor(p / 10) * 10}-symbolic`,
  );

  return Widget.Button({
    visible: battery.bind("available"),
    child: Widget.Box({
      children: [
        Widget.Icon({ icon: icon }),
        Widget.Label({
          label: battery.bind("percent").as((p) => `${p}%`),
          css: "font-weight: bold;",
        }),
        Widget.Label({
          css: "color: grey;",
          label: battery.bind("time_remaining").as((tim) => {
            const mins = tim / 60;
            const hours = Math.floor(mins / 60);
            const minutes = Math.round(mins % 60);
            if (hours >= 1) {
              return `${hours}h ${minutes}m`;
            }
            if (minutes) {
              return `${minutes}m`;
            }
            return "External Power";
          }),
        }),
      ],
    }),
    onClicked: () => togglePopup("powerdemon"),
  });
};

const revel = Widget.Revealer({
  revealChild: false,
  transitionDuration: 500,
  transition: "slide_right",
  css: "background-color: white;",
  child: Widget.Box({
    children: [
      Widget.Button({
        child: Widget.Icon({
          icon: "system-shutdown-symbolic",
        }),
        onClicked: () => {
          Utils.exec(`bash -c "shutdown -h now"`);
        },
      }),
      Widget.Button({
        child: Widget.Icon({
          icon: "system-shutdown-symbolic",
        }),
        onClicked: () => {
          Utils.exec(`bash -c "shutdown -h now"`);
        },
      }),
      Widget.Button({
        child: Widget.Icon({
          icon: "system-shutdown-symbolic",
        }),
        onClicked: () => {
          Utils.exec(`bash -c "shutdown -h now"`);
        },
      }),
    ],
  }),
});

const header = () =>
  Widget.Box({
    className: "header",
    children: [
      batteryStatus(),
      Widget.Box({
        hpack: "end",
        hexpand: true,
        children: [
          Widget.Button({
            child: Widget.Icon({
              css: "color: coral;",
              icon: "media-record-symbolic",
            }),
          }),
          settings(),
          Widget.Button({
            child: Widget.Icon("system-lock-screen-symbolic"),
            onClicked: () => {
              Utils.exec("bash -c 'loginctl lock-session'");
            },
          }),
          Widget.Button({
            child: Widget.Icon({
              icon: "system-shutdown-symbolic",
            }),
            onClicked: () => {
              togglePopup("powermenu");
            },
          }),
        ],
      }),
    ],
  });

const switches = () =>
  Widget.Box({
    className: "switches",
    hexpand: true,
    spacing: 8,
    homogeneous: true,
    children: [
      Widget.Box({
        hexpand: true,
        vertical: true,
        children: [networkButton(), nightlightButton()],
      }),
      Widget.Box({
        hexpand: true,
        vertical: true,
        children: [bluetoothButton(), powerProfileButton()],
      }),
    ],
  });

const control = () =>
  Widget.Box({
    vertical: true,
    class_names: ["popup", "controlcenter"],
    children: [
      header(),
      volumeSlider(true),
      brightnessSlider(),
      Widget.Separator(),
      switches(),
      Widget.Separator(),
      mediaPlayer(),
    ],
  });

export default function controldemon(monitor) {
  return Widget.Window({
    margins: [7],
    visible: false,
    name: `controldemon${monitor}`,
    monitor,
    anchor: ["top", "right"],
    child: control(),
  });
}

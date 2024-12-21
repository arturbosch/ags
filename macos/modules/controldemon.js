const battery = await Service.import("battery");
import { togglePopup } from "../config.js";

import bluetoothButton from "./controlcenter/bluetooth.js";
import networkButton from "./controlcenter/network.js";
import nightlightButton from "./controlcenter/nightlight.js";
import powerProfileButton from "./controlcenter/powerprofile.js";

import brightnessSlider from "./components/brightnessSlider.js";
import volumeSlider from "./components/volumeSlider.js";
import mediaPlayer from "./components/mediaPlayer.js";

const settings = () =>
  Widget.Button({
    hpack: "end",
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

  const icon = battery
    .bind("percent")
    .as((p) => `battery-level-${Math.floor(p / 10) * 10}-symbolic`);

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

const header = () =>
  Widget.CenterBox({
    className: "header",
    startWidget: batteryStatus(),
    endWidget: Widget.Box({
      hpack: "end",
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
        }),
        Widget.Button({
          child: Widget.Box({
            children: [
              Widget.Revealer({
                revealChild: false,
                transitionDuration: 500,
                transition: "slide_right",
                child: Widget.Box({
                  children: [
                    Widget.Icon({
                      icon: "system-log-out-symbolic",
                    }),
                    Widget.Icon({
                      icon: "system-reboot-symbolic",
                    }),
                  ],
                }),
              }),
              Widget.Icon({
                icon: "system-shutdown-symbolic",
              }),
            ],
          }),
        }),
      ],
    }),
  });

const switches = () =>
  Widget.CenterBox({
    className: "switches",
    hexpand: true,
    spacing: 8,
    startWidget: Widget.Box({
      vertical: true,
      children: [networkButton(), nightlightButton()],
    }),
    endWidget: Widget.Box({
      vertical: true,
      children: [bluetoothButton(), powerProfileButton()],
    }),
  });

export default function Control() {
  return Widget.Box({
    vertical: true,
    class_names: ["popup", "controlcenter"],
    children: [
      header(),
      volumeSlider(),
      brightnessSlider(),
      Widget.Separator(),
      switches(),
      Widget.Separator(),
      mediaPlayer(),
    ],
  });
}

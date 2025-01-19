import { close } from "../lib.js";

const buttons = () =>
  Widget.Box({
    class_names: ["popup", "powermenu"],
    hexpand: true,
    children: [
      Widget.Button({
        hexpand: true,
        cursor: "pointer",
        child: Widget.Icon({
          icon: "system-lock-screen-symbolic",
        }),
        onClicked: () => {
          close();
          Utils.exec(`bash -c "loginctl lock-session"`);
        },
      }),
      Widget.Button({
        hexpand: true,
        cursor: "pointer",
        child: Widget.Icon({
          icon: "system-sleep-symbolic",
        }),
        onClicked: () => {
          close();
          Utils.exec(`bash -c "systemctl suspend"`);
        },
      }),
      Widget.Button({
        hexpand: true,
        cursor: "pointer",
        child: Widget.Icon({
          icon: "system-reboot-symbolic",
        }),
        onClicked: () => {
          close();
          Utils.exec(`bash -c "reboot"`);
        },
      }),
      Widget.Button({
        hexpand: true,
        cursor: "pointer",
        child: Widget.Icon({
          icon: "system-log-out-symbolic",
        }),
        onClicked: () => {
          close();
          Utils.exec(`bash -c "loginctl terminate-user $USER"`);
        },
      }),
      Widget.Button({
        hexpand: true,
        cursor: "pointer",
        child: Widget.Icon({
          icon: "system-shutdown-symbolic",
        }),
        onClicked: () => {
          close();
          Utils.exec(`bash -c "shutdown -h now"`);
        },
      }),
    ],
  }).keybind("Escape", (self, event) => {
    close();
  });

const pmenu = (monitor, name, anchor) =>
  Widget.Window({
    margins: [7],
    visible: false,
    name: `${name}${monitor}`,
    monitor,
    keymode: "exclusive",
    anchor,
    child: buttons(),
  });

export function powermenu(monitor) {
  return pmenu(monitor, "powermenu", ["top"]);
}

export function powermenuRight(monitor) {
  return pmenu(monitor, "powermenuRight", ["top", "right"]);
}

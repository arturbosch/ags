import mediaPlayer from "./components/mediaPlayer.js";
import volumeSlider from "./components/volumeSlider.js";

const audio = await Service.import("audio");
const speakers = audio.bind("speakers");

function speaker(device) {
  const iconname = device.icon_name.split("-");
  const iconstring = iconname[0] + "-" + iconname[1] + "-symbolic";

  const name = Widget.Box({
    children: [
      Widget.Icon({
        icon: iconstring,
      }),
      Widget.Label({
        truncate: "end",
        label: device.description,
      }),
    ],
  });

  const status = Widget.Stack({
    hpack: "end",
    children: {
      state: Widget.Label({
        label: device.bind("volume").as((vol) => Math.round(vol * 100) + "%"),
      }),
      connecting: Widget.Spinner({
        hpack: "end",
      }),
    },
  });

  return Widget.Button({
    className: audio.speaker
      .bind("id")
      .as((real) => (device.id == real ? "active" : "")),
    cursor: "pointer",
    hexpand: true,

    on_clicked: () => {
      audio.speaker = device;
    },

    child: Widget.CenterBox({
      startWidget: name,
      endWidget: status,
    }),
  });
}

const settings = () =>
  Widget.Button({
    hpack: "end",
    cursor: "pointer",
    on_clicked: () => {
      Utils.execAsync(
        "env XDG_CURRENT_DESKTOP=gnome gnome-control-center sound",
      );
    },
    child: Widget.Icon({
      icon: "applications-system-symbolic",
    }),
  });

const header = () =>
  Widget.CenterBox({
    className: "header",
    hexpand: true,
    startWidget: Widget.Label({
      hpack: "start",
      css: "font-weight: bold;",
      label: "Sound",
    }),
    endWidget: settings(),
  });

const outblocks = () =>
  Widget.Box({
    class_name: "container",
    vertical: true,
    children: speakers.as((dev) => dev.map(speaker)),
  });

const outputs = () =>
  Widget.Scrollable({
    hscroll: "never",
    css: speakers.as((speak) =>
      speak.length < 5
        ? `min-height:unset; min-height: calc(58px * ${speak.length})`
        : `min-height:unset; min-height: calc(55px * 4)`,
    ),
    child: outblocks(),
  });

const sound = () =>
  Widget.Box({
    vertical: true,
    class_names: ["popup", "audiodemon"],
    children: [
      header(),
      volumeSlider(),
      Widget.Separator(),
      outputs(),
      Widget.Separator(),
      mediaPlayer(),
    ],
  });

export default function sounddemon(monitor = 0) {
  return Widget.Window({
    margins: [7, 20],
    visible: false,
    name: `sounddemon${monitor}`,
    monitor,
    anchor: ["top", "right"],
    child: sound(),
  });
}

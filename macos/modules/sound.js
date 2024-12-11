import Player from "./mediaplayer.js";

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

const icons = {
  101: "overamplified",
  67: "high",
  34: "medium",
  1: "low",
  0: "muted",
};

function getIcon() {
  const icon = audio.speaker.is_muted
    ? 0
    : [101, 67, 34, 1, 0].find(
        (threshold) => threshold <= audio.speaker.volume * 100,
      );

  return `audio-volume-${icons[icon]}-symbolic`;
}

const icon = Widget.Button({
  onClicked: () => (audio.speaker.is_muted = !audio.speaker.is_muted),
  cursor: "pointer",
  child: Widget.Icon({
    icon: Utils.watch(getIcon(), audio.speaker, getIcon),
  }),
});

const speakerSlider = Widget.Box({
  className: "volumeSlider",
  children: [
    icon,
    Widget.Slider({
      css: audio.speaker.bind("volume").as((v) => {
        if (v < 0.97)
          return "scale highlight {border-radius: 0px 4px 4px 0px;}";
        else {
          const vol = v * 100 - 97;
          return `scale highlight {border-radius: 0px calc(3px * ${vol} + 4px) calc(3px * ${vol}+4px) 0px;}`;
        }
      }),
      hexpand: true,
      vexpand: true,
      drawValue: false,
      onChange: ({ value }) => (audio["speaker"].volume = value),
      value: audio["speaker"].bind("volume"),
    }),
  ],
});

const settings = Widget.Button({
  hpack: "end",
  cursor: "pointer",
  on_clicked: () => {
    Utils.execAsync("env XDG_CURRENT_DESKTOP=gnome gnome-control-center sound");
  },
  child: Widget.Icon({
    icon: "applications-system-symbolic",
  }),
});

const header = Widget.CenterBox({
  className: "header",
  hexpand: true,
  startWidget: Widget.Label({
    hpack: "start",
    css: "font-weight: bold;",
    label: "Sound",
  }),
  endWidget: settings,
});

const outblocks = Widget.Box({
  class_name: "container",
  vertical: true,
  children: speakers.as((dev) => dev.map(speaker)),
});

const outputs = Widget.Scrollable({
  hscroll: "never",
  css: speakers.as(() =>
    outblocks.children.length < 5
      ? `min-height:unset; min-height: calc(58px * ${outblocks.children.length})`
      : `min-height:unset; min-height: calc(55px * 4)`,
  ),
  child: outblocks,
});

export default function Sound() {
  return Widget.Box({
    vertical: true,
    class_names: ["popup", "audiodemon"],
    children: [
      header,
      speakerSlider,
      Widget.Separator(),
      outputs,
      Widget.Separator(),
      Player(),
    ],
  });
}

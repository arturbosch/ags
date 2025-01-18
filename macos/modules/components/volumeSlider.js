const audio = await Service.import("audio");

export default function volumeSlider(arrow = false) {
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

  const vslider = Widget.Slider({
    css: audio.speaker.bind("volume").as((v) => {
      if (v < 0.97) return "scale highlight {border-radius: 0px 4px 4px 0px;}";
      else {
        const vol = v * 100 - 97;
        return `scale highlight {border-radius: 0px calc(3px * ${vol} + 4px) calc(3px * ${vol}+4px) 0px;}`;
      }
    }),
    hexpand: true,
    drawValue: false,
    onChange: ({ value }) => (audio["speaker"].volume = value),
    value: audio["speaker"].bind("volume"),
  });

  const abutton = Widget.Button({
    hpack: "end",
    cursor: "pointer",
    onClicked: () => {
      togglePopup("sounddemon");
    },

    child: Widget.Icon("go-next-symbolic"),
  });
  const childs = [icon, vslider];

  const children = arrow ? childs.concat([abutton]) : childs;

  return Widget.Box({
    className: "slider",
    children: children,
  });
}

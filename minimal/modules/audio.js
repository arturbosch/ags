const audio = await Service.import("audio");

export default function Volume() {
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

  const endlabel = Widget.Label({
    label: "[ ",
  });

  const icon = Widget.Icon({
    icon: Utils.watch(getIcon(), audio.speaker, getIcon),
  });

  const label = Widget.Label({
    label: audio["speaker"]
      .bind("volume")
      .as((p) => `${Math.floor(p * 100)}% ]`),
  });

  return Widget.Box({
    class_name: "volume",
    children: [endlabel, icon, label],
  });
}

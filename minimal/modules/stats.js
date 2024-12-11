const battery = await Service.import("battery");

export default function Stats() {
  const bat = battery.bind("percent").as((p) => (p > 0 ? p / 100 : 0));
  const icon = battery
    .bind("percent")
    .as((p) => `battery-level-${Math.floor(p / 10) * 10}-symbolic`);

  const bstate = Widget.Box({
    class_name: "battery",
    children: [
      Widget.Label({ label: "[ " }),
      Widget.Icon({ icon }),
      Widget.Label({ label: battery.bind("percent").as((p) => `${p}%`) }),
      Widget.LevelBar({
        vpack: "center",
        bat,
      }),
    ],
  });

  const cpu = Variable("", {
    poll: [
      3000,
      `bash -c "cat /proc/cpuinfo | grep 'cpu MHz' | awk '{s+=$4;count++}END{print s/count}'"`,
    ],
  });

  const cstate = Widget.Box({
    className: "cpu",
    children: [
      Widget.Label({
        label: cpu.bind().as((c) => `${Math.trunc(c)}Mhz`),
      }),
    ],
  });

  const mem = Variable("", {
    poll: [
      5000,
      `bash -c "cat /proc/meminfo | grep MemAvailable | awk '{print $2}'"`,
    ],
  });

  const mstate = Widget.Box({
    className: "memory",
    children: [
      Widget.Label({
        label: mem.bind().as((m) => `${(m * (9.5 * 10 ** -7)).toFixed(2)}GB ]`),
      }),
    ],
  });

  return Widget.Box({
    class_name: "stats",
    //visible: battery.bind("available"),
    children: [bstate, cstate, mstate],
  });
}

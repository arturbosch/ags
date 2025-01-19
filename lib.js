const hyprland = await Service.import("hyprland");

const openWindow = [];
const monitors = [];

globalThis.togglePopup = function togglePopup(name) {
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
};
export function populateMon(population) {
  hyprland.monitors.forEach((mon) => {
    monitors.push(mon.id);
    population.forEach((win) => App.addWindow(win(monitors.length - 1)));
  });
}

export function refreshMon(population) {
  monitors.length = 0;
  App.windows.forEach((window) => {
    App.removeWindow(window);
  });
  populateMon(population);
}

export function close() {
  if (openWindow[0]) {
    App.closeWindow(openWindow[0]);
    for (let i = 0; i < monitors.length; i++) {
      App.closeWindow(`windowCloser${i}`);
    }
  }
}

export function closer(monitor) {
  return Widget.Window({
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
}

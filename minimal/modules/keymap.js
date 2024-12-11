const hypr = await Service.import("hyprland");

function getmap() {
  return Utils.exec(`bash ${App.configDir}/modules/kmpa.bash`);
}

export default function Keymap() {
  return Widget.Label({
    label: Utils.watch(getmap(), hypr, "keyboard-layout", () => {
      return getmap();
    }),
  });
}

const hypr = await Service.import("hyprland");

function getmap() {
  return Utils.exec(
    `bash -c "hyprctl devices -j | jq -c '.keyboards.[] | select(.main == true)| .active_keymap' | xargs"`,
  );
}

export default function Keymap() {
  return Widget.Label({
    css: "color: gray;",
    label: Utils.watch(getmap(), hypr, "keyboard-layout", () => {
      return getmap();
    }),
  });
}

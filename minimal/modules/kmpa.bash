echo $(hyprctl devices -j | jq -c '.keyboards.[] | select(.main == true)| .active_keymap' | xargs)


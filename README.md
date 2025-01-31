
![image](https://github.com/user-attachments/assets/d7ffe75f-bf06-4c06-8f9c-08015bd7c558)

Bar and widgets made w ags. 

Network widget is a bit buggy. Will be fixed when I switch to agsv2/astal.

Wallpaper can be found [here](https://github.com/anewdi/wallz) (solarWater.jpg)

## Requirements

I use [moreWaita](https://github.com/somepaulo/MoreWaita) icons.

Below is a list of requirements for the specific widgets/functions to work as intended

* Wifi: `networkmanager`, `nm-applet` for authentication window
* Workspaces: `hyprland`
* Keymap: `jq`, `hyprland` - made to work solely with Norwegian and English. This is easy to change in the code tho `./modules/bar/keymap.js`
* Notifications: No other notification daemon running
* Bluetooth: `bluez`
* Sound: `playerctl`, `pulseaudio`/`pipewire-pulse`
* Powerprofiles: `power-profiles-daemon`
* Recorder: `wf-recorder`
* Nightlight: Should work with (stop/start/status) any systemd user service named "nightlight". Obviously you can also change this in the code.

### Gnome control center
`gnome-control-center` is neccessary for settings icon to work. On any given widget it tries to open gnome control center at the section corresponding to the widget function(bluetooth widget -> gnome bluetooth page). 

#### Gnome control center bluetooh
For gnome bluetooth to work you need to have `gsd-rfkill` running. It is a part of `gnome-settings-daemon`. Personally, I have a systemd user service that launches it along with my graphical environement: 
```
[Install]
WantedBy=graphical-session.target

[Service]
BusName=org.gnome.SettingsDaemon.Rfkill
ExecStart=/nix/store/ra1chwq2ipg109gqsh7vgm8wfrmh6v6s-gnome-settings-daemon-47.2/libexec/gsd-rfkill #Replace with correct path for your package manager/distro
Restart=on-failure
TimeoutStopSec=5
Type=dbus

[Unit]
Description=Gnome RFKill support service
```

## The widgets

You will find the widgets under `./modules`.

I have two types of powermenu, `powermenu` and `powermenuRight`. On my setup i use both. One on the right for activation from the control center, and one centered which i activate with a keybind: `$mainMod, ESCAPE, exec, ags -r "togglePopup('powermenu')"'`

If you do not want firefox to show in media playing widget (and dont want to change the code), you can set the following setting in firefox(about:config): `media.hardwaremediakeys.enabled = false`

## Video preview

https://github.com/user-attachments/assets/4e67e22d-a67b-418b-b752-07f591a1ee18

# My linux config
## Download yay 
```
git clone https://aur.archlinux.org/yay.git
cd yay 
makepkg -si
```
## Install fish as default shell 
```
yay -S fish
chsh -s /usr/local/bin/fish
```
## Install requirements
```
yay -s google-chrome firefox code zed kitty hyprland hyprlock hyprpicker nvim grim slurp swww-git light swaylock-effects-git swayidle theme.sh sddm xdg-desktop-portal-hyprland dunst nwg-look wf-recorder colord ffmpegthumbnailer gnome-keyring grimblast-git gtk-engine-murrine imagemagick kvantum pamixer playerctl polkit-kde-agent qt5-quickcontrols qt5-quickcontrols2 qt5-wayland qt6-wayland swww ttf-font-awesome tumbler ttf-jetbrains-mono ttf-icomoon-feather xdg-desktop-portal-hyprland-git xdotool xwaylandvideobridge-cursor-mode-2-git cliphist qt5-imageformats qt5c btop cava neofetch noise-suppression-for-voice starship zsh viewnior ocs-url file-roller noto-fonts noto-fonts-cjk noto-fonts-emoji thunar thunar-archive-plugin catppuccin-gtk-theme-macchiato catppuccin-gtk-theme-mocha papirus-icon-theme sddm-git swaylock-effects-git kvantum kvantum-theme-catppuccin-git obs-studio-rc ffmpeg-obs cef-minimal-obs-rc-bin pipewire pipewire-alsa pipewire-audio pipewire-pulse pipewire-jack wireplumber gst-plugin-pipewire pavucontrol
```
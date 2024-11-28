# My linux config
![Config Preview](./preview-git.png)
## Download yay
```
sudo pacman -Suy
```
```
git clone https://aur.archlinux.org/yay.git
```
```
cd yay
```
```
makepkg -si
```
## Install fish as default shell
```
yay -S fish
```
```
chsh -s /usr/local/bin/fish
```
## Install requirements
```
yay -s git go google-chrome nodejs firefox code zed hyprlock hyprpicker nvim grim slurp swww-git light swaylock-effects-git swayidle theme.sh dunst nwg-look wf-recorder colord ffmpegthumbnailer gnome-keyring grimblast-git gtk-engine-murrine imagemagick kvantum pamixer playerctl qt5-quickcontrols qt5-quickcontrols2 qt5-wayland qt6-wayland swww ttf-font-awesome tumbler ttf-jetbrains-mono ttf-icomoon-feather xwaylandvideobridge-cursor-mode-2-git cliphist qt5-imageformats qt5c btop cava neofetch noise-suppression-for-voice starship zsh viewnior ocs-url file-roller noto-fonts noto-fonts-cjk noto-fonts-emoji thunar thunar-archive-plugin wireplumber pavucontrol nerd-fonts matugen materia-gtk-theme
```
## Create ags bar
```
yay -S libastal-git aylurs-gtk-shell-git
```
```
ags types
```
## Clone this repo
```
mv ~/.config ~/config.bak
git https://github.com/yosheeeee/hyprconfigs.git ~/.config
```
## Set Autologin
### Install GDM
```
yay -S gdm
sudo systemctl enable gdm.service -f
```
### Set autologin to user
#### in /etc/gdm/custom.conf add
```
[daemon]
AutomaticLoginEnable=True
AutomaticLogin=yoshee
```

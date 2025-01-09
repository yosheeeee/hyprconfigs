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
yay -s git go google-chrome nodejs firefox code zed hyprlock hyprpicker nveom grim slurp swww light swaylock-effects-git swayidle theme.sh dunst nwg-look gtk playerctl brightnessctl qt5-base qt6-base cava neofetch zsh file-roller thunar thunar-archive-plugin nerd-fonts matugen materia-gtk-theme
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

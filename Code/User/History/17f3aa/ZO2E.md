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
yay -s google-chrome firefox code zed kitty hyprland hyprlock hyprpicker nvim grim slurp swww-git light swaylock-effects-git swayidle theme.sh sddm xdg-desktop-portal-hyprland
```

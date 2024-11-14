if status is-interactive
    # Commands to run in interactive sessions can go here
end
set -gx EDITOR nvim
set -U fish_user_paths /home/yoshee/.nvm/versions/node/v20.17.0/bin:/home/linuxbrew/.linuxbrew/bin:/home/linuxbrew/.linuxbrew/sbin:/usr/local/bin:/usr/bin:/var/lib/snapd/snap/bin:$fish_user_paths
eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"

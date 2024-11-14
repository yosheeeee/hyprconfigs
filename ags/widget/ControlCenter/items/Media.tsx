import { App, Gtk, Gdk, Widget } from "astal/gtk3";
import { bind, execAsync, Variable } from "astal";
import AstalMpris from "gi://AstalMpris?version=0.1";

import icons from "../../../lib/icons";
import { hexToRgb, lookUpIcon } from "../../../lib/utils";
import PlayerColorsService from "../../../service/PlayerColors";

type PlayerProps = {
	player: AstalMpris.Player;
};

const Player = ({ player }: PlayerProps) => {
	const PlayerColors = PlayerColorsService(player);
	const position = bind(player, "position").as((p) =>
		player.length > 0 ? p / player.length : p * 0.01,
	);

	const Title = new Widget.Label({
		label: player.get_title(),
		truncate: true,
		className: `player__title`,
		halign: Gtk.Align.START,
	});

	const Artist = new Widget.Label({
		label: player.get_artist(),
		truncate: true,
		className: `player__artist`,
		halign: Gtk.Align.START,
	});

	const PlayerIcon = () => (
		<icon
			icon={bind(player, "entry").as((i) =>
				lookUpIcon(`${i}-symbolic`)
					? `${i}-symbolic`
					: lookUpIcon(i)
						? i
						: icons.fallback.audio,
			)}
			className="player__icon"
		/>
	);
	const PlayPause = ({ className, ...props }: Widget.ButtonProps) => (
		<button
			onClicked={() => player.play_pause()}
			className={`player__playpause ${className}`}
			{...props}
			setup={(self) => {
				// const colors = PlayerColors.colors.get(player.coverArt);
				// if (colors) {
				// 	self.css = `
				// 		background: ${colors.primary_container}; \
				// 		color: ${colors.on_primary_container};
				// 	`;
				// }
				self.toggleClassName(
					"active",
					player.playbackStatus === AstalMpris.PlaybackStatus.PLAYING,
				);
				self.hook(player, "notify::playback-status", () => {
					self.toggleClassName(
						"active",
						player.playbackStatus ===
							AstalMpris.PlaybackStatus.PLAYING,
					);
				});
				self.hook(PlayerColors, "notify::colors", (self) => {
					if (PlayerColors.colors)
						self.css = `
								background: ${PlayerColors.colors.primary_container}; \
								color: ${PlayerColors.colors.on_primary_container};
							`;
				});
			}}
		>
			<icon
				icon={bind(player, "playbackStatus").as((status) => {
					switch (status) {
						case AstalMpris.PlaybackStatus.PLAYING:
							return icons.media.playing;
						case AstalMpris.PlaybackStatus.STOPPED:
						case AstalMpris.PlaybackStatus.PAUSED:
							return icons.media.stopped;
					}
				})}
			/>
		</button>
	);
	const Next = () => (
		<button
			hexpand={false}
			valign={Gtk.Align.END}
			onClicked={() => player.next()}
			className={"player__next"}
		>
			<icon icon={icons.media.next} />
		</button>
	);
	const Previous = () => (
		<button
			hexpand={false}
			valign={Gtk.Align.START}
			onClicked={() => player.previous()}
			className={"player__previous"}
		>
			<icon icon={icons.media.prev} />
		</button>
	);

	const PositionSlider = () => (
		<slider
			className={"player__position-slider"}
			drawValue={false}
			hexpand
			onDragged={({ value }) => (player.position = value * 100)}
			value={position}
		/>
	);

	return (
		<centerbox
			name={player.busName}
			vertical
			className={`player player-${player.busName}`}
			vexpand
			setup={(self) => {
				self.hook(PlayerColors, "notify::colors", (self) => {
					if (PlayerColors.colors) {
						const colors_rgb = hexToRgb(
							PlayerColors.colors.primary,
						)!;
						self.css = `
								background-image:
									radial-gradient(circle,\
										rgba(${colors_rgb.r}, ${colors_rgb.g}, ${colors_rgb.b}, 0.05) 10%,\
										rgba(${colors_rgb.r}, ${colors_rgb.g}, ${colors_rgb.b}, 0.6)),\
									radial-gradient(circle,\
										rgba(0,0,0, 0.25) 10%,\
										rgba(0,0,0, 0.25)),\
										url("${player.coverArt}");\
								color: ${PlayerColors.colors.on_primary};
							`;
					}
				});
			}}
		>
			<box vexpand valign={Gtk.Align.START}>
				<PlayerIcon />
			</box>
			<box hexpand vexpand valign={Gtk.Align.CENTER}>
				<box
					vertical
					halign={Gtk.Align.START}
					vexpand
					valign={Gtk.Align.CENTER}
					className="player__title-box"
					setup={(self) => {
						self.hook(player, "notify::title", (_) => {
							self.toggleClassName("dissappear", true);
							setTimeout(() => {
								self.toggleClassName("dissappear", false);
								Title.label = player.title;
								Artist.label = player.artist;
							}, 300);
						});
					}}
				>
					{Title}
					{Artist}
				</box>
				<box hexpand />
				<PlayPause halign={Gtk.Align.END} />
			</box>
			<box vexpand valign={Gtk.Align.END} spacing={24}>
				<Previous />
				<PositionSlider />
				<Next />
			</box>
		</centerbox>
	);
};

export default () => {
	const mpris = AstalMpris.get_default();
	const selectedPlayer = Variable<string>("");

	const nextPlayer = () => {
		const players = mpris.get_players();
		const index = players.findIndex(
			(p) => p.busName == selectedPlayer.get(),
		);
		selectedPlayer.set(players[(index + 1) % players.length].busName);
	};

	const previousPlayer = () => {
		const players = mpris.get_players();
		const index = players.findIndex(
			(p) => p.busName == selectedPlayer.get(),
		);
		selectedPlayer.set(
			players[(index - 1 + players.length) % players.length].busName,
		);
	};

	return (
		<revealer
			revealChild={bind(mpris, "players").as((p) => p.length > 0)}
			// onDestroy={() => {
			// 	PlayerColors.;
			// }}
		>
			<overlay>
				<eventbox
					onScroll={(self, event) => {
						if (event.direction == Gdk.ScrollDirection.UP) {
							nextPlayer();
						} else {
							previousPlayer();
						}
					}}
				>
					<stack
						transitionType={
							Gtk.StackTransitionType.SLIDE_LEFT_RIGHT
						}
						shown={bind(selectedPlayer)}
					>
						{bind(mpris, "players").as((players) =>
							players.map((player) => <Player player={player} />),
						)}
					</stack>
				</eventbox>
				<revealer
					valign={Gtk.Align.END}
					halign={Gtk.Align.CENTER}
					revealChild={bind(mpris, "players").as((p) => p.length > 1)}
				>
					<box valign={Gtk.Align.END} halign={Gtk.Align.CENTER}>
						{bind(mpris, "players").as((players) =>
							players.map((p) => (
								<box
									className={"player__indicator"}
									setup={(self) => {
										self.hook(
											selectedPlayer,
											(_, selected) => {
												self.toggleClassName(
													"selected",
													selected == p.busName,
												);
											},
										);
									}}
								></box>
							)),
						)}
					</box>
				</revealer>
			</overlay>
		</revealer>
	);
};

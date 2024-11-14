import { App, Gtk, Gdk, Widget } from "astal/gtk3";
import { bind, execAsync, timeout, Variable, GLib } from "astal";
import Notifd from "gi://AstalNotifd";
import icons from "../../lib/icons";
import ActiveApp from "../Bar/items/ActiveApp";

const time = (time: number, format = "%H:%M") =>
	GLib.DateTime.new_from_unix_local(time).format(format);

type NotificationIconProps = {
	notification: Notifd.Notification;
};

const NotificationIcon = ({ notification }: NotificationIconProps) => {
	var { appName, appIcon, image } = notification;
	if (image) {
		if (image.includes("file://")) image = image.replace("file://", "");

		if (appName == "Telegram Desktop" || appName == "") {
			return (
				<box
					valign={Gtk.Align.START}
					hexpand={false}
					className={"notification__icon telegram"}
					css={`
						background-image: url("file://${image}");
						background-size: cover;
						background-repeat: no-repeat;
						background-position: center;
						min-width: 48px;
						min-height: 48px;
					`}
				/>
			);
		} else {
			return (
				<box
					valign={Gtk.Align.START}
					hexpand={false}
					className="notification__icon"
					css={`
						background-image: url("file://${image}");
						background-size: cover;
						background-repeat: no-repeat;
						background-position: center;
						min-width: 18px;
						min-height: 18px;
					`}
				/>
			);
		}
	}

	let icon = icons.fallback.notification;
	// if (Utils.lookUpIcon(appIcon)) icon = appIcon;

	// if (Utils.lookUpIcon(appName || "")) icon = appName || "";

	return new Widget.Box({
		valign: Gtk.Align.START,
		hexpand: false,
		className: "notification__icon",
		child: new Widget.Icon({
			icon,
			iconSize: 18,
			halign: Gtk.Align.CENTER,
			valign: Gtk.Align.CENTER,
			hexpand: true,
		}),
	});
};

export default function Notification(notification: Notifd.Notification) {
	const Content = () => (
		<box hexpand={true} className="content">
			<NotificationIcon notification={notification} />
			<box hexpand={true} vexpand={true} vertical={true}>
				<box
					className="notification__header"
					vexpand={true}
					valign={Gtk.Align.CENTER}
				>
					<box hexpand={true} spacing={6}>
						<label
							className="notification__title"
							maxWidthChars={14}
							wrap={true}
							justify={Gtk.Justification.LEFT}
							truncate={true}
							useMarkup={true}
							label={notification.summary.trim()}
						/>
						<label className="notification__dot" label={"•"} />
						{notification.appName != "" && (
							<label
								className="notification__app-name"
								justify={Gtk.Justification.LEFT}
								truncate={true}
								wrap={true}
								maxWidthChars={8}
								useMarkup={true}
								label={notification.app_name.trim()}
							/>
						)}
						{notification.appName != "" && (
							<label className="notification__dot" label={"•"} />
						)}
						<label
							className="notification__time"
							label={time(notification.time)?.toString()}
						/>
					</box>
				</box>
				<revealer
					visible={notification.body != ""}
					reveal_child={notification.body != ""}
				>
					<label
						className="notification__description"
						hexpand={true}
						useMarkup={true}
						xalign={0}
						lines={3}
						justify={Gtk.Justification.LEFT}
						truncate={true}
						maxWidthChars={24}
						wrap={true}
						label={notification.body.trim().toString()}
					/>
				</revealer>
			</box>
			<button
				vexpand={true}
				valign={Gtk.Align.START}
				className="notification__close-button"
				onClicked={() => {
					notification.dismiss();
				}}
			>
				<icon icon="window-close-symbolic" />
			</button>
		</box>
	);

	const ActionsBox = () =>
		notification.get_actions() && (
			<box className="notification__actions">
				{notification.get_actions().map((action) => (
					<button
						className="notification__action"
						on_clicked={() => notification.invoke(action.id)}
						hexpand={true}
					>
						<label label={action.label} />
					</button>
				))}
			</box>
		);

	const Eventbox = () => (
		<eventbox
			vexpand={false}
			// onClicked={notification.dismiss}
			on_hover={() => {}}
			on_hover_lost={() => {
				// notification.dismiss();
			}}
		>
			<box vertical={true}>
				<Content />
				<ActionsBox />
			</box>
		</eventbox>
	);

	return (
		<box
			valign={Gtk.Align.START}
			className={`notification ${notification.urgency}`}
		>
			<Eventbox />
		</box>
	);
}

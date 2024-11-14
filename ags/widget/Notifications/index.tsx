import { App, Gtk, Gdk, Widget, Astal } from "astal/gtk3";
import { bind, execAsync, timeout, Variable, GLib } from "astal";
import AstalNotifd from "gi://AstalNotifd?version=0.1";
import Notification from "./Notification";
import { spacing } from "../../lib/variables";
import PopupWindow from "../../common/PopupWindow";

export default () => {
	const notifications = AstalNotifd.get_default();
	notifications.set_ignore_timeout(true);

	return (
		<PopupWindow
			scrimType="transparent"
			layer={Astal.Layer.OVERLAY}
			visible={false}
			margin={12}
			vexpand={true}
			keymode={Astal.Keymode.EXCLUSIVE}
			name="notifications"
			namespace="notifications"
			className="notifications"
			exclusivity={Astal.Exclusivity.NORMAL}
			anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
			application={App}
			onKeyPressEvent={(self, event) => {
				const [keyEvent, keyCode] = event.get_keycode();
				if (keyEvent && keyCode == 9) {
					App.toggle_window(self.name);
				}
			}}
			setup={(self) => {
				self.hook(notifications, "notify::notifications", () => {
					if (notifications.get_notifications().length == 0) {
						timeout(500, () => {
							self.visible = false;
						});
					}
				});
			}}
		>
			<box vertical className="notifications-window" spacing={spacing}>
				<button
					halign={Gtk.Align.END}
					hexpand={false}
					className="notifications-window__clear"
					onClicked={() => {
						notifications.get_notifications().forEach((n) => {
							timeout(50, () => n.dismiss());
						});
					}}
				>
					<label
						className="notifications-window__clear-label"
						label={"Clear all"}
					></label>
				</button>
				<scrollable vexpand>
					<box
						className="notifications-window__list"
						visible={true}
						orientation={Gtk.Orientation.VERTICAL}
						spacing={6}
						vexpand={true}
						hexpand={true}
					>
						{bind(notifications, "notifications").as(
							(notifications) =>
								notifications.map((n) => Notification(n)),
						)}
					</box>
				</scrollable>
			</box>
		</PopupWindow>
	);
};

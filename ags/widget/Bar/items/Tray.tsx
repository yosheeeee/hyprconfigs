import Tray from "gi://AstalTray";
import BarItem from "../BarItem";
import { bind, timeout } from "astal";
import { App, Gtk, Gdk, astalify } from "astal/gtk3";

type BarTrayItemProps = {
	item: Tray.TrayItem;
};

const MenuButton = astalify(Gtk.MenuButton) //maybe support menubuttons directly, as they are useful here

function TrayItem({ item }: BarTrayItemProps) {
	return <MenuButton
		className="bar__tray-item"
		tooltipMarkup={bind(item, "tooltipMarkup")}
		usePopover={false} //only needed  for gtk3, as gtk3 popovers are broken
		actionGroup={bind(item, "action-group").as(
			(ag) => ["dbusmenu", ag],
		)}
		menuModel={bind(item, "menu-model")}
		setup={(self) => {
			self.insert_action_group("dbusmenu", item.action_group)
			item.connect("notify::action-group", () => {
				self.insert_action_group("dbusmenu", item.action_group)
			})
		}}
	>
		<icon gIcon={bind(item, "gicon")} />
	</MenuButton>
}

export default () => {
	const tray = Tray.get_default();

	return (
		<revealer
			visible={tray.get_items().length > 0}
			revealChild={tray.get_items().length > 0}
			transitionDuration={300}
			transitionType={Gtk.RevealerTransitionType.SLIDE_LEFT}
			setup={(self) => {
				self.hook(tray, "notify::items", () => {
					if (tray.get_items().length > 0) {
						self.visible = true;
						self.reveal_child = true;
					} else {
						self.reveal_child = false;
						setTimeout(() => {
							self.visible = false;
						}, 300);
					}
				});
			}}
		>
			<BarItem className="bar__tray">
				<box spacing={4} hexpand={false} valign={Gtk.Align.CENTER}>
					{bind(tray, "items").as((items) =>
						items.map((item) => {
							return <TrayItem item={item} />;
						}),
					)}
				</box>
			</BarItem>
		</revealer>
	);
};

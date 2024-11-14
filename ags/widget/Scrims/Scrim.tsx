import { App, Astal, Widget } from "astal/gtk3";
import { scrimWindowNames } from "../../lib/variables";
import { activePopupWindows, toggleWindow } from "../../lib/utils";

export default () => (
	<window
		visible={false}
		name="scrim"
		namespace="scrim"
		layer={Astal.Layer.OVERLAY}
		exclusivity={Astal.Exclusivity.IGNORE}
		anchor={
			Astal.WindowAnchor.TOP |
			Astal.WindowAnchor.LEFT |
			Astal.WindowAnchor.RIGHT |
			Astal.WindowAnchor.BOTTOM
		}
		keymode={Astal.Keymode.NONE}
		application={App}
		className="scrim"
		setup={(self) => {
			self.hook(self, "notify::visible", () => {
				if (!self.visible) {
					const visiblePopups = activePopupWindows("opaque");
					visiblePopups.forEach((popup) => {
						toggleWindow(popup.name);
					});
				}
			});
		}}
	>
		<eventbox
			vexpand={true}
			hexpand={true}
			onClick={(self) => {
				self.parent.visible = false;
			}}
		/>
	</window>
);

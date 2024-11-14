import { App, Astal, Widget } from "astal/gtk3";
import {
	scrimWindowNames,
	transparentScrimWindowNames,
} from "../lib/variables";
import { activePopupWindows } from "../lib/utils";

type PopupWindowProps = {
	scrimType: "transparent" | "opaque";
} & Widget.WindowProps;

export default ({
	application = App,
	layer = Astal.Layer.OVERLAY,
	keymode = Astal.Keymode.EXCLUSIVE,
	visible = false,
	child,
	scrimType,
	setup,
	...props
}: PopupWindowProps) => (
	<window
		application={application}
		layer={layer}
		keymode={keymode}
		visible={visible}
		{...props}
		setup={(self) => {
			scrimType == "transparent"
				? transparentScrimWindowNames.set([
						...transparentScrimWindowNames.get(),
						self.name,
					])
				: scrimWindowNames.set([...scrimWindowNames.get(), self.name]);

			self.hook(self, "notify::visible", () => {
				const activePopups = activePopupWindows(scrimType);
				if (activePopups.length == 0) {
					scrimType == "transparent"
						? App.get_window("transparent-scrim")?.set_visible(
								false,
							)
						: App.get_window("scrim")?.set_visible(false);
				}
			});
			if (setup) setup(self);
		}}
	>
		{child}
	</window>
);

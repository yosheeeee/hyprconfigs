import { GLib, Variable } from "astal";
import BarButton from "../BarButton";

export default () => {
	const format = "%a %d %b, %H:%M";
	const time = Variable<string>("").poll(
		1000,
		() => GLib.DateTime.new_now_local().format(format)!,
	);
	return (
		<BarButton>
			<label
				className="Time"
				onDestroy={() => time.drop()}
				label={time()}
			/>
		</BarButton>
	);
};

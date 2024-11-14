import ControlCenterButton from "../ControlCenterButton";
import FanProfiles, { profileName } from "../../../service/FanProfiles";
import { bind } from "astal";
import icons from "../../../lib/icons";

export default () => {
	if (FanProfiles) {
		const profile = bind(FanProfiles, "profile");
		return (
			<ControlCenterButton
				icon={profile.as((p) => icons.powerprofile[p])}
				label={profile.as((p) => profileName(p))}
				onPrimaryClick={() => {
					if (FanProfiles) FanProfiles.nextProfile();
				}}
				menuName="profiles"
			/>
		);
	}
};

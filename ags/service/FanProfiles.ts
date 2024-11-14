import { exec, GObject, Variable } from "astal";

const FAN_REGISTER = 0x61;

export enum FanProfile {
	Silent = 1,
	Standart = 0,
	Performance = 2,
}

const profileBinding = {
	1: "battery",
	0: "balanced",
	2: "performance",
};

const available = () => {
	const hostName = exec("cat /sys/devices/virtual/dmi/id/product_name");
	if (hostName == "B450M H") {
		return false;
	}
	return true;
};

export const profileName = (profile: FanProfile) => {
	const profileName = profileBinding[profile];
	return profileName.charAt(0).toUpperCase() + profileName.slice(1);
};

const getProfile = () => {
	const result = exec(`sudo ec_probe read ${FAN_REGISTER}`);
	return parseInt(result.split(" ")[0]) as FanProfile;
};

type FanProfileServiceType = {
	profile: number;
};

class FanProfileService extends GObject.Object {
	#profile: FanProfile = getProfile();

	get profile() {
		return this.#profile;
	}

	get profiles(): FanProfile[] {
		return [1, 0, 2];
	}

	async nextProfile() {
		this.#profile++;
		if (this.#profile > 2) this.#profile = 0;
		exec(`sudo ec_probe write ${FAN_REGISTER} ${this.#profile}`);
		this.notify("profile");
	}

	async prevProfile() {
		this.#profile--;
		if (this.#profile < 0) this.#profile = 2;
		exec(`sudo ec_probe write ${FAN_REGISTER} ${this.#profile}`);
		this.notify("profile");
	}

	async setProfile(profile: FanProfile) {
		exec(`sudo ec_probe write ${FAN_REGISTER} ${profile}`);
		this.#profile = profile;
		this.notify("profile");
	}
}

const FanProfileServiceRegister = GObject.registerClass(
	{
		GTypeName: "FanProffileService",
		Properties: {
			profile: GObject.ParamSpec.int(
				"profile",
				"Profile",
				"A fan-profile property",
				GObject.ParamFlags.READWRITE,
				0,
				2,
				0,
			),
		},
		Signals: {},
	},
	FanProfileService,
);

var service: FanProfileService | null = null;
if (available()) {
	service = new FanProfileServiceRegister();
}
export default service;

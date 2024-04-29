import { useRef } from "react";
import { OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import { useControls } from "leva";

import { useExperience } from "../../../stores/useExperience";

export const Debug = () => {
	const generalControls = useControls("General", {
		enableControls: true,
		showPerf: true,
	});

	const cameraTarget = useExperience((state) => state.cameraTarget);

	const orbitControlsRef = useRef<
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore <Unable use the Native `OrbitControls>
		Parameters<Parameters<typeof OrbitControls>["0"]["ref"]>["0"] | null
	>(null);

	useFrame(() => {
		if (!orbitControlsRef.current) return;

		orbitControlsRef.current.target = cameraTarget;
	});

	return (
		<>
			{generalControls.enableControls && (
				<OrbitControls ref={orbitControlsRef} makeDefault />
			)}
			{generalControls.showPerf && <Perf position="top-left" />}
		</>
	);
};

import { ContactShadows } from "@react-three/drei";
import { useControls } from "leva";

export const Shadows = () => {
	const shadowControls = useControls("Shadows", {
		color: "#000000",
		opacity: { value: 0.4, min: 0, max: 1 },
		blur: { value: 2, min: 0, max: 10 },
		bake: false,
	});

	return (
		<ContactShadows
			opacity={shadowControls.opacity}
			blur={shadowControls.blur}
			color={shadowControls.color}
			frames={shadowControls.bake ? 1 : Infinity}
		/>
	);
};

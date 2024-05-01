import { PropsWithChildren } from "react";
import { Physics } from "@react-three/rapier";
import { useControls } from "leva";

import { PhysicsWalls } from "./walls";

export const PhysicsWorld = ({ children }: PropsWithChildren) => {
	const physicsControls = useControls("Physics", {
		enable: true,
		enableDebug: true,
	});

	return (
		<Physics
			paused={!physicsControls.enable}
			debug={physicsControls.enableDebug}
		>
			{children}

			<PhysicsWalls />
		</Physics>
	);
};

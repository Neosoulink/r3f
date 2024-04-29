import React from "react";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useControls } from "leva";

export const PhysicsWalls = () => {
	const physicsControls = useControls("Physics", {
		enableWalls: true,
	});

	return physicsControls.enableWalls ? (
		<RigidBody type="fixed">
			<CuboidCollider args={[5, 4, 0.5]} position={[0, 3.5, 5.5]} />
			<CuboidCollider args={[5, 4, 0.5]} position={[0, 3.5, -5.5]} />
			<CuboidCollider args={[0.5, 4, 5]} position={[5.5, 3.5, 0]} />
			<CuboidCollider args={[0.5, 4, 5]} position={[-5.5, 3.5, 0]} />
		</RigidBody>
	) : (
		<React.Fragment />
	);
};

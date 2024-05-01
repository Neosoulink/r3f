import { useMemo, useRef } from "react";
import {
	InstancedRigidBodies,
	InstancedRigidBodyProps,
} from "@react-three/rapier";
import { useControls } from "leva";
import {
	BufferGeometry,
	InstancedMesh,
	InstancedMeshEventMap,
	Material,
	NormalBufferAttributes,
} from "three";

export const InstancedBalls = () => {
	const { count } = useControls("Balls", {
		count: { value: 10, min: 1, max: 100 },
	});
	const ballsInstances = useMemo(() => {
		const instances: InstancedRigidBodyProps[] = [];

		for (let i = 0; i < count; i++) {
			instances.push({
				key: `instance_${i}_${Date.now()}`,
				position: [Math.random() * 2, i * 2, Math.random()],
				rotation: [0, 0, 0],
			});
		}

		return instances;
	}, [count]);

	const ballsRef =
		useRef<
			InstancedMesh<
				BufferGeometry<NormalBufferAttributes>,
				Material,
				InstancedMeshEventMap
			>
		>(null);
	const instancedBallsRef = useRef<
		Parameters<
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			Exclude<
				Parameters<typeof InstancedRigidBodies>["0"]["ref"],
				undefined | null
			>
		>["0"]
	>(null);

	return (
		<InstancedRigidBodies
			ref={instancedBallsRef}
			instances={ballsInstances}
			friction={1}
			restitution={1}
			angularDamping={0.1}
			linearDamping={0.1}
			shape="ball"
			colliders="ball"
		>
			<instancedMesh
				ref={ballsRef}
				castShadow
				receiveShadow
				args={[undefined, undefined, count]}
			>
				<sphereGeometry args={[0.35]} />
				<meshStandardMaterial color="red" />
			</instancedMesh>
		</InstancedRigidBodies>
	);
};

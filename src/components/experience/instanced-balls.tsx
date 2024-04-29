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
import { useFrame } from "@react-three/fiber";

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

	useFrame(() => {
		if (!instancedBallsRef.current?.length) return;

		instancedBallsRef.current.map((ballBody) => {
			if (!ballBody) return;

			const ballTranslate = ballBody.translation();
			if (ballTranslate.y < -0.5) {
				ballBody.setTranslation({ x: 0, y: 4, z: 0 }, true);
				ballBody.setLinvel({ x: 0, y: 0, z: 0 }, false);
				ballBody.setAngvel({ x: 0, y: 0, z: 0 }, false);
			}
		});
	});

	return (
		<InstancedRigidBodies
			ref={instancedBallsRef}
			instances={ballsInstances}
			friction={0.7}
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

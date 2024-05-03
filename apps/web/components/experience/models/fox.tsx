import * as THREE from "three";
import { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { type RigidBody as NativeRigidBody } from "@dimforge/rapier3d-compat/dynamics/rigid_body";
import { PlayerEntity } from "@/hooks/useSocketConnection";

export type GLTFResult = GLTF & {
	nodes: {
		fox: THREE.SkinnedMesh;
		_rootJoint: THREE.Bone;
	};
	materials: {
		fox_material: THREE.MeshStandardMaterial;
	};
};
export type ActionName = "Survey" | "Walk" | "Run";
export type GLTFActions = Record<ActionName, THREE.AnimationAction>;
export type FoxModelProps = {
	id?: string;
	root?: JSX.IntrinsicElements["group"];
	position?: PlayerEntity["position"];
	rotation?: PlayerEntity["rotation"];
	actionName?: ActionName;
};

export const FoxModel = (props: Readonly<FoxModelProps>) => {
	const physicBody = useRef<NativeRigidBody>(null);
	const rootGroupRef = useRef<THREE.Group>(null);

	const { nodes, materials, animations } = useGLTF(
		"./models/Fox/glTF/Fox.gltf"
	) as unknown as GLTFResult;
	const { actions } = useAnimations<(typeof animations)[number]>(
		animations,
		rootGroupRef
	);

	const availableActions = actions as GLTFActions;

	useEffect(() => {
		const action = availableActions[props.actionName ?? "Survey"];
		action.reset().fadeIn(0.5).play();

		return () => {
			action.fadeOut(0.5);
		};
	}, [props.actionName, availableActions]);

	useFrame(() => {
		if (!physicBody.current) return;
		if (props.position)
			physicBody.current.setNextKinematicTranslation(props.position);
		if (props.rotation)
			physicBody.current.setNextKinematicRotation(props.rotation);
	});

	return (
		<RigidBody
			ref={physicBody}
			colliders="cuboid"
			type="kinematicPosition"
			position={[0, 0, 0]}
		>
			<group ref={rootGroupRef} {...props.root}>
				<group name="root">
					<skinnedMesh
						name={props.id}
						geometry={nodes.fox.geometry}
						material={materials.fox_material}
						skeleton={nodes.fox.skeleton}
						castShadow
						receiveShadow
					/>
					<primitive object={nodes._rootJoint} />
				</group>
			</group>
		</RigidBody>
	);
};

useGLTF.preload("./models/Fox/glTF/Fox.gltf");

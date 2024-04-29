import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { useGLTF, useAnimations, useKeyboardControls } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody, useRapier } from "@react-three/rapier";
import { useControls } from "leva";
import { type RigidBody as NativeRigidBody } from "@dimforge/rapier3d-compat/dynamics/rigid_body.ts";

import { keyboardControlsEntries } from "../../../constants/keyboardControlsEntries";

import { getDirectionOffset } from "../../../helpers/directions";

import { useExperience } from "../../../stores/useExperience";

type GLTFResult = GLTF & {
	nodes: {
		fox: THREE.SkinnedMesh;
		_rootJoint: THREE.Bone;
	};
	materials: {
		fox_material: THREE.MeshStandardMaterial;
	};
};
type ActionName = "Survey" | "Walk" | "Run";
type GLTFActions = Record<ActionName, THREE.AnimationAction>;

const walkPosition = new THREE.Vector3();
const rotateAngle = new THREE.Vector3(0, 1, 0);
const rotateQuaternion = new THREE.Quaternion();
const smoothRotateQuaternion = new THREE.Quaternion();

export function FoxModel(props: JSX.IntrinsicElements["group"]) {
	const cameraTarget = useExperience((state) => state.cameraTarget);

	const [, getKeyboardKeys] =
		useKeyboardControls<(typeof keyboardControlsEntries)[number]["name"]>();

	const [animationName, setActionName] = useState<ActionName>("Survey");

	const physicBody = useRef<NativeRigidBody>(null);
	const rootGroupRef = useRef<THREE.Group>(null);

	const { camera } = useThree();
	const { rapier, world } = useRapier();
	const { nodes, materials, animations } = useGLTF(
		"./models/Fox/glTF/Fox.gltf"
	) as GLTFResult;
	const { actions: foxActions, names: actionsNames } = useAnimations<
		(typeof animations)[number]
	>(animations, rootGroupRef);

	const availableActions = foxActions as GLTFActions;

	useControls("Fox", {
		animationName: {
			options: actionsNames,
			onChange: (nextValue: ActionName) => setActionName(nextValue),
		},
	});

	useEffect(() => {
		const action = availableActions[animationName as ActionName];
		action.reset().fadeIn(0.5).play();

		return () => {
			action.fadeOut(0.5);
		};
	}, [animationName, availableActions]);

	useFrame((_, delta) => {
		if (!physicBody.current) return;

		const keyboardKeys = getKeyboardKeys();
		const bodyTranslation = physicBody.current.translation();

		/** Catch the current action  */
		let nextAction: ActionName = "Survey";

		if (
			(keyboardKeys.forward ||
				keyboardKeys.backward ||
				keyboardKeys.leftward ||
				keyboardKeys.rightward) &&
			keyboardKeys.run
		)
			nextAction = "Run";
		else if (
			keyboardKeys.forward ||
			keyboardKeys.backward ||
			keyboardKeys.leftward ||
			keyboardKeys.rightward
		)
			nextAction = "Walk";
		else nextAction = "Survey";

		if (animationName !== nextAction) setActionName(nextAction);

		if (nextAction === "Survey") return;

		/** Update the translation & rotation of the physic body */
		const newDirectionCameraAngleY = Math.atan2(
			physicBody.current.translation().x - camera.position.x,
			physicBody.current.translation().z - camera.position.z
		);
		const newDirectionOffset = getDirectionOffset(keyboardKeys);

		rotateQuaternion.setFromAxisAngle(
			rotateAngle,
			newDirectionCameraAngleY + newDirectionOffset
		);
		smoothRotateQuaternion.slerp(rotateQuaternion, 10 * delta);

		physicBody.current.setNextKinematicRotation(smoothRotateQuaternion);

		camera.getWorldDirection(walkPosition);
		walkPosition.y = 0;
		walkPosition.normalize();
		walkPosition.applyAxisAngle(rotateAngle, newDirectionOffset);

		const velocity = animationName == "Run" ? 10 : 5;

		const moveX = walkPosition.x * velocity * delta;
		const moveZ = walkPosition.z * velocity * delta;

		/** Update the Camera position (and target) */
		cameraTarget.set(
			bodyTranslation.x,
			bodyTranslation.y + 1,
			bodyTranslation.z
		);

		camera.lookAt(cameraTarget);

		/** Limit the physic body from leaving the room */
		const nextFoxPosition = {
			x: bodyTranslation.x + moveX,
			y: bodyTranslation.y,
			z: bodyTranslation.z + moveZ,
		} as const;

		const direction = { x: 0, y: -1, z: 0 };
		const ray = new rapier.Ray(
			{ ...nextFoxPosition, y: nextFoxPosition.y - 0.31 },
			direction
		);
		const hit = world.castRay(ray, 10, true);

		if (hit?.toi !== undefined) {
			camera.position.x += moveX;
			camera.position.z += moveZ;
			physicBody.current.setNextKinematicTranslation(nextFoxPosition);
		}
	});
	return (
		<>
			<RigidBody
				ref={physicBody}
				colliders="cuboid"
				type="kinematicPosition"
				position={[-1, 0, 0]}
			>
				<group ref={rootGroupRef} {...props} dispose={null}>
					<group>
						<group name="root">
							<skinnedMesh
								name="fox"
								geometry={nodes.fox.geometry}
								material={materials.fox_material}
								skeleton={nodes.fox.skeleton}
								castShadow
								receiveShadow
							/>
							<primitive object={nodes._rootJoint} />
						</group>
					</group>
				</group>
			</RigidBody>
		</>
	);
}

useGLTF.preload("/Fox.gltf");

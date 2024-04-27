import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useGLTF, useAnimations } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useControls } from "leva";

import foxResource from "../../assets/models/Fox/glTF/Fox.gltf?url";

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

export function FoxModel(props: JSX.IntrinsicElements["group"]) {
	const group = useRef<THREE.Group>(null);
	const { nodes, materials, animations } = useGLTF(foxResource) as GLTFResult;
	const { actions: foxActions, names: actionsNames } = useAnimations<
		(typeof animations)[number]
	>(animations, group);
	const actions = foxActions as GLTFActions;

	const { animationName } = useControls({
		animationName: { options: actionsNames },
	});

	useEffect(() => {
		const action = actions[animationName as ActionName];
		action.reset().fadeIn(0.5).play();

		return () => {
			action.fadeOut(0.5);
		};
	}, [animationName, actions]);

	return (
		<group ref={group} {...props} dispose={null}>
			<group>
				<group name="root">
					<skinnedMesh
						name="fox"
						geometry={nodes.fox.geometry}
						material={materials.fox_material}
						skeleton={nodes.fox.skeleton}
					/>
					<primitive object={nodes._rootJoint} />
				</group>
			</group>
		</group>
	);
}

useGLTF.preload("/Fox.gltf");

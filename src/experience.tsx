import {
	Float,
	MeshReflectorMaterial,
	OrbitControls,
	Text,
} from "@react-three/drei";

export const Experience = () => {
	return (
		<>
			<OrbitControls makeDefault />
			<ambientLight intensity={1.5} />
			<directionalLight position={[1, 2, 3]} intensity={4.5} />

			<Float>
				<Text position={[0, 1, 0]} textAlign="center">
					R3F
				</Text>
			</Float>

			<mesh position={[0, -1, 0]} rotation={[-Math.PI * 0.5, 0, 0]} scale={10}>
				<planeGeometry />
				<MeshReflectorMaterial
					mirror={1}
					resolution={512}
					blur={[1000, 1000]}
					mixBlur={0.8}
				/>
			</mesh>
		</>
	);
};

import { Float, OrbitControls, Text } from "@react-three/drei";
import { useControls } from "leva";
import { Perf } from "r3f-perf";

export const Experience = () => {
	const levaControls = useControls({
		textPosition: { value: { x: 0, y: 1, z: 1 }, step: 0.01 },
		textColor: "#00ff00",
	});

	return (
		<>
			<Perf position="top-left" />

			<OrbitControls makeDefault />
			<ambientLight intensity={1.5} />
			<directionalLight position={[1, 2, 3]} intensity={4.5} />

			<Float>
				<Text
					position={[
						levaControls.textPosition.x,
						levaControls.textPosition.y,
						levaControls.textPosition.z,
					]}
					textAlign="center"
					color={levaControls.textColor}
				>
					R3F
				</Text>
			</Float>

			<mesh position={[0, -1, 0]} rotation={[-Math.PI * 0.5, 0, 0]} scale={10}>
				<planeGeometry />
				<meshBasicMaterial color={levaControls.textColor} />
			</mesh>
		</>
	);
};

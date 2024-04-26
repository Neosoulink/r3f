import { Suspense, useRef } from "react";
import { Mesh } from "three";
import { Float, Html, OrbitControls, Stage, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { Perf } from "r3f-perf";

export const Experience = () => {
	const levaControls = useControls({
		textPosition: { value: { x: 0, y: 1, z: 1 }, step: 0.01 },
		textColor: "#00ff00",
	});

	const cubeRef = useRef<Mesh>(null);

	useFrame((_, delta) => {
		cubeRef.current?.rotateY(delta);
	});

	return (
		<Suspense>
			<Perf position="top-left" />

			<OrbitControls makeDefault />

			<color args={["ivory"]} attach="background" />

			<Stage
				shadows={{ type: "contact", opacity: 1, blur: 2 }}
				environment="sunset"
				preset="portrait"
				intensity={6}
			>
				<Suspense fallback={<Html>Loading text...</Html>}>
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
				</Suspense>

				<mesh ref={cubeRef}>
					<boxGeometry />
					<meshStandardMaterial color="purple" />
				</mesh>

				<mesh
					position={[0, -1.01, 0]}
					rotation={[-Math.PI * 0.5, 0, 0]}
					scale={10}
				>
					<planeGeometry />
					<meshStandardMaterial color={levaControls.textColor} />
				</mesh>
			</Stage>
		</Suspense>
	);
};

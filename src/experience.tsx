import { Suspense, useRef } from "react";
import { Mesh } from "three";
import {
	Float,
	Html,
	OrbitControls,
	Sky,
	Stage,
	Text,
	useGLTF,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { Perf } from "r3f-perf";

import helmetModelResource from "./assets/models/FlightHelmet/glTF/FlightHelmet.gltf?url";
import { FoxModel } from "./components/models/fox";

export const Experience = () => {
	const helmetModel = useGLTF(helmetModelResource);
	const levaControls = useControls({
		textPosition: { value: { x: 0, y: 1, z: 1 }, step: 0.01 },
		textColor: "#00ff00",
	});

	const helmetModelRef = useRef<Mesh>(null);

	useFrame((_, delta) => {
		helmetModelRef.current?.rotateY(delta);
	});

	return (
		<Suspense>
			<Perf position="top-left" />

			<OrbitControls makeDefault />

			<Sky />

			<color args={["ivory"]} attach="background" />

			<Stage
				shadows={{
					type: "contact",
					opacity: 1,
					blur: 2,
					position: [0, 0.01, 0],
				}}
				environment="sunset"
				preset="portrait"
				intensity={8}
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

				<primitive ref={helmetModelRef} object={helmetModel.scene} scale={2} />

				<Suspense fallback={<Html>Loading..</Html>}>
					<FoxModel scale={0.02} position={[-2, 0, 0]} />
				</Suspense>

				<mesh
					position={[0, -0.1, 0]}
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

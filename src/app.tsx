import { Canvas } from "@react-three/fiber";
import { KeyboardControls } from "@react-three/drei";

import { keyboardControlsEntries } from "./constants/keyboardControlsEntries";

import { Experience } from "./experience";

export const App = () => {
	return (
		<KeyboardControls map={keyboardControlsEntries}>
			<Canvas
				camera={{
					fov: 45,
					near: 0.01,
					far: 250,
					position: [-4, 3.5, 8],
				}}
				shadows
			>
				<Experience />
			</Canvas>
		</KeyboardControls>
	);
};

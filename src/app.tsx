import { Canvas } from "@react-three/fiber";
import { Experience } from "./experience";

export const App = () => {
	return (
		<Canvas
			shadows={true}
			camera={{
				fov: 45,
				near: 0.1,
				far: 200,
				position: [-4, 3, 6],
			}}
		>
			<Experience />
		</Canvas>
	);
};

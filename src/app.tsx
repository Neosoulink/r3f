import { Canvas } from "@react-three/fiber";
import { Experience } from "./experience";
import { Leva } from "leva";

export const App = () => {
	return (
		<>
			<Leva collapsed />

			<Canvas>
				<Experience />
			</Canvas>
		</>
	);
};

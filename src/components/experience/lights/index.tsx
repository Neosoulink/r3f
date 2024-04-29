import { Sky } from "@react-three/drei";
import { useControls } from "leva";

export const Lights = () => {
	const minMax = { max: 5, min: -5, step: 0.1 } as const;
	const lightsControls = useControls("Lights", {
		enable: true,
		enableSky: true,
		sunX: { value: 1, ...minMax },
		sunY: { value: -0.1, ...minMax },
		sunZ: { value: -3, ...minMax },
		intensity: { value: 3.2, ...minMax },
	});

	return (
		lightsControls.enable && (
			<>
				<directionalLight
					intensity={lightsControls.intensity}
					position={[
						lightsControls.sunX,
						lightsControls.sunY,
						lightsControls.sunZ,
					]}
					castShadow
					shadow-mapSize={[1024, 1024]}
					shadow-camera-near={1}
					shadow-camera-far={10}
					shadow-camera-top={1}
					shadow-camera-right={10}
					shadow-camera-bottom={-10}
					shadow-camera-let={-10}
				/>
				<ambientLight intensity={lightsControls.intensity / 5} />
				{lightsControls.enableSky && (
					<Sky
						sunPosition={[
							lightsControls.sunX,
							lightsControls.sunY,
							lightsControls.sunZ,
						]}
					/>
				)}
			</>
		)
	);
};

import { useMatcapTexture } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useControls } from "leva";

export const Floor = () => {
	const { color, matCap } = useControls("Floor", {
		color: { label: "Color", value: "#00ff00" },
		matCap: {
			label: "MatCap Texture",
			options: {
				default: "6E524D_8496C5_AF6624_100B11",
				accent: "7B5254_E9DCC7_B19986_C8AC91",
			},
		},
	});

	const [floorMatCap] = useMatcapTexture(matCap);

	return (
		<RigidBody type="fixed" gravityScale={1} friction={1}>
			<mesh position={[0, -1.1, 0]}>
				<boxGeometry args={[10, 2, 10]} />
				<meshMatcapMaterial matcap={floorMatCap} color={color} />
			</mesh>
		</RigidBody>
	);
};

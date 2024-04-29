import { Lights } from "./components/experience/lights";
import { Shadows } from "./components/experience/shadows";
import { Debug } from "./components/experience/debug";
import { SuspenseLoader3D } from "./components/experience/common/suspense-loader-3d";
import { Floor } from "./components/experience/floor";
import { InstancedBalls } from "./components/experience/instanced-balls";
import { FoxModel } from "./components/experience/models/fox";
import { PhysicsWorld } from "./components/experience/physics";

export const Experience = () => (
	<>
		<Debug />
		<Lights />
		<Shadows />

		<PhysicsWorld>
			<SuspenseLoader3D>
				<InstancedBalls />

				<FoxModel scale={[0.02, 0.02, 0.02]} />

				<Floor />
			</SuspenseLoader3D>
		</PhysicsWorld>
	</>
);

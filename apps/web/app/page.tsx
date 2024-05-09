"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls } from "@react-three/drei";
import { Leva } from "leva";

import { keyboardControlsEntries } from "@/constants/keyboardControlsEntries";

import { Lights } from "@/components/experience/lights";
import { Shadows } from "@/components/experience/shadows";
import { Debug } from "@/components/experience/debug";
import { PhysicsWorld } from "@/components/experience/physics";
import { World } from "./components/world";

export default function Page() {
	const [clientReady, setClientReady] = useState(false);

	useEffect(() => {
		setClientReady(true);
	}, []);

	return (
		clientReady && (
			<>
				<Leva collapsed />
				<KeyboardControls map={keyboardControlsEntries}>
					<Canvas
						camera={{
							fov: 45,
							near: 0.01,
							far: 250,
							position: [-4, 5, 8],
						}}
						shadows
					>
						<Debug />
						<Lights />
						<Shadows />

						<PhysicsWorld>
							<World />
						</PhysicsWorld>
					</Canvas>
				</KeyboardControls>
			</>
		)
	);
}

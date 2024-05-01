"use client";

import * as THREE from "three";
import React, { useCallback, useEffect, useState } from "react";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRapier } from "@react-three/rapier";
import { keyboardControlsEntries } from "@/constants/keyboardControlsEntries";

import { getDirectionOffset } from "@/lib/directions";

import { useExperience } from "@/hooks/useExperience";
import { useSocketConnection } from "@/hooks/useSocketConnection";

import { SuspenseLoader3D } from "@/components/experience/common/suspense-loader-3d";
import { Floor } from "@/components/experience/floor";
import { InstancedBalls } from "@/components/experience/instanced-balls";
import { ActionName, FoxModel } from "@/components/experience/models/fox";

export interface PeerState {
	id: string;
	position: THREE.Vector3;
	rotation: THREE.Quaternion;
	actionName: ActionName;
}

const walkPosition = new THREE.Vector3();
const rotateAngle = new THREE.Vector3(0, 1, 0);
const rotateQuaternion = new THREE.Quaternion();
const smoothedFoxRotation = new THREE.Quaternion();
const currentFoxPosition = new THREE.Vector3();
const currentFoxRotation = new THREE.Quaternion();

let frameCount = 0;

export const World = () => {
	const { socket } = useSocketConnection();

	const cameraTarget = useExperience((state) => state.cameraTarget);

	const [, getKeyboardKeys] =
		useKeyboardControls<(typeof keyboardControlsEntries)[number]["name"]>();

	const [peers, setPeers] = useState<PeerState[]>([]);
	const [currentFoxAction, setCurrentFoxAction] =
		useState<ActionName>("Survey");

	const { camera } = useThree();
	const { rapier, world } = useRapier();

	const onPlayerConnect = useCallback((peer: PeerState) => {
		if (!peer) return;

		setPeers((prev) => [...prev, peer]);
	}, []);

	const onPlayerMove = useCallback(
		(peer: PeerState) => {
			setPeers((prevPeers) =>
				prevPeers.map((localPeer) =>
					localPeer.id === peer.id ? { ...localPeer, ...peer } : localPeer
				)
			);
		},
		[peers]
	);

	useEffect(() => {
		socket.on("player_joined", onPlayerConnect);
		socket.on("move", onPlayerMove);

		return () => {
			socket.off("player_joined", onPlayerConnect);
			socket.off("move", onPlayerMove);
		};
	}, [onPlayerConnect]);

	useFrame((_, delta) => {
		frameCount++;

		const keyboardKeys = getKeyboardKeys();
		let nextAction: ActionName = "Survey";

		if (
			(keyboardKeys.forward ||
				keyboardKeys.backward ||
				keyboardKeys.leftward ||
				keyboardKeys.rightward) &&
			keyboardKeys.run
		)
			nextAction = "Run";
		else if (
			keyboardKeys.forward ||
			keyboardKeys.backward ||
			keyboardKeys.leftward ||
			keyboardKeys.rightward
		)
			nextAction = "Walk";

		if (currentFoxAction !== nextAction) {
			setCurrentFoxAction(nextAction);

			if (nextAction === "Survey") {
				socket.emit("move", {
					position: currentFoxPosition,
					rotation: {
						w: currentFoxRotation.w,
						x: currentFoxRotation.x,
						y: currentFoxRotation.y,
						z: currentFoxRotation.z,
					},
					actionName: nextAction,
					roomName: "experience",
				});
			}
		}

		if (nextAction === "Survey") return;

		const newDirectionCameraAngleY = Math.atan2(
			currentFoxPosition.x - camera.position.x,
			currentFoxPosition.z - camera.position.z
		);
		const newDirectionOffset = getDirectionOffset(keyboardKeys);

		rotateQuaternion.setFromAxisAngle(
			rotateAngle,
			newDirectionCameraAngleY + newDirectionOffset
		);
		smoothedFoxRotation.slerp(rotateQuaternion, 10 * delta);
		currentFoxRotation.copy(smoothedFoxRotation);

		camera.getWorldDirection(walkPosition);
		walkPosition.y = 0;
		walkPosition.normalize();
		walkPosition.applyAxisAngle(rotateAngle, newDirectionOffset);

		const velocity = currentFoxAction == "Run" ? 10 : 5;

		const moveX = walkPosition.x * velocity * delta;
		const moveZ = walkPosition.z * velocity * delta;

		cameraTarget.set(
			currentFoxPosition.x,
			currentFoxPosition.y + 1,
			currentFoxPosition.z
		);

		camera.lookAt(cameraTarget);

		const nextFoxPosition = {
			x: currentFoxPosition.x + moveX,
			y: currentFoxPosition.y,
			z: currentFoxPosition.z + moveZ,
		} as const;

		const rayDirection = { x: 0, y: -1, z: 0 };
		const worldRay = new rapier.Ray(
			{ ...nextFoxPosition, y: nextFoxPosition.y - 0.31 },
			rayDirection
		);
		const hit = world.castRay(worldRay, 10, true);
		if (hit?.toi === undefined) return;

		camera.position.x += moveX;
		camera.position.z += moveZ;
		currentFoxPosition.copy(nextFoxPosition);

		if (frameCount % 10 === 0) {
			socket.emit("move", {
				position: nextFoxPosition,
				rotation: {
					w: smoothedFoxRotation.w,
					x: smoothedFoxRotation.x,
					y: smoothedFoxRotation.y,
					z: smoothedFoxRotation.z,
				},
				actionName: currentFoxAction,
				roomName: "experience",
			});
		}
	});

	return (
		<SuspenseLoader3D>
			<InstancedBalls />

			<FoxModel
				root={{ scale: [0.02, 0.02, 0.02] }}
				position={currentFoxPosition}
				rotation={currentFoxRotation}
				actionName={currentFoxAction}
			/>

			{peers.map((peer) => (
				<FoxModel
					key={peer.id}
					id={peer.id}
					root={{ scale: [0.02, 0.02, 0.02] }}
					position={peer.position}
					rotation={peer.rotation}
					actionName={peer.actionName}
				/>
			))}

			<Floor />
		</SuspenseLoader3D>
	);
};

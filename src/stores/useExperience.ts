import { Vector3 } from "three";
import { create } from "zustand";

interface BearState {
	cameraTarget: Vector3;
	setCameraTarget: (value: Vector3) => void;
}

export const useExperience = create<BearState>()((set) => ({
	cameraTarget: new Vector3(),
	setCameraTarget: (value) => set(() => ({ cameraTarget: value })),
}));

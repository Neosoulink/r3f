import { type KeyboardControlsEntry } from "@react-three/drei";

export const keyboardControlsEntries: KeyboardControlsEntry<
	"forward" | "backward" | "leftward" | "rightward" | "grab" | "run" | "jump"
>[] = [
	{
		name: "forward",
		keys: ["ArrowUp", "KeyW"],
	},
	{
		name: "backward",
		keys: ["ArrowDown", "KeyS"],
	},
	{
		name: "leftward",
		keys: ["ArrowLeft", "KeyA"],
	},
	{
		name: "rightward",
		keys: ["ArrowRight", "KeyD"],
	},
	{ name: "grab", keys: ["KeyQ"] },
	{ name: "run", keys: ["Shift"] },
	{ name: "jump", keys: ["Space"] },
];

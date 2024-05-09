import { keyboardControlsEntries } from "../constants/keyboardControlsEntries";

/**
 * @source-author **tamani-coding**
 *
 * @see https://github.dev/tamani-coding/threejs-character-controls-example
 */
export const getDirectionOffset = ({
	forward,
	backward,
	leftward,
	rightward,
}: Record<(typeof keyboardControlsEntries)[number]["name"], boolean>) => {
	let directionOffset = 0; // w

	if (forward) {
		if (leftward) {
			directionOffset = Math.PI / 4; // w+a
		} else if (rightward) {
			directionOffset = -Math.PI / 4; // w+d
		}
	} else if (backward) {
		if (leftward) {
			directionOffset = Math.PI / 4 + Math.PI / 2; // s+a
		} else if (rightward) {
			directionOffset = -Math.PI / 4 - Math.PI / 2; // s+d
		} else {
			directionOffset = Math.PI; // s
		}
	} else if (leftward) {
		directionOffset = Math.PI / 2; // a
	} else if (rightward) {
		directionOffset = -Math.PI / 2; // d
	}

	return directionOffset;
};

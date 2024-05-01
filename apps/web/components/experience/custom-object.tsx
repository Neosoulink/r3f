import { useEffect, useMemo, useRef } from "react";
import { BufferGeometry, DoubleSide, NormalBufferAttributes } from "three";

export const CustomObject = () => {
	const verticesCount = 10 * 3;
	const positions = useMemo(() => {
		const _pos = new Float32Array(verticesCount * 3);

		for (let i = 0; i < verticesCount * 3; i++) {
			_pos[i] = (Math.random() - 0.5) * 3;
		}
		return _pos;
	}, [verticesCount]);

	const bufferGeometryRef =
		useRef<BufferGeometry<NormalBufferAttributes>>(null);

	useEffect(() => {
		bufferGeometryRef.current?.computeVertexNormals();
	}, []);

	return (
		<mesh>
			<bufferGeometry ref={bufferGeometryRef}>
				<bufferAttribute
					attach="attributes-position"
					count={verticesCount}
					itemSize={3}
					array={positions}
				/>
			</bufferGeometry>
			<meshStandardMaterial color="red" side={DoubleSide} />
		</mesh>
	);
};

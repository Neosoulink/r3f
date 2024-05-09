import { type PropsWithChildren, Suspense } from "react";
import { Loader3D } from "./loader-3d";

export const SuspenseLoader3D = ({ children }: PropsWithChildren) => (
	<Suspense fallback={<Loader3D />}>{children}</Suspense>
);

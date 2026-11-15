/** Pose of the 3D dress, written by the scroll timeline and eased toward every frame. */
export type DressPose = { rotY: number };

/**
 * Rotation (radians) when the section pins: facing front, one turn "wound up"
 * so the pinned scroll can unwind a full 360° back to the front.
 */
export const TURN_START = -Math.PI * 2;

/** Before the section scrolls in: turned to its side. */
export const INITIAL_POSE: DressPose = { rotY: TURN_START - 1.1 };

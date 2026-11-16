/**
 * Pose of the 3D dress, eased toward every frame.
 * rotY is driven by the page scroll; userY is the extra turn the visitor adds by
 * dragging, swiping or scrolling sideways, and is kept as the page scrolls.
 */
export type DressPose = { rotY: number; userY: number };

/**
 * Rotation (radians) when the section pins: facing front, one turn "wound up"
 * so the pinned scroll can unwind a full 360° back to the front.
 */
export const TURN_START = -Math.PI * 2;

/** Before the section scrolls in: turned to its side. */
export const INITIAL_POSE: DressPose = { rotY: TURN_START - 1.1, userY: 0 };

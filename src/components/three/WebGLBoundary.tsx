"use client";

import { Component, type ReactNode } from "react";

type Props = { fallback: ReactNode; children: ReactNode };
type State = { failed: boolean };

/**
 * Catches errors from the 3D scene (no WebGL, out of GPU memory, a failed
 * model load) and shows the fallback instead of taking the whole page down.
 */
export class WebGLBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("3D scene disabled, showing fallback image:", error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

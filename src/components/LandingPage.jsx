import * as THREE from "three";
import React, { useRef, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import { EffectComposer, DepthOfField } from "@react-three/postprocessing";

const count = 200;
const depth = 20;

const Flower = ({ z }) => {
  // const [clicked, setClicked] = useState(false);
  const ref = useRef();
  const { nodes, materials } = useGLTF("/new_primula-v2-transformed.glb");
  // const { nodes, materials } = useGLTF("/olive_small-v1-transformed.glb");

  const { viewport, camera } = useThree();
  const { width, height } = viewport.getCurrentViewport(camera, [0, 0, z]);

  const [data] = useState({
    x: THREE.MathUtils.randFloatSpread(2),
    y: THREE.MathUtils.randFloatSpread(viewport.height),
    rX: Math.random() * Math.PI,
    rY: Math.random() * Math.PI,
    rZ: Math.random() * Math.PI,
  });

  useFrame((state) => {
    ref.current.rotation.set(
      (data.rX += 0.01),
      (data.rY += 0.01),
      (data.rZ += 0.01)
    );
    ref.current.position.set(data.x * width, (data.y += 0.15), z);
    if (data.y > height) {
      data.y = -height;
    }
  });

  return (
    <mesh
      ref={ref}
      geometry={nodes.flower1.geometry}
      material={materials.skin}
      // material-emissive="orange"
      scale={2}
    />
  );
};
//! ojo -> habe count input in Component
export default function LandingPage() {
  return (
    <Canvas gl={{ alpha: false }} camera={{ near: 0.5, far: 110, fov: 60 }}>
      <color attach="background" args={["#fa65b0"]} />
      <ambientLight intensity={0.8} />
      <spotLight position={[10, 10, 10]} intensity={0.4} />
      <Suspense fallback={null}>
        <Environment
          background={"only"}
          files="/artur-luczka-loAfOVk1eNc-unsplash.hdr"
        />
        {Array.from({ length: count }, (_, i) => (
          <Flower key={i} z={(-i / count) * depth - 20} />
        ))}
        <EffectComposer>
          <DepthOfField
            target={[0, 0, depth / 2]}
            focalLength={0.4}
            bokehScale={1}
            height={600}
          />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}

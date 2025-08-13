import { CameraControls, Environment, Gltf, Html } from "@react-three/drei";
import { useEffect, useState } from "react";

const CameraManager = () => {
  return (
    <CameraControls
      // maxAzimuthAngle={Math.PI / 2}
      // minAzimuthAngle={-Math.PI / 2}
      maxPolarAngle={(2 * Math.PI) / 3}
      minPolarAngle={Math.PI / 3}
      zoom={true}
      mouseButtons={{
        left: 1,   // select / left-drag (for areas not covered by iframe)
        right: 2,  // allow right-drag orbit even when iframe needs left-click
        wheel: 16,
      }}
      touches={{ one: 32, two: 512 }}
    />
  );
};

const Scene = () => {
  // URLs to photos to display on the left screen
  const photos = [
    "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=1280&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1520975661595-6453be3f7070?w=1280&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1280&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=1280&q=80&auto=format&fit=crop",
  ];
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setPhotoIndex((i) => (i + 1) % photos.length);
    }, 3000); // change image every 3 seconds
    return () => clearInterval(id);
  }, [photos.length]);
  return (
    <>
      <CameraManager />
      <Environment preset="sunset" />
      <ambientLight intensity={0.6} />
      <Gltf
        src="/models/classroom.glb"
        position={[110, -140, 40]}
        rotation={[0, Math.PI, 0]}
      />

      {/* Center frame with YouTube video (smaller and farther) */}
      <group position={[0, 0, -1.5]}>
        {/* Inner dark panel (slightly smaller) */}
        <mesh position={[0, 0, -0.01]}> 
          <planeGeometry args={[1.2, 0.7]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        {/* Outer border/backing */}
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[1.3, 0.8]} />
          <meshStandardMaterial color="#696969" />
        </mesh>

        {/* YouTube iframe projected in 3D space */}
        <Html transform sprite distanceFactor={1.8} zIndexRange={[200, 200]}>
          <div
            style={{
              width: "640px",
              height: "360px",
              border: "2px solid #ffffff",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 8px 24px rgba(0,0,0,0.45)",
              background: "#000",
              // pointer events enabled so the YouTube controls work
              pointerEvents: "auto",
            }}
          >
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&playsinline=1&rel=0&controls=1&modestbranding=1"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </Html>
      </group>

      {/* Left screen-like frame (further left, tilted toward user) */}
      <group position={[-3.0, 0, -1.4]} rotation={[0, 0.35, 0]}>
        {/* Inner dark panel */}
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[1.0, 0.6]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        {/* Outer border/backing */}
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[1.1, 0.7]} />
          <meshStandardMaterial color="#606060" />
        </mesh>
        {/* Html image container; ignore pointer events to keep camera free */}
        <Html transform sprite distanceFactor={2.0} zIndexRange={[180, 180]}>
          <div
            style={{
              width: "480px",
              height: "270px",
              border: "2px solid #ffffff",
              borderRadius: "6px",
              background: "#000",
              boxShadow: "0 6px 18px rgba(0,0,0,0.4)",
              overflow: "hidden",
              pointerEvents: "none",
            }}
          >
            <img
              src={photos[photoIndex]}
              alt="slideshow"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        </Html>
      </group>
      
      {/* Right screen-like frame (further right, tilted toward user) */}
      <group position={[3.0, 0, -1.4]} rotation={[0, -0.35, 0]}>
        {/* Inner dark panel */}
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[1.0, 0.6]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        {/* Outer border/backing */}
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[1.1, 0.7]} />
          <meshStandardMaterial color="#606060" />
        </mesh>
        {/* Html scrollable text panel; pointer events enabled for scrolling */}
        <Html transform distanceFactor={2.0} portal={document.body} zIndexRange={[90, 90]}>
          <div
            style={{
              width: "480px",
              height: "270px",
              border: "2px solid #ffffff",
              borderRadius: "6px",
              background: "#111",
              boxShadow: "0 6px 18px rgba(0,0,0,0.4)",
              color: "#e6e6e6",
              overflowY: "auto",
              overflowX: "hidden",
              padding: "14px 16px",
              lineHeight: 1.4,
              fontSize: "14px",
              pointerEvents: "auto",
              overscrollBehavior: "contain",
            }}
          >
            <h3 style={{margin: "0 0 8px", fontSize: "18px", color: "#fff"}}>Video Notes</h3>
            <p style={{margin: "0 0 10px", opacity: 0.9}}>
              Highlights and key takeaways from the reel.
            </p>
            <ul style={{paddingLeft: 18, margin: "0 0 10px"}}>
              <li>Core idea explained in under 30 seconds.</li>
              <li>Two practical tips you can apply today.</li>
              <li>One advanced concept to explore further.</li>
            </ul>
            <h4 style={{margin: "10px 0 6px", fontSize: "16px", color: "#f5d76e"}}>Timestamps</h4>
            <ul style={{paddingLeft: 18, margin: 0}}>
              <li>0:05 — Hook</li>
              <li>0:12 — Main concept</li>
              <li>0:22 — Tip #1</li>
              <li>0:27 — Tip #2</li>
              <li>0:35 — Wrap up</li>
            </ul>
            <h4 style={{margin: "12px 0 6px", fontSize: "16px", color: "#8bd3ff"}}>Resources</h4>
            <p style={{margin: 0}}>
              See also: best practices, reference docs, and full tutorial.
            </p>
          </div>
        </Html>
      </group>
    </>
  );
};

export default Scene;

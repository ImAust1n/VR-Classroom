import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";
import { LoadingScreen } from "./components/LoadingScreen";
import { Suspense, useRef, useState } from "react";

const App = () => {
  const [start, setStart] = useState(false);
  const containerRef = useRef(null);

  const toggleFullscreen = async () => {
    const doc = document;
    // Prefer requesting fullscreen on the Canvas CONTAINER so Html overlays remain visible
    const elem = containerRef.current || doc.documentElement;
    const isFs = !!(
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement
    );

    try {
      if (!isFs) {
        const req =
          elem.requestFullscreen ||
          elem.webkitRequestFullscreen ||
          elem.mozRequestFullScreen ||
          elem.msRequestFullscreen;
        if (req) {
          const r = req.call(elem);
          if (r && typeof r.then === 'function') {
            await r;
          }
        }
        // try to lock orientation if supported (best-effort)
        if (screen.orientation && screen.orientation.lock) {
          try { await screen.orientation.lock('landscape'); } catch (_) {}
        }
      } else {
        const exit =
          doc.exitFullscreen ||
          doc.webkitExitFullscreen ||
          doc.mozCancelFullScreen ||
          doc.msExitFullscreen;
        if (exit) {
          const r = exit.call(doc);
          if (r && typeof r.then === 'function') {
            await r;
          }
        }
      }
    } catch (e) {
      console.warn('Fullscreen request failed:', e);
    }
  };
  return (
    <>
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          overflow: 'visible',
        }}
      >
        <Canvas
          camera={{
            position: [0, 0, 1],
          }}
        >
          {/* <Scene /> */}
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>
      <LoadingScreen started={start} onStarted={() => setStart(true)} />
      {/* Fixed bottom-left VR button overlay */}
      <button className="vrFixedBtn" onClick={toggleFullscreen}>
        Fullscreen
      </button>
    </>
  );
};

export default App;

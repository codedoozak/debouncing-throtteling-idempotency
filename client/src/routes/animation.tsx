import { useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import astronautImg from "../assets/astronaut/rb_12399.png";
import { throttle } from "../utils/functions";
export const Route = createFileRoute("/animation")({
  component: RouteComponent,
});

function RouteComponent() {
  const imageRef = useRef<null | HTMLImageElement>(null);
  const containerRef = useRef<null | HTMLDivElement>(null);

  let startTime;

  const animationHandler = () => {
    if (!startTime) {
      startTime = Date.now();
    }
    console.log("%canimating", "color:pink"); //"60px"
    let currentLeft = +imageRef.current.style.left.replace("px", "");
    currentLeft = +currentLeft + 3;
    imageRef.current.style.left = currentLeft + "px";

    if (Date.now() - startTime >= 2000) {
      startTime = undefined;
      imageRef.current.style.left = 0 + "px";
      containerRef.current.style.display = "none";
      console.log("%cAnimation Ended", "color:white ; background:green");
    } else {
      requestAnimationFrame(animationHandler);
    }
  };
  const startAnimation = () => {
    

    containerRef.current.style.display = "block";
    console.log("%cAnimation Started", "color:white ; background:blue;");
    animationHandler();
  };

  const throttledStartAnimation = throttle(startAnimation, 2000);
  return (
    <div>
      <button
        onClick={() => {
           throttledStartAnimation();
          //startAnimation();
        }}
      >
        animate
      </button>

      <div
        className="bg-red-500 relative w-full h-[260px] overflow-hidden "
        style={{ display: "none" }}
        ref={containerRef}
      >
        <img
          ref={imageRef}
          src={astronautImg}
          className="w-60 absolute left-[2px]"
          alt="astronauts"
        />
      </div>
    </div>
  );
}

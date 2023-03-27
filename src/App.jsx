import ReactDOM from "react-dom"
import { useHistory } from "react-router-dom";
import React, { Suspense, useEffect, useRef, useMemo } from "react"
import { Canvas, useLoader, useFrame } from "@react-three/fiber"
import { Html } from "@react-three/drei"
import { TextureLoader, LinearFilter } from "three"
import lerp from "lerp"
import { Text, MultilineText } from "./components/Text"
import Plane from "./components/Plane"
import { Block, useBlock } from "./blocks"
import state from "./store"
import "./styles.css"

function Startup() {
  const ref = useRef()
  useFrame(() => (ref.current.material.opacity = lerp(ref.current.material.opacity, 0, 0.025)))
  return <Plane ref={ref} color="#0e0e0f" position={[0, 0, 200]} scale={[100, 100, 1]} />
}

function Paragraph({ image, index, offset, factor, header, aspect, text }) {
  const { contentMaxWidth: w, canvasWidth, margin, mobile } = useBlock()
  const size = aspect < 1 && !mobile ? 0.75 : 1
  const alignRight = (canvasWidth - w * size - margin) / 2
  const pixelWidth = w * state.zoom * size
  const left = !(index % 2)
  const color = index % 2 ? "#e6e6e6" : "#e6e6e6"

  const history = useHistory();
  const handleReadMoreClick = () => {
    history.push(`/blog/${index}`);
  };

  return (
    <Block factor={factor} offset={offset}>
      <group position={[left ? -alignRight : alignRight, 0, 0]}>
        <Plane map={image} args={[1, 1, 32, 32]} shift={75} size={size} aspect={aspect} scale={[w * size, (w * size) / aspect, 1]} frustumCulled={false} />
        <Html
          style={{ width: pixelWidth / (mobile ? 1 : 2), textAlign: left ? "left" : "right" }}
          position={[left || mobile ? (-w * size) / 2 : 0, (-w * size) / 2 / aspect - 0.4, 1]}>
          <div style={{width: '50vw', textAlign: 'left', float: left ? "left" : "right"}} tabIndex={index}>{text}</div>
            <button className="read-more">Read more</button>
        </Html>
        <Text left={left} right={!left} size={w * 0.04} color={color} top position={[((left ? -w : w) * size) / 2, (w * size) / aspect / 2 + 0.5, -1]}>
          {header}
        </Text>
        <Block factor={0.2}>
          <Text opacity={0.5} size={w * 0.5} color="#1A1E2A" position={[((left ? w : -w) / 2) * size, (w * size) / aspect / 1, -10]}>
            {"0" + (index + 1)}
          </Text>
        </Block>
      </group>
    </Block>
  )
}

function Content() {
  const images = useLoader(
    TextureLoader,
    state.paragraphs.map(({ image }) => image)
  )
  useMemo(() => images.forEach((texture) => (texture.minFilter = LinearFilter)), [images])
  const { contentMaxWidth: w, canvasWidth, canvasHeight, mobile } = useBlock()
  return (
    <>
      <Block factor={1} offset={0}>
        <Block factor={1.0}>
          <Text left size={w * 0.15} position={[-w / 1.6, 0.5, -1]} color="#e6e6e6">
            DAFFA
          </Text>
          <Text left size={w * 0.15} position={[-w / 1.6, 2.8, -1]} color="#e6e6e6">
            blog
          </Text>
        </Block>
        <Block factor={1.0}>
          <Html className="bottom-left" style={{ color: "white" }} position={[-canvasWidth / 2, -canvasHeight / 2, 0]}>
            Apa yang kamu cari.{mobile ? <br /> : " "}Mungkin tidak ada disini.
          </Html>
        </Block>
      </Block>
      {state.paragraphs.map((props, index) => (
        <Paragraph key={index} index={index} {...props} image={images[index]} />
      ))}
      {state.stripes.map(({ offset, color, height }, index) => (
        <Block key={index} factor={-1.0} offset={offset}>
          <Plane args={[40, height, 32, 32]} shift={-4} color={color} rotation={[0, 0, Math.PI / 8]} position={[0, 0, -10]} />
        </Block>
      ))}
      <Block factor={1.2} offset={5.7}>
        <MultilineText top left size={w * 0.15} lineHeight={w / 5} position={[-w / 3.5, 0, -1]} color="#e6e6e6" text={"not\nhow\nlong"} />
      </Block>
      <Block factor={0.6} offset={10.5}>
        <MultilineText top left size={w * 0.15} lineHeight={w / 6} position={[-w / 1.5, 1, -1]} color="#e6e6e6" text={"but\nhow\nwell?"} />
        <Html style={{ color: "white" }} className="bottom-left" position={[-canvasWidth / 2, -canvasHeight / 1.7, 0]}>
          2023 ©️ Daffa Aditya.
        </Html>
      </Block>
    </>
  )
}

function App() {
  const scrollArea = useRef()
  const onScroll = (e) => (state.top.current = e.target.scrollTop)
  useEffect(() => void onScroll({ target: scrollArea.current }), [])
  return (
    <>
      <Canvas linear dpr={[1, 2]} orthographic camera={{ zoom: state.zoom, position: [0, 0, 500] }}>
        <Suspense fallback={<Html center className="loading" children="Loading..." />}>
          <Content />
          <Startup />
        </Suspense>
      </Canvas>
      <div className="scrollArea" ref={scrollArea} onScroll={onScroll}>
        {new Array(state.sections).fill().map((_, index) => (
          <div key={index} id={"0" + index} style={{ height: '100dvh' }} />
        ))}
      </div>
    </>
  )
}

export default App

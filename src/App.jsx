import { Box, Float } from "@chakra-ui/react";
import Welcome from "./components/Welcome";
import Select from "./components/Select";
import { ColorModeButton } from "./components/ui/color-mode";
import React from "react";
import Main from "./components/Main";
import { longAnimation } from "./assets/constants";
import { main } from "framer-motion/client";
import { useRef, useState } from "react";
function App() {
  const [welcomeOverlayVisible, setWelcomeOverlayVisible] = useState(false)
  const [selectVisible, setSelectVisible] = useState(false)
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [mainVisible, setMainVisible] = useState(false)
  const titleText = useRef(null);
  function directToSelect() {
    setWelcomeOverlayVisible(true)
    setTimeout(() => {
      setSelectVisible(true)
    }, longAnimation * 1000)
  }
  function directToMain() {
    setMainVisible(true)
    if(titleText.current){
      titleText.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function openMain() { }
  return (
    <Box bg={{ base: '#ffff', _dark: 'var(--darkest)' }} minHeight={'100vh'}>

      <Box position={"fixed"} zIndex={101} right={5} top={5} >
        <ColorModeButton />
      </Box>

      {selectVisible ?
        <Select setActiveSlideIndex={setActiveSlideIndex} directToMain={directToMain} />
        : <Welcome welcomeOverlayVisible={welcomeOverlayVisible} directToSelect={directToSelect} />}
      {mainVisible ?
        <Main activeSlideIndex={activeSlideIndex} titleText={titleText} /> : null}
    </Box>
  );
}

export default App;
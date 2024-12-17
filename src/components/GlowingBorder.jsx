
import styled from "styled-components"
import { createGlobalStyle } from "styled-components"

const GlobalStyle = createGlobalStyle`
 @property --angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}

@keyframes spin {
  from {
    --angle: 0deg;
  }

  to {
    --angle: 360deg;
  }
}`

const Border = styled.div`

  --angle: 0deg;

  position: absolute;
  width:calc(100% + ${props => props.size});
  height: calc(100% + ${props => props.size});
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  background-image: conic-gradient(
    from var(--angle),
    ${props => props.firstcolor},
    ${props => props.secondcolor},
    ${props => props.firstcolor}
  );
  
  border-radius: inherit;
  z-index: -2;
  animation: spin infinite 4s linear;
  transition: 0.4s ease-in-out;
`

const BlurredBorder = styled(Border)`
  filter: blur(${props => props.blurradius});
  opacity: 1;
`

const GlowingBorder = (props) => {
    return (
  
        <Border className="border" size={props.size!=undefined?props.size+"px":"1.5px"}  firstcolor={props.firstColor} secondcolor={props.secondColor}>
        <GlobalStyle />
            <BlurredBorder className="border blurred"  size={props.size!=undefined?props.size+"px":"1.5px"} blurradius={props.blurRadius?props.blurRadius+"px":"4px"} firstcolor={props.firstColor||"#ff8800"} secondcolor={props.secondColor||"#ffff00"}>
            </BlurredBorder>
        </Border>
    
    )

}

export default GlowingBorder
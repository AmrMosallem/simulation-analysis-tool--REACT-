import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";
import styled from "styled-components";
import { ChevronUp, Github, Radio } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import GlowingBorder from "./GlowingBorder";
import React from "react";


const SwiperContainer = styled.section`
  position: relative;
  display: flex;
  align-items: center;
  gap: 50px;
  padding: 5px 10vw;
  color: #f9f9f9;
  *{
    box-sizing: border-box;
  }


.swiper {
  width: 100%;
  max-width: 1800px;
  height: 350px;
  max-height:calc(100dvh - 80px);
  border: 0cm solid white;
  background: var(--darkest);
  border-radius: 20px;
  box-shadow: 0px 0px 0px white;
  position:relative;
}

.swiper-slide {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: center;
  background-size: cover;
  background-position: center;  
  filter:blur(2px);
  transition: 0.5s;

}
.swiper-slide-active{
  filter:blur(0px);
}

.swiper-slide h2 {
  color: var(--darkest);
  font-weight: 700;
  font-size: 30px;
  line-height: 1.2;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-align: center;
  background:rgba(255, 255, 255, 0.6);
  width: 400px;
  max-width:75%;
  border-radius:24px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
  padding:15px 60px;
  margin:0;
  margin-bottom:5px;
  transition:0.5s
}

.swiper-slide div {
  position: absolute;
  z-index: 1;
  inset: 0;
  background: linear-gradient(rgba(140, 75, 0, 0) 55%, rgba(255, 255, 255, 0.8));
  transition: 0.3s;
  opacity: 0;
  align-self: stretch;
  padding-bottom: 50px;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-end;
  &:hover .overlay{
    opacity: 0.8;
  }
  &:hover h2{
    background:transparent;
  }
  &:hover .description-container{
    max-height:200px;
    bottom: 0px;
    }

}

.swiper-slide-active div {
  opacity: 1;
}

.swiper-slide > div .main-content {
  translate: 0 100px;
  transition: 0.5s;

}
.swiper-slide-active > div .main-content {
  translate: 0;
}
.description-container{
  color: var(--darkest);
  font-size: 18px;
  text-align: center;
  margin:0; 
  position: relative;
  max-height:0;
  bottom: -100px;
  transition: 0.5s;
  padding:10px;
  display:flex;
  flex-direction:column;
  gap:20px;
}
.overlay{
  position: absolute;
  z-index: 0;
  inset: 0;
  background:white;
  opacity: 0;
  transition: 0.5s;
}
.swiper-pagination-bullet,
.swiper-pagination-bullet-active {
  background: var(--darkest) !important;
}

.swiper-pagination {
  bottom: 10px !important;
  transform: scale(1.3);
}

@media (max-width: 650px) {

  .swiper-slide h2{
    font-size: 18px;
    max-width:95%;
    padding:15px 10px;
  }
  .description-container{
    font-size: 14px;
  }
}

`

export const CarouselSwiper = (props) => {

  const [mobileScreen, setMobileScreen] = React.useState(false);
  React.useEffect(() => {
    var x = window.matchMedia("(max-width: 650px)");
    setMobileScreen(x.matches);
    x.addEventListener("change", () => {
      setMobileScreen(x.matches);
    })
  }, []);
  return (
    <SwiperContainer>
      <Swiper
        grabCursor
        centeredSlides
        slidesPerView={mobileScreen ? 1 : 2}
        effect="coverflow"
        loop
        pagination={{ clickable: true }}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 3,
          slideShadows: true,
        }}
        modules={[Pagination, EffectCoverflow]}
        onSlideChange={(swiper) => {
          
          props.setActiveSlideIndex(swiper.realIndex);
        }}
      >
        {props.data.map((slide) => (
          <SwiperSlide
            key={slide.title}
            style={{
              backgroundImage: `url(${slide.image})`,
              borderRadius: "1rem",
            }}
          >
            <div>
              <span className="overlay"></span>
              <div className="main-content">
                <h2>{slide.title}</h2>
                <ChevronUp style={{ color: "var(--darkest)" }} size={mobileScreen ? 10 : 27} />
                <span className="description-container">
                  <span className="description-text" >{slide.description}</span>
                </span>
              </div>
            </div>
          </SwiperSlide>
        ))}

      </Swiper>
    </SwiperContainer>
  );
};

import imgHeroImage from "../../../public/img/logos/heroimg.jpg"
import "../../styles/components/hero.css"
export default function Hero() {
  return (
    <div className="hero">
      
      <div className="hero-text">
        <h1 className="hero-title">Learn, create, go live</h1>

        <p className="hero-description">
          Discover courses made for digital creators, gamers, and curious minds.
          <br />
          Level up your skills with streaming, programming, design, and wellness lessons — all in one place.
        </p>

        <button className="hero-button">Explore Courses</button>
      </div>

      
      <div className="hero-image">
        <img src={imgHeroImage} alt="Hero" />
      </div>
    </div>
  );
}

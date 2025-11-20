import imgImage from "../../../public/img/logos/clashroyale.jpg";
import imgImage1 from "../../../public/img/logos/vite.png";
import imgImage2 from "../../../public/img/logos/Gym-Star-Simulator-Discord-server.webp"
import "../../styles/components/cards.css"

function Card({ image, title, description }) {
  return (
    <div className="card">
      <div className="card-image">
        <img src={image} alt={title} />
      </div>

      <div className="card-text">
        <p className="card-title">{title}</p>
        <p className="card-description">{description}</p>
      </div>
    </div>
  );
}

export default function CardsSection() {
  return (
    <section className="cards-section">
      <h2 className="section-title">Variety of Courses</h2>

      <div className="cards-container">
        <Card
          image={imgImage}
          title="Professional in Clash Royale"
          description="Learn advanced strategies, deck management, and tournament preparation with experienced players."
        />
        <Card
          image={imgImage1}
          title="Introduction to React"
          description="Develop modern and dynamic web interfaces using React, JSX, and Hooks to create your own applications."
        />
        <Card
          image={imgImage2}
          title="Fitness for Creators"
          description="Improve your posture, energy, and healthy habits with simple routines designed for gamers and digital creators."
        />
      </div>
    </section>
  );
}

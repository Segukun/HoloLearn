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
      <h2 className="section-title">Variedad de cursos</h2>

      <div className="cards-container">
        <Card
          image={imgImage}
          title="Profesional en Clash Royale"
          description="Aprende estrategias avanzadas, gestión de mazos y preparación para torneos con jugadores experimentados."
        />
        <Card
          image={imgImage1}
          title="Introducción a React"
          description="Desarrolla interfaces web modernas y dinámicas usando React, JSX y Hooks para crear tus propias aplicaciones."
        />
        <Card
          image={imgImage2}
          title="Fitness para Creadores"
          description="Mejora tu postura, energía y hábitos saludables con rutinas simples diseñadas para gamers y creadores digitales."
        />
      </div>
    </section>
  );
}

import React from "react";
import "../../styles/components/heroVtuber.css";
import vtuberImg from "../../../public/img/logos/BondWaifu.png"; // ajusta ruta según tus carpetas

export default function HeroVtuber() {
  return (
    <div className="section-separator">
      <section className="vtuber-section">
        <div className="vtuber-content">
          <div className="vtuber-text">
            <h2>Ser Vtuber: Introducción al Streaming Virtual</h2>

            <div className="vtuber-card">
              <div className="vtuber-sub">
                <span className="icon">●</span>
                <h4>Da vida a tu personaje virtual</h4>
                <p>
                  Aprende a crear tu propio avatar y comienza tu historia en el
                  mundo del streaming. No necesitas experiencia, solo ganas de
                  expresarte.
                </p>
              </div>

              <div className="vtuber-sub">
                <span className="icon">▲</span>
                <h4>Diseña tu identidad digital</h4>
                <p>
                  Descubre cómo construir un estilo único, configurar tu modelo
                  y transmitir en Twitch o YouTube con confianza y autenticidad.
                </p>
              </div>

              <div className="vtuber-sub">
                <span className="icon">▲</span>
                <h4>Conecta con tu comunidad</h4>
                <p>
                  Explora las herramientas y técnicas más usadas por Vtubers,
                  aprende a cautivar a tu audiencia y deja tu huella en la
                  escena virtual.
                </p>
              </div>
            </div>

            <div className="vtuber-buttons">
              <button className="btn-primary">Ver contenido del curso</button>
            <a href="https://youtu.be/dQw4w9WgXcQ?si=NrJjTPu_TtkDMMFR" 
               target="_blank" 
               rel="noopener noreferrer"
               className="btn-secondary"   > Mirar presentación </a>

            </div>
          </div>

          <div className="vtuber-image">
            <img src={vtuberImg} alt="Vtuber personaje" />
          </div>
        </div>
      </section>
    </div>
  );
}

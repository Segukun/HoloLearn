import React from "react";
import "../../styles/components/Reviews.css";

import Walter from "../../../public/img/logos/Walter.jpg";
import Bondiola from "../../../public/img/logos/Bondiola.jpg";
import Garu from "../../../public/img/logos/Garu.jpg";

export default function Reviews() {
  const reviews = [
    {
      quote: "“Un elogio magnífico”",
      name: "Walter",
      description: "Aprendí React de forma clara y práctica. El curso me ayudó a crear mis primeras apps reales.",
      img: Walter,
    },
    {
      quote: "“Un feedback fantástico”",
      name: "Bondiola",
      description: "El programa Fitness para Creadores cambió mi rutina y energía frente a cámara. Recomendado.",
      img: Bondiola,
    },
    {
      quote: "“Una reseña brillante”",
      name: "Choco",
      description: "El curso de Vtuber fue increíble, me enseñó todo para transmitir con confianza y estilo.",
      img: Garu,
    },
  ];

  return (
    <section className="reviews-section">
      <h2 className="reviews-title">Client Reviews</h2>
      <div className="reviews-container">
        {reviews.map((review, index) => (
          <div className="review-card" key={index}>
            <p className="review-quote">{review.quote}</p>
            <div className="review-user">
              <img
                src={review.img}
                alt={review.name}
                className="review-avatar"
              />
              <div className="review-info">
                <h4>{review.name}</h4>
                <p>{review.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

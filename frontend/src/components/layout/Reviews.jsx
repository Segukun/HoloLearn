import React from "react";
import "../../styles/components/Reviews.css";

import Walter from "../../../public/img/logos/Walter.jpg";
import Bondiola from "../../../public/img/logos/Bondiola.jpg";
import Garu from "../../../public/img/logos/Garu.jpg";

export default function Reviews() {
  const reviews = [
    {
quote: "“A magnificent compliment”",
name: "Walter",
description: "I learned React in a clear and practical way. The course helped me create my first real apps.",
img: Walter,
},
{
  quote: "“Fantastic feedback”",
  name: "Bondiola",
  description: "The Fitness for Creators program changed my routine and on-camera energy. Highly recommended.",
  img: Bondiola,
},
{
  quote: "“A brilliant review”",
  name: "Choco",
  description: "The Vtuber course was amazing; it taught me everything to stream with confidence and style.",
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

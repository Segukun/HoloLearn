import React from "react";
import "../../styles/components/heroVtuber.css";
import vtuberImg from "../../../public/img/logos/BondWaifu.png"; 
import { Link } from "react-router-dom";

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
                <h4>Bring your virtual character to life</h4>
                <p>
                  Learn to create your own avatar and begin your story in the world of
                  streaming. You don’t need experience, just the desire to express yourself.
                </p>
              </div>

              <div className="vtuber-sub">
                <span className="icon">▲</span>
                <h4>Design your digital identity</h4>
                <p>
                  Discover how to build a unique style, set up your model, and stream on
                  Twitch or YouTube with confidence and authenticity.
                </p>
              </div>

              <div className="vtuber-sub">
                <span className="icon">▲</span>
                <h4>Connect with your community</h4>
                <p>
                  Explore the most used tools and techniques by Vtubers, learn to captivate
                  your audience, and leave your mark on the virtual scene.
                </p>
              </div>
            </div>

            <div className="vtuber-buttons">
              <Link to="/courses" className="btn-primary">
                View course content
              </Link>

              <a
                href="https://www.youtube.com/watch?v=4hdVZQS7DU4"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                Watch presentation
              </a>
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

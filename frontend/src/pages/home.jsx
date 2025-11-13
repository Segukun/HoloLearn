import "../styles/pages/home.css";
import React from "react";
import Hero from "../components/layout/hero.jsx";
import Cards from "../components/layout/cards.jsx";
import HeroVtuber from "../components/layout/HeroVtuber.jsx";
import Reviews from "../components/layout/Reviews";


export default function Home() {
    return (
        <section className="page">
            <Hero />
            <Cards />
            <HeroVtuber/>
            <Reviews/>
        </section>
    );
}

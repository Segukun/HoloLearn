import "../styles/pages/home.css";
import React from "react";
import Hero from "../components/layout/hero.jsx";
import Cards from "../components/layout/cards.jsx";


export default function Home() {
    return (
        <section className="page">
            <Hero />
            <Cards />
        </section>
    );
}

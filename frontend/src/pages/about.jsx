import "../styles/pages/about.css";

const SECTION_OFFSET_PX = 110; // header height + breathing

export default function About() {
    return (
        <main className="about-page">
            <section className="about-hero">
                <h1 className="about-title">About HoloLearn</h1>
                <p className="about-subtitle">Learn, create, go live.</p>
            </section>

            {/* Information */}
            <section
                className="about-section"
                id="information"
                style={{ scrollMarginTop: SECTION_OFFSET_PX }}
            >
                <h2 className="about-heading">Information</h2>
                <p>
                    HoloLearn is an educational platform that blends interactive content,
                    modern design, and community learning. Our goal is to make education
                    engaging, inclusive, and accessible to everyone through innovative
                    technology and creativity.
                </p>
            </section>

            {/* About Us */}
            <section
                className="about-section"
                id="about-us"
                style={{ scrollMarginTop: SECTION_OFFSET_PX }}
            >
                <h2 className="about-heading">About Us</h2>
                <p>
                    We are a multidisciplinary team of developers, designers, and
                    educators passionate about reshaping the way people learn. By combining
                    creativity and technology, we bring immersive educational experiences
                    to every learner.
                </p>
            </section>

            {/* Privacy Policy */}
            <section
                className="about-section"
                id="privacy-policy"
                style={{ scrollMarginTop: SECTION_OFFSET_PX }}
            >
                <h2 className="about-heading">Privacy Policy</h2>
                <p>
                    We value your privacy and are committed to protecting your personal
                    information. Your data will never be shared with third parties without
                    consent. Read our full policy to understand how your information is
                    collected, used, and stored.
                </p>
            </section>

            {/* Terms & Conditions */}
            <section
                className="about-section"
                id="terms"
                style={{ scrollMarginTop: SECTION_OFFSET_PX }}
            >
                <h2 className="about-heading">Terms & Conditions</h2>
                <p>
                    By using HoloLearn, you agree to use the platform responsibly and to
                    respect other users. Content may not be redistributed or copied without
                    authorization. These terms are designed to maintain a safe learning
                    environment.
                </p>
            </section>

            {/* Contact */}
            <section
                className="about-section"
                id="contact"
                style={{ scrollMarginTop: SECTION_OFFSET_PX }}
            >
                <h2 className="about-heading">Contact</h2>
                <p>Questions or ideas? Reach out to us:</p>
                <ul className="contact-list">
                    <li>Email: <a href="mailto:support@hololearn.com">support@hololearn.com</a></li>
                    <li>X: <a href="https://x.com/hololivetv" target="_blank" rel="noreferrer">@hololearn</a></li>
                   
                </ul>
            </section>
        </main>
    );
}

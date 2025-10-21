import "../../styles/components/footer.css";
import logo from "../../assets/img/fbk.gif";

export default function Footer() {
    return (
        <footer className="footer">
            <img src={logo} alt="HoloLearn logo" />
            <span>© {new Date().getFullYear()} HoloLearn — Learn, Create, Go Live.</span>
        </footer>
    );
}

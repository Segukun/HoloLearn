import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pages/courses.css";

export default function Courses() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/courses")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Error fetching courses:", err));
  }, []);

  return (
    <section className="course-page">
      <div className="course-header">
        <h1 className="course-title">Courses</h1>
        <p className="course-subtitle">Explore our wide range of courses.</p>
      </div>

      <ul className="course-list">
        {data.map((course) => (
          <li key={course.id} className="course-card">
            <h2 className="course-card-title">{course.title}</h2>
            <p className="course-card-summary">{course.summary}</p>
            <p className="course-card-desc">{course.description}</p>

            <button
              type="button"
              className="course-btn"
              onClick={() => navigate(`/course/${course.id}`)}
            >
              See more
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

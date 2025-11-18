import { useEffect, useState } from "react";
import { data, useNavigate } from "react-router-dom";
import "../styles/pages/courses.css";
import "../styles/components/courseCard.css";

export default function Courses() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  try {
    useEffect(() => {
      fetch("http://localhost:3000/courses")
        .then((res) => res.json())
        .then((json) => setData(json))
        .catch((err) => console.log("Error fetching for courses:", err));
    }, []);
  } catch (error) {
    console.error("Error in Courses component:", error);
  }

  return (
    <section className="page course-page">
      <h1>Courses</h1>
      <p>Explore our wide range of courses.</p>
      <ul className="course-list">
        {data.map((course) => (
          <li key={course.id} className="course-card">
            <h2>{course.title}</h2>
            <section>
                <h3>{course.summary}</h3>
            </section>
            <p>{course.description}</p>
            <button type="button">See more</button>
          </li>
        ))}
      </ul>
    </section>
  );
}

import "./Skills.css";

function Skills({ skillList }) {
  return (
    <section className="page-section skills-section" id="skills">
      <h2>Skills</h2>
      <p>Technologies I’m studying and using in coursework and personal projects.</p>
      <ul className="skills-list">
        {skillList.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
    </section>
  );
}

export default Skills;

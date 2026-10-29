function Skills({ skillList }) {
  return (
    <section className="skills-section section-shell" id="skills">
      <div className="section-heading">
        <p className="section-kicker">Tools in my kit</p>
        <h2>Learning the building blocks.</h2>
        <p>
          A growing set of technologies I’ve been studying and using in
          coursework and personal projects.
        </p>
      </div>
      <ul className="skills-list">
        {skillList.map((skill, index) => (
          <li className="skill-chip" key={skill}>
            <span className="skill-index" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span>{skill}</span>
            <span className="skill-arrow" aria-hidden="true">↗</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Skills;

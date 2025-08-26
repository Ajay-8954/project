import { forwardRef } from "react";
import "./Template4.css";
import useResumeStore from "../../store/useResumeStore";

const Template4 = forwardRef(({ data = {} }, ref) => {
  const { toggle } = useResumeStore();

  const {
    Name,
    jobTitle,
    email,
    phone,
    location,
    linkedin,
    github,
    summary,
    objective,
    experience = [],
    education = [],
    skills = [],
    projects = [],
    achievements = [],
    interests,
    internships,
    languages,
    certifications = [],
  } = data || {};

  return (
    <div ref={ref} className="resume">
              <div className="resume-inner">
      <header className="resume-headerr">
        <h1>{Name}</h1>
        <h2 style={{ color: "#10c0d4" }}>{jobTitle}</h2>
        <div className="contact-info">
          {phone && <span>{phone} | </span>}
          {email && <span>{email} | </span>}
          {linkedin && <span>{linkedin} | </span>}
          {github && <span>{github} | </span>}
          {location && <span className="capitalize">{location}</span>}
        </div>
      </header>

      <div className="resume-body">
        <div className="left-column">
          {skills.length > 0 && (
            <section className="skills">
              <h3 className="template-4-section-title">SKILLS</h3>
              <div className="skills-grid">
                {skills.map((skill, i) => (
                  <div key={i} className="skill-item">
                    {skill}
                  </div>
                ))}
              </div>
            </section>
          )}

          {projects.length > 0 && (
            <section className="projects">
              <h3 className="template-4-section-title">MY PROJECTS</h3>

              {projects.map((project, i) => (
                <div key={i} className="project-item">
                  <h4 className="project-title">{project.title}</h4>
                  <p className="project-details">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        GitHub link: {project.github}
                      </a>
                    )}
                  </p>
                  <ul>
                    {(Array.isArray(project.description)
                      ? project.description
                      : (project.description || "").split("\n")
                    )
                      .filter(Boolean)
                      .map((point, i) => (
                        <li key={i}>{point.replace(/^\s*•\s*/, "").trim()}</li>
                      ))}
                  </ul>
                </div>
              ))}
            </section>
          )}
        </div>

        <div className="right-column">
          {toggle === "experienced" && summary && (
            <section className="summary">
              <h3 className="template-4-section-title">SUMMARY</h3>
              <p className="summary-text">{summary}</p>
            </section>
          )}

          {toggle === "fresher" && objective && (
            <section className="summary">
              <h3 className="template-4-section-title">CAREER OBJECTIVE</h3>
              <p className="summary-text">{objective}</p>
            </section>
          )}

          {experience.length > 0 && (
            <section className="experience">
              <h3 className="template-4-section-title">EXPERIENCE</h3>
              {experience.map((item, i) => (
                <div key={i} className="experience-item">
                  <h4 className="capitalize">{item.jobTitle}</h4>
                  <p className="company">
                    <span className="capitalize">{item.company}</span> |{" "}
                    <span className="date">
                      {item.startDate} - {item.endDate}
                    </span>{" "}
                    | <span className="capitalize"> {item.location}</span>
                  </p>
                  <ul>
                    {(Array.isArray(item.description)
                      ? item.description
                      : (item.description || "").split("\n")
                    )
                      .filter(Boolean)
                      .map((point, i) => (
                        <li key={i}>{point.replace(/^\s*•\s*/, "").trim()}</li>
                      ))}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {internships?.length > 0 && (
            <section className="experience">
              <h3 className="template-4-section-title">INTERNSHIPS</h3>
              {internships.map((item, i) => (
                <div key={i} className="experience-item">
                  <h4 className="capitalize">{item.role}</h4>
                  <p className="company">
                    <span className="capitalize">{item.company}</span> |{" "}
                    <span className="date">
                      {item.startDate} - {item.endDate}
                    </span>{" "}
                    | <span className="capitalize"> {item.location}</span>
                  </p>
                  <ul>
                    {(Array.isArray(item.description)
                      ? item.description
                      : (item.description || "").split("\n")
                    )
                      .filter(Boolean)
                      .map((point, i) => (
                        <li key={i}>{point.replace(/^\s*•\s*/, "").trim()}</li>
                      ))}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {interests?.length > 0 && (
            <section className="interests">
              <h3 className="template-4-section-title">INTERESTS</h3>
              <ul className="interests-list">
                {interests.map((interest, i) => (
                  <li key={i} className="interest-item">
                    <span className="interest-text">{interest}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {languages?.length > 0 && (
            <section className="languages">
              <h3 className="template-4-section-title">LANGUAGES</h3>
              <ul className="languages-list">
                {languages.map((language, i) => (
                  <li key={i} className="language-item">
                    <span className="language-text">{language}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {certifications.length > 0 && (
            <section className="certifications">
              <h3 className="template-4-section-title">CERTIFICATIONS</h3>
              <ul className="certification-list">
                {certifications.map((cert, i) => (
                  <li key={i} className="certification-item">
                    <h4>{cert.name}</h4>
                    <p className="cert-details">
                      {cert.issuer} | <span className="date">{cert.date}</span>
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}

 {education.length > 0 && (
  <section className="education">
    <h3 className="template-4-section-title">EDUCATION</h3>
    {education.map((edu, index) => (
      <div key={index} className="education-container">
        {/* Upper section - Degree only */}
        <div className="education-upper">
          <h3 className="degree">{edu.degree}</h3>
        </div>
        
        {/* Lower section - School and dates */}
        <div className="education-lower">
          <div className="school-info">
            <p className="university info-capital">{edu.school}, {edu.location}</p>
            {edu.cgpa && <p className="gpa">{edu.cgpa}</p>}
          </div>
          <div className="date-info">
            <p className="dates">{edu.startDate} - {edu.endDate || 'Present'}</p>
          </div>
        </div>
      </div>
    ))}
  </section>
)}
        </div>
      </div>
      </div>
    </div>
  );
});

export default Template4;
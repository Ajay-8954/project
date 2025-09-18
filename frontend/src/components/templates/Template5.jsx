import { forwardRef } from "react";
import "./Template5.css";
import useResumeStore from "../../store/useResumeStore";

const Template5 = forwardRef(({ data={} }, ref) => {
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
    internships=[],
    education = [],
    skills = [],
    projects = [],
    achievements = [],
    certifications = [],
    interests,
    languages
  } = data || {};

  return (
    <div ref={ref} className="resume-container">
      <div className="resume-inner">
      <header className="resume-header">
        <h1>{Name}</h1>
        <h2>{jobTitle}</h2>
        <p className="contact-info">
          {phone} • {email} • <a href={linkedin}>{linkedin}</a>
        </p>
      </header>

      {toggle==="fresher" && objective && (
        <section className="summary-section">
          <h3 className="section-title-centered">SUMMARY</h3>
          <p className="summary-text">{objective}</p>
        </section>
      )}

          {toggle==="experienced" && summary && (
        <section className="summary-section">
          <h3 className="section-title-centered">SUMMARY</h3>
          <p className="summary-text">{summary}</p>
        </section>
      )}

      {achievements.length > 0 && (
        <section className="achievements">
          <h3 className="section-title-centered">KEY ACHIEVEMENTS</h3>
          <div className="achievements-grid">
            {achievements.map((ach, i) => (
              <div key={i} className="achievement-box">
                <h4 className="achievement-title">{ach.title}</h4>
                <p className="achievement-desc">{ach.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {internships.length > 0 && (
        <section className="experience-section">
          <h3 className="section-title-centered">INTERNSHIP</h3>
          {internships.map((intern, i) => (
            <div key={i} className="experience-item">
              <div className="experience-header">
                <div className="left-info">
                  <div className="company">{intern.company}</div>
                  <div className="job-title">{intern.jobTitle || intern.role}</div>
                </div>
                <div className="right-info">
                  <div className="location">{intern.location}</div>
                  <div className="date">
                    {intern.startDate} - {intern.endDate}
                  </div>
                </div>
              </div>
              <ul className="experience-details">
                {(Array.isArray(intern.description)
                  ? intern.description
                  : intern.description?.split("\n") || []
                ).map((point, i) => (
                  <li key={i}>{point.replace(/^•\s*/, "").trim()}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}



          {experience.length > 0 && (
        <section className="experience-section">
          <h3 className="section-title-centered">PROFESSIONAL EXPERIENCE</h3>
          {experience.map((exp, i) => (
            <div key={i} className="experience-item">
              <div className="experience-header">
                <div className="left-info">
                  <div className="company">{exp.company}</div>
                  <div className="job-title">{exp.jobTitle}</div>
                </div>
                <div className="right-info">
                  <div className="location">{exp.location}</div>
                  <div className="date">
                    {exp.startDate} - {exp.endDate}
                  </div>
                </div>
              </div>
              <ul className="experience-details">
                {(Array.isArray(exp.description)
                  ? exp.description
                  : exp.description?.split("\n") || []
                ).map((point, i) => (
                  <li key={i}>{point.replace(/^•\s*/, "").trim()}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}


      {projects.length > 0 && (
  <section className="experience-section">
    <h3 className="section-title-centered">PROJECTS</h3>
    {projects.map((project, i) => (
      <div key={i} className="experience-item">
        <div className="experience-header">
          <div className="left-info">
            <div className="company">{project.title}</div>
          </div>
          <div className="right-info">
            <div className="date">
              {project.startDate} - {project.endDate}
            </div>
          </div>
        </div>
        <ul className="experience-details">
          {(Array.isArray(project.description)
            ? project.description
            : project.description?.split("\n") || []
          ).map((point, idx) => (
            <li key={idx}>{point.replace(/^•\s*/, "").trim()}</li>
          ))}
        </ul>
      </div>
    ))}
  </section>
)}


      {education.length > 0 && (
        <section className="education-section">
          <h3 className="section-title-centered">EDUCATION</h3>
          <div className="education-list">
            {education.map((edu, i) => (
              <div key={i} className="education-item">
                <div className="edu-left">
                  <h4 className="edu-school">{edu.school}</h4>
                  <p className="template5-edu-degree">{edu.degree}</p>
                </div>
                <div className="edu-right">
                  <p className="edu-location">{edu.location}</p>
                  <p className="template5-edu-dates">
                    {edu.startDate} - {edu.endDate}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {skills.length > 0 && (
        <section className="skills-section">
          <h3 className="section-title-centered">TECHNICAL SKILLS</h3>
          <p className="skills-inline">
            {skills.map((skill, i) => (
              <span key={i}>
                {skill}
                {i < skills.length - 1 && (
                  <span className="dot-separator"> • </span>
                )}
              </span>
            ))}
          </p>
        </section>
      )}

{languages?.length > 0 && (
<div className="">
  <h2 className="section-title-centered">Languages</h2>
  <div className="language-list">
    {languages.map((lang, index) => (
      <div className="language-item" key={index}>
        {lang}
      </div>
    ))}
  </div>
</div>
)}


{interests?.length > 0 && (
  <div className="interest-section">
    <h3 className="section-title-centered">Interests</h3>
    <div className="interest-list">
      {interests.map((text, index) => (
        <div key={index} className="interest-item">
          <span className="bullet-dot" /> {text}
        </div>
      ))}
    </div>
  </div>
)}


{certifications?.length>0 && (
   <div className="certification-section">
    <h3 className="section-title-centered">Certifications</h3>
    <div className="certification-list">
      {certifications.map((cert, index) => (
        <div key={index} className="certification-item">
          {cert.name} | {cert.issuer} | {cert.date}
        </div>
      ))}
    </div>
  </div>
)}

  </div>      
    </div>
  );
});

export default Template5;
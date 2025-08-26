import { forwardRef } from "react";
import useResumeStore from "../../store/useResumeStore";
import "./Template6.css";

const Template6 = forwardRef(({ data = {} }, ref) => {

    const { toggle } = useResumeStore();

  const {
    Name = "",
    jobTitle = "",
    email = "",
    phone = "",
    location = "",
    linkedin = "",
    summary = "",
    objective="",
    experience = [],
    education = [],
    internships=[],
    certifications=[],
    achievements=[],
    languages=[],
    projects=[],
    interests=[],
    skills = [],
  } = data || {};

  return (
    <div className="template6-resume" ref={ref}>

      {/* HEADER */}
      <header className="template6-header">
        <h1>{Name}</h1>
        <div className="template6-contact-info">
          {location && <span>■ {location}</span>}
          {phone && <span>■ {phone}</span>}
          {email && <span>■ {email}</span>}
          {linkedin && <span>■ {linkedin}</span>}
        </div>
      </header>

        <div className="resume-inner">
      {/* PROFESSIONAL SUMMARY/ objective */}
      {toggle==="experienced" && summary &&(
      <section className="template6-section">
        <div className="template6-left">PROFESSIONAL SUMMARY</div>
        <div className="template6-right">
          <p>{summary}</p>
        </div>
      </section>
      )}

      {toggle==="fresher" && objective && (
            <section className="template6-section">
        <div className="template6-left">CAREER OBJECTIVE</div>
        <div className="template6-right">
          <p>{objective}</p>
        </div>
      </section>
      )}

      {/* WORK HISTORY */}
      <section className="template6-section">
        <div className="template6-left">WORK HISTORY</div>
        <div className="template6-right">
          {experience.map((exp, i) => (
            <div key={i} className="template6-experience">
              <div className="template6-job-header">
                <strong>{exp.jobTitle}</strong>
                <span className="template6-date">
                  {exp.startDate} - {exp.endDate || "Current"}
                </span>
              </div>
              <div className="template6-company">
                {exp.company}
                {exp.location ? `, ${exp.location}` : ""}
              </div>
              <ul>
                {Array.isArray(exp.description)
                  ? exp.description.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))
                  : (exp.description || "")
                      .split("\n")
                      .filter(Boolean)
                      .map((point, idx) => (
                        <li key={idx}>
                          {point.replace(/^\s*•\s*/, "").trim()}
                        </li>
                      ))}
              </ul>
            </div>
          ))}
        </div>
      </section>



         {/* INTERNSHIP */}
      {internships.length > 0 && (
        <section className="template6-section">
          <div className="template6-left">INTERNSHIP</div>
          <div className="template6-right">
            {internships.map((intern, i) => (
              <div key={i} className="template6-experience">
                <div className="template6-job-header">
                  <strong>{intern.jobTitle || intern.role}</strong>
                  <span className="template6-date">
                    {intern.startDate} - {intern.endDate || "Current"}
                  </span>
                </div>
                <div className="template6-company">
                  {intern.company}
                  {intern.location ? `, ${intern.location}` : ""}
                </div>
                <ul>
                  {Array.isArray(intern.description)
                    ? intern.description.map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))
                    : (intern.description || "")
                        .split("\n")
                        .filter(Boolean)
                        .map((point, idx) => (
                          <li key={idx}>
                            {point.replace(/^\s*•\s*/, "").trim()}
                          </li>
                        ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SKILLS */}
      <section className="template6-section">
        <div className="template6-left">SKILLS</div>
        <div className="template6-right">
          <div className="template6-skills-grid">
            {skills.map((skill, i) => (
              <div key={i} className="template6-skill-item">
                • {skill}
              </div>
            ))}
          </div>
        </div>
      </section>


{/* interest and hobbies section */}
      <section className="template6-section">
        <div className="template6-left">INTERESTS AND HOBBIES</div>
        <div className="template6-right">
          <div className="template6-skills-grid">
            {interests.map((interest, i) => (
              <div key={i} className="template6-skill-item">
                • {interest}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* langauges section */}

            {/* LANGUAGES */}
      {languages?.length > 0 && (
        <section className="template6-section">
          <div className="template6-left">LANGUAGES</div>
          <div className="template6-right">
            <div className="template6-skills-grid">
              {languages.map((lang, i) => (
                <div key={i} className="template6-skill-item">
                  • {lang}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}


 {/* ✅ ACHIEVEMENTS */}
      {achievements.length > 0 && (
        <section className="template6-section">
          <div className="template6-left">ACHIEVEMENTS</div>
          <div className="template6-right">
            {achievements.map((ach, i) => (
              <div key={i} className="template6-achievement">
                <div className="template6-achievement-title">
                  • {ach.title}
                </div>
                {ach.description && (
                  <div className="template6-achievement-desc">
                    {ach.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}


       {/* CERTIFICATIONS */}
      {certifications.length > 0 && (
        <section className="template6-section">
          <div className="template6-left">CERTIFICATIONS</div>
          <div className="template6-right">
            {certifications.map((cert, i) => (
              <div key={i} className="template6-certification">
                {cert.name}, {cert.issuer} - <span className="template6-date" >{cert.date} </span>
              </div>
            ))}
          </div>
        </section>
      )}

       {/* PROJECTS */}
      {projects.length > 0 && (
        <section className="template6-section">
          <div className="template6-left">PROJECTS</div>
          <div className="template6-right">
            {projects.map((proj, i) => (
              <div key={i} className="template6-experience">
                <div className="template6-job-header">
                  <strong>{proj.title}</strong>
                  <span className="template6-date">
                    {proj.startDate} - {proj.endDate}
                  </span>
                </div>
                <div className="template6-company">{proj.tech}</div>
                <ul>
                  {Array.isArray(proj.description)
                    ? proj.description.map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))
                    : (proj.description || "")
                        .split("\n")
                        .filter(Boolean)
                        .map((point, idx) => (
                          <li key={idx}>
                            {point.replace(/^\s*•\s*/, "").trim()}
                          </li>
                        ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* EDUCATION */}
      <section className="template6-section">
        <div className="template6-left">EDUCATION</div>
        <div className="template6-right">
          {education.map((edu, i) => (
            <div key={i}>
               <div className="template6-job-header">
                  <strong>{edu.degree}</strong>
                  <span className="template6-date">
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
              <div className="template6-school">
                {edu.school} - {edu.location}
                {edu.cgpa && <> | CGPA: {edu.cgpa}</>}
              </div>
            </div>
          ))}
        </div>

        
      </section>
      </div>
    </div>
  );
});

export default Template6;
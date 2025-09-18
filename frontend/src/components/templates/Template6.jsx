import { forwardRef } from "react";
import useResumeStore from "../../store/useResumeStore";
import "./Template6.css";

const Template6 = forwardRef(({ data = {} }, ref) => {
  const { toggle } = useResumeStore();

  // Safely extract data with fallbacks
  const {
    Name = "",
    jobTitle = "",
    email = "",
    phone = "",
    location = "",
    linkedin = "",
    summary = "",
    objective = "",
    experience = [],
    education = [],
    internships = [],
    certifications = [],
    achievements = [],
    languages = [],
    projects = [],
    interests = [],
    skills = [],
  } = data || {};

  return (
    <div className="template6-resume" ref={ref}>
      {/* HEADER - Only show if there's any contact info */}
      {(Name || location || phone || email || linkedin) && (
        <header className="template6-header">
          {Name && <h1>{Name}</h1>}
          {(location || phone || email || linkedin) && (
            <div className="template6-contact-info">
              {location && <span>■ {location}</span>}
              {phone && <span>■ {phone}</span>}
              {email && <span>■ {email}</span>}
              {linkedin && <span>■ {linkedin}</span>}
            </div>
          )}
        </header>
      )}

      <div className="resume-inner">
        {/* PROFESSIONAL SUMMARY/OBJECTIVE */}
        {toggle === "experienced" && summary && (
          <section className="template6-summary-section">
            <div className="template6-summary-left">PROFESSIONAL SUMMARY</div>
            <div className="template6-summary-right">
              <p>{summary}</p>
            </div>
          </section>
        )}

        {toggle === "fresher" && objective && (
          <section className="template6-summary-section">
            <div className="template6-summary-left">CAREER OBJECTIVE</div>
            <div className="template6-summary-right">
              <p>{objective}</p>
            </div>
          </section>
        )}

        {/* WORK HISTORY */}
        {experience && experience.length > 0 && (
          <section className="template6-section">
            <div className="template6-left">WORK HISTORY</div>
            <div className="template6-right">
              {experience.map((exp, i) => (
                <div key={i} className="template6-experience">
                  <div className="template6-job-header">
                    <strong>{exp.jobTitle || "Position"}</strong>
                    <span className="template6-date">
                      {exp.startDate || ""} - {exp.endDate || "Current"}
                    </span>
                  </div>
                  {(exp.company || exp.location) && (
                    <div className="template6-company">
                      {exp.company || ""}
                      {exp.company && exp.location ? ", " : ""}
                      {exp.location || ""}
                    </div>
                  )}
                  {exp.description && (
                    <ul>
                      {Array.isArray(exp.description)
                        ? exp.description.map(
                            (point, idx) => point && <li key={idx}>{point}</li>
                          )
                        : (exp.description || "")
                            .split("\n")
                            .filter(Boolean)
                            .map((point, idx) => (
                              <li key={idx}>
                                {point.replace(/^\s*•\s*/, "").trim()}
                              </li>
                            ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* INTERNSHIP */}
        {internships && internships.length > 0 && (
          <section className="template6-section">
            <div className="template6-left">INTERNSHIP</div>
            <div className="template6-right">
              {internships.map((intern, i) => (
                <div key={i} className="template6-experience">
                  <div className="template6-job-header">
                    <strong>
                      {intern.jobTitle || intern.role || "Intern"}
                    </strong>
                    <span className="template6-date">
                      {intern.startDate || ""} - {intern.endDate || "Current"}
                    </span>
                  </div>
                  {(intern.company || intern.location) && (
                    <div className="template6-company">
                      {intern.company || ""}
                      {intern.company && intern.location ? ", " : ""}
                      {intern.location || ""}
                    </div>
                  )}
                  {intern.description && (
                    <ul>
                      {Array.isArray(intern.description)
                        ? intern.description.map(
                            (point, idx) => point && <li key={idx}>{point}</li>
                          )
                        : (intern.description || "")
                            .split("\n")
                            .filter(Boolean)
                            .map((point, idx) => (
                              <li key={idx}>
                                {point.replace(/^\s*•\s*/, "").trim()}
                              </li>
                            ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SKILLS */}
        {skills && skills.length > 0 && (
          <section className="template6-section">
            <div className="template6-left">SKILLS</div>
            <div className="template6-right">
              <div className="template6-skills-grid">
                {skills.map(
                  (skill, i) =>
                    skill && (
                      <div key={i} className="template6-skill-item">
                        • {skill}
                      </div>
                    )
                )}
              </div>
            </div>
          </section>
        )}

        {/* INTERESTS AND HOBBIES */}
        {interests && interests.length > 0 && (
          <section className="template6-section">
            <div className="template6-left">INTERESTS AND HOBBIES</div>
            <div className="template6-right">
              <div className="template6-skills-grid">
                {interests.map(
                  (interest, i) =>
                    interest && (
                      <div key={i} className="template6-skill-item">
                        • {interest}
                      </div>
                    )
                )}
              </div>
            </div>
          </section>
        )}

        {/* LANGUAGES */}
        {languages && languages.length > 0 && (
          <section className="template6-section">
            <div className="template6-left">LANGUAGES</div>
            <div className="template6-right">
              <div className="template6-skills-grid">
                {languages.map(
                  (lang, i) =>
                    lang && (
                      <div key={i} className="template6-skill-item">
                        • {lang}
                      </div>
                    )
                )}
              </div>
            </div>
          </section>
        )}

        {/* ACHIEVEMENTS */}
        {achievements && achievements.length > 0 && (
          <section className="template6-section">
            <div className="template6-left">ACHIEVEMENTS</div>
            <div className="template6-right">
              {achievements.map(
                (ach, i) =>
                  (ach.title || ach.description) && (
                    <div key={i} className="template6-achievement">
                      {ach.title && (
                        <div className="template6-achievement-title">
                          • {ach.title}
                        </div>
                      )}
                      {ach.description && (
                        <ul className="template6-achievement-desc">
                          {Array.isArray(ach.description)
                            ? ach.description.map(
                                (point, idx) =>
                                  point && <li key={idx}>{point}</li>
                              )
                            : (ach.description || "")
                                .split("\n")
                                .filter(Boolean)
                                .map((point, idx) => (
                                  <li key={idx}>
                                    {point.replace(/^\s*•\s*/, "").trim()}
                                  </li>
                                ))}
                        </ul>
                      )}
                    </div>
                  )
              )}
            </div>
          </section>
        )}

        {/* CERTIFICATIONS */}
        {certifications && certifications.length > 0 && (
          <section className="template6-section">
            <div className="template6-left">CERTIFICATIONS</div>
            <div className="template6-right">
              {certifications.map(
                (cert, i) =>
                  (cert.name || cert.issuer || cert.date) && (
                    <div key={i} className="template6-certification">
                      {cert.name && <span>{cert.name}</span>}
                      {cert.issuer && (
                        <span>
                          {cert.name ? ", " : ""}
                          {cert.issuer}
                        </span>
                      )}
                      {cert.date && (
                        <span className="template6-date">
                          {cert.issuer || cert.name ? " - " : ""}
                          {cert.date}
                        </span>
                      )}
                    </div>
                  )
              )}
            </div>
          </section>
        )}

        {/* PROJECTS */}
        {projects && projects.length > 0 && (
          <section className="template6-section">
            <div className="template6-left">PROJECTS</div>
            <div className="template6-right">
              {projects.map((proj, i) => (
                <div key={i} className="template6-experience">
                  <div className="template6-job-header">
                    <strong>{proj.title || "Project"}</strong>
                    <span className="template6-date">
                      {proj.startDate || ""} - {proj.endDate || ""}
                    </span>
                  </div>
                  {proj.tech && (
                    <div className="template6-company">{proj.tech}</div>
                  )}
                  {proj.description && (
                    <ul>
                      {Array.isArray(proj.description)
                        ? proj.description.map(
                            (point, idx) => point && <li key={idx}>{point}</li>
                          )
                        : (proj.description || "")
                            .split("\n")
                            .filter(Boolean)
                            .map((point, idx) => (
                              <li key={idx}>
                                {point.replace(/^\s*•\s*/, "").trim()}
                              </li>
                            ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EDUCATION */}
        {education && education.length > 0 && (
          <section className="template6-section">
            <div className="template6-left">EDUCATION</div>
            <div className="template6-right">
              {education.map((edu, i) => (
                <div key={i}>
                  <div className="template6-job-header">
                    <strong>{edu.degree || "Degree"}</strong>
                    <span className="template6-date">
                      {edu.startDate || ""} - {edu.endDate || ""}
                    </span>
                  </div>
                  {(edu.school || edu.location || edu.cgpa) && (
                    <div className="template6-school">
                      {edu.school || ""}
                      {edu.school && edu.location ? " - " : ""}
                      {edu.location || ""}
                      {edu.cgpa && (
                        <span>
                          {edu.school || edu.location ? " | " : ""}
                          CGPA: {edu.cgpa}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
});

export default Template6;
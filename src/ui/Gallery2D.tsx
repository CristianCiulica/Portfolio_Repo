import { motion } from 'framer-motion'
import { useMuseum } from '../state/store'
import { PROFILE, PROJECTS, MORE_PROJECTS, SKILLS, CERTIFICATES, TIMELINE } from '../config/content'
import { projectImageSrc } from '../scene/covers'
import type { Project } from '../config/content'

function ProjectCard({ p }: { p: Project }) {
  return (
    <article className="g2d__card">
      <img src={projectImageSrc(p)} alt={`${p.title} preview`} loading="lazy" />
      <h3>{p.title}</h3>
      <p>{p.description}</p>
      <p className="g2d__tech">{p.tech.join(' · ')}</p>
      <div className="g2d__links">
        {p.github && (
          <a href={p.github} target="_blank" rel="noopener noreferrer">
            GitHub →
          </a>
        )}
        {p.live && (
          <a href={p.live} target="_blank" rel="noopener noreferrer">
            Live →
          </a>
        )}
      </div>
    </article>
  )
}

/**
 * Full content parity in semantic HTML — for reduced motion, no WebGL,
 * screen readers, and anyone who just wants the facts fast.
 * Light, Apple-style theme (scoped via the .g2d CSS variables).
 */
export function Gallery2D() {
  const phase = useMuseum((s) => s.phase)
  const setPhase = useMuseum((s) => s.setPhase)
  if (phase !== 'gallery2d') return null

  return (
    <motion.main className="g2d" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="g2d__inner">
        <div className="g2d__topbar">
          <p className="g2d__eyebrow">A museum of work</p>
          <button className="btn" onClick={() => setPhase('title')}>
            Enter 3D museum
          </button>
        </div>

        <header>
          <h1>{PROFILE.name}</h1>
          <p className="g2d__lead">
            {PROFILE.title} · {PROFILE.location}
          </p>
          <p style={{ maxWidth: '42rem' }}>{PROFILE.bio}</p>
          <div className="g2d__links" style={{ marginTop: '1.2rem' }}>
            {PROFILE.socials.map((s) => (
              <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer">
                {s.label}
              </a>
            ))}
            <a href={PROFILE.resume} target="_blank" rel="noopener noreferrer">
              Resume
            </a>
          </div>
        </header>

        <section aria-labelledby="g2d-projects">
          <h2 id="g2d-projects">Main Projects</h2>
          <div className="g2d__grid">
            {PROJECTS.map((p) => (
              <ProjectCard key={p.id} p={p} />
            ))}
          </div>
        </section>

        <section aria-labelledby="g2d-more">
          <h2 id="g2d-more">More Works</h2>
          <div className="g2d__grid">
            {MORE_PROJECTS.map((p) => (
              <ProjectCard key={p.id} p={p} />
            ))}
          </div>
        </section>

        <section aria-labelledby="g2d-skills">
          <h2 id="g2d-skills">Skills</h2>
          <div className="g2d__skills-wall">
            {SKILLS.map((g) => (
              <article key={g.id} className="g2d__skill-card">
                <p className="g2d__skill-kicker">{g.blurb}</p>
                <h3>{g.label}</h3>
                {g.skills.map((s) => (
                  <div className="skillbar skillbar--light" key={s.name}>
                    <div className="skillbar__head">
                      <span>{s.name}</span>
                      <span>{Math.round(s.level * 100)}%</span>
                    </div>
                    <div className="skillbar__track">
                      <div className="skillbar__fill" style={{ width: `${s.level * 100}%` }} />
                    </div>
                  </div>
                ))}
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="g2d-journey">
          <h2 id="g2d-journey">The Journey</h2>
          <div className="g2d__timeline">
            {TIMELINE.map((t) => (
              <div className="g2d__tl" key={t.year}>
                <span className="g2d__tl-year">{t.year}</span>
                <p style={{ margin: 0 }}>
                  <strong>{t.title}.</strong> {t.detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="g2d-certs">
          <h2 id="g2d-certs">Certificates</h2>
          <div className="g2d__grid">
            {CERTIFICATES.map((c) => (
              <article key={c.id} className="g2d__card">
                <img src={c.image} alt={`${c.title} diploma`} loading="lazy" />
                <h3>{c.title}</h3>
                <p>
                  {c.issuer} · {c.year}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="g2d-contact" style={{ marginBottom: '4rem' }}>
          <h2 id="g2d-contact">Contact</h2>
          <p style={{ maxWidth: '42rem' }}>
            The museum is staffed by exactly one person, and he answers his mail.
          </p>
          <div className="panel__actions">
            <a className="btn" href={`mailto:${PROFILE.email}?subject=Hello%20from%20your%20museum`}>
              Email me
            </a>
          </div>
        </section>
      </div>
    </motion.main>
  )
}

import { motion } from 'framer-motion'
import { useMuseum } from '../state/store'
import { PROFILE, PROJECTS, SKILLS, CERTIFICATES, TIMELINE } from '../config/content'

/**
 * Full content parity in semantic HTML — for reduced motion, no WebGL,
 * screen readers, and anyone who just wants the facts fast.
 */
export function Gallery2D() {
  const phase = useMuseum((s) => s.phase)
  const setPhase = useMuseum((s) => s.setPhase)
  if (phase !== 'gallery2d') return null

  return (
    <motion.main className="g2d" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="g2d__inner">
        <div className="g2d__topbar">
          <p className="panel__kicker" style={{ margin: 0 }}>
            A museum of work — 2D wing
          </p>
          <button className="btn" onClick={() => setPhase('title')}>
            Enter 3D museum
          </button>
        </div>

        <header>
          <h1>{PROFILE.name}</h1>
          <p>{PROFILE.title} · {PROFILE.location}</p>
          <p>{PROFILE.bio}</p>
          <div className="g2d__links" style={{ marginTop: '1rem' }}>
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
          <h2 id="g2d-projects">Projects</h2>
          <div className="g2d__grid">
            {PROJECTS.map((p) => (
              <article key={p.id} className="g2d__card">
                <img src={p.image} alt={`${p.title} screenshot`} loading="lazy" />
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                <p style={{ fontSize: '0.72rem', letterSpacing: '0.08em', color: 'var(--accent)' }}>
                  {p.tech.join(' · ')}
                </p>
                <div className="g2d__links">
                  {p.github && (
                    <a href={p.github} target="_blank" rel="noopener noreferrer">
                      GitHub
                    </a>
                  )}
                  {p.live && (
                    <a href={p.live} target="_blank" rel="noopener noreferrer">
                      Live
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="g2d-skills">
          <h2 id="g2d-skills">Skills</h2>
          {SKILLS.map((g) => (
            <div key={g.id} style={{ marginBottom: '1.6rem' }}>
              <h3 style={{ fontWeight: 500 }}>{g.label}</h3>
              {g.skills.map((s) => (
                <div className="skillbar" key={s.name}>
                  <div className="skillbar__head">
                    <span>{s.name}</span>
                    <span style={{ color: 'var(--ink-dim)' }}>{Math.round(s.level * 100)}%</span>
                  </div>
                  <div className="skillbar__track">
                    <div className="skillbar__fill" style={{ width: `${s.level * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </section>

        <section aria-labelledby="g2d-journey">
          <h2 id="g2d-journey">The Journey</h2>
          {TIMELINE.map((t) => (
            <p key={t.year}>
              <span style={{ color: 'var(--accent)', marginRight: '0.8rem' }}>{t.year}</span>
              <strong style={{ fontWeight: 500, color: 'var(--ink)' }}>{t.title}.</strong> {t.detail}
            </p>
          ))}
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
          <p>The museum is staffed by exactly one person, and he answers his mail.</p>
          <div className="panel__actions">
            <a className="btn btn--primary" href={`mailto:${PROFILE.email}?subject=Hello%20from%20your%20museum`}>
              Email me
            </a>
          </div>
        </section>
      </div>
    </motion.main>
  )
}

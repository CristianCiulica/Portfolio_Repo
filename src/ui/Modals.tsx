import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMuseum } from '../state/store'
import { PROJECTS, MORE_PROJECTS, CERTIFICATES, SKILLS, TIMELINE, SECRET, PROFILE, ACHIEVEMENT } from '../config/content'
import { projectImageSrc } from '../scene/covers'
import { playClose } from '../systems/audio/engine'

const spring = { type: 'spring', stiffness: 260, damping: 26 } as const

export function Modals() {
  const modal = useMuseum((s) => s.modal)
  const setModal = useMuseum((s) => s.setModal)

  const close = () => {
    if (!useMuseum.getState().settings.muted) playClose()
    setModal(null)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && useMuseum.getState().modal) close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <AnimatePresence>
      {modal && (
        <motion.div
          className="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) close()
          }}
        >
          <motion.div
            className="panel"
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 34, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={spring}
          >
            <button className="panel__close" onClick={close} aria-label="Close">
              ×
            </button>
            {modal.type === 'project' && <ProjectPanel id={modal.id} />}
            {modal.type === 'cert' && <CertPanel id={modal.id} />}
            {modal.type === 'skills' && <SkillsPanel id={modal.id} />}
            {modal.type === 'contact' && <ContactPanel />}
            {modal.type === 'trophy' && <TrophyPanel />}
            {modal.type === 'archive' && <ArchivePanel />}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ProjectPanel({ id }: { id: string }) {
  const p = [...PROJECTS, ...MORE_PROJECTS].find((x) => x.id === id)
  if (!p) return null
  return (
    <>
      <p className="panel__kicker">Installation · {p.short}</p>
      <h2 className="panel__title">{p.title}</h2>
      <img className="panel__image" src={projectImageSrc(p)} alt={`${p.title} preview`} />
      <p className="panel__body">{p.description}</p>
      <div className="panel__tags">
        {p.tech.map((t) => (
          <span key={t} className="panel__tag">
            {t}
          </span>
        ))}
      </div>
      <div className="panel__actions">
        {p.live && (
          <a className="btn btn--primary" href={p.live} target="_blank" rel="noopener noreferrer">
            Live demo ↗
          </a>
        )}
        {p.github && (
          <a className="btn" href={p.github} target="_blank" rel="noopener noreferrer">
            GitHub ↗
          </a>
        )}
      </div>
    </>
  )
}

function CertPanel({ id }: { id: string }) {
  const c = CERTIFICATES.find((x) => x.id === id)
  if (!c) return null
  return (
    <>
      <p className="panel__kicker">Certificate · {c.year}</p>
      <h2 className="panel__title">{c.title}</h2>
      <img className="panel__image" src={c.image} alt={`${c.title} diploma`} />
      <p className="panel__body">Issued by {c.issuer}.</p>
    </>
  )
}

function SkillsPanel({ id }: { id: string }) {
  const g = SKILLS.find((x) => x.id === id)
  if (!g) return null
  return (
    <>
      <p className="panel__kicker">Skills Gallery</p>
      <h2 className="panel__title">{g.label}</h2>
      <p className="panel__body" style={{ marginBottom: '1.6rem' }}>
        {g.blurb}
      </p>
      <div className="skillwall">
        {g.skills.map((s, i) => (
          <div className="skillbar skillbar--panel" key={s.name}>
            <div className="skillbar__head">
              <span>{s.name}</span>
              <span>{Math.round(s.level * 100)}%</span>
            </div>
            <div className="skillbar__track">
              <motion.div
                className="skillbar__fill"
                initial={{ width: 0 }}
                animate={{ width: `${s.level * 100}%` }}
                transition={{ delay: 0.15 + i * 0.07, duration: 0.7, ease: 'easeOut' }}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

function ContactPanel() {
  const [copied, setCopied] = useState(false)
  return (
    <>
      <p className="panel__kicker">Contact</p>
      <h2 className="panel__title">Leave a message</h2>
      <p className="panel__body">
        The fastest way to reach me is email — I read everything. Or find me where the code lives.
      </p>
      <div className="panel__actions">
        <a className="btn btn--primary" href={`mailto:${PROFILE.email}?subject=Hello%20from%20your%20museum`}>
          Email me
        </a>
        <button
          className="btn"
          onClick={() => {
            navigator.clipboard?.writeText(PROFILE.email).then(() => {
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)
            })
          }}
        >
          {copied ? 'Copied ✓' : 'Copy address'}
        </button>
      </div>
      <div className="panel__actions">
        {PROFILE.socials.map((s) => (
          <a key={s.label} className="btn btn--ghost" href={s.url} target="_blank" rel="noopener noreferrer">
            {s.label} ↗
          </a>
        ))}
        <a className="btn btn--ghost" href={PROFILE.resume} target="_blank" rel="noopener noreferrer">
          Resume (PDF) ↗
        </a>
      </div>
    </>
  )
}

function TrophyPanel() {
  return (
    <>
      <p className="panel__kicker">Achievement · {ACHIEVEMENT.place.toLowerCase()}</p>
      <h2 className="panel__title">{ACHIEVEMENT.title}</h2>
      <p className="panel__body">{ACHIEVEMENT.description}</p>
    </>
  )
}

function ArchivePanel() {
  return (
    <>
      <p className="panel__kicker">The Archive · unlocked</p>
      <h2 className="panel__title">Behind the plaques</h2>

      <h3 style={{ fontWeight: 500, letterSpacing: '0.08em', marginTop: '1.8rem' }}>Developer timeline</h3>
      {TIMELINE.map((t) => (
        <p className="panel__body" key={t.year} style={{ margin: '0.5rem 0' }}>
          <span style={{ color: 'var(--accent)', marginRight: '0.8rem' }}>{t.year}</span>
          <strong style={{ fontWeight: 500 }}>{t.title}.</strong> {t.detail}
        </p>
      ))}

      <h3 style={{ fontWeight: 500, letterSpacing: '0.08em', marginTop: '1.8rem' }}>Fun facts</h3>
      {SECRET.funFacts.map((f) => (
        <p className="panel__body" key={f} style={{ margin: '0.5rem 0' }}>
          — {f}
        </p>
      ))}

      <h3 style={{ fontWeight: 500, letterSpacing: '0.08em', marginTop: '1.8rem' }}>Favorite technologies</h3>
      <div className="panel__tags">
        {SECRET.favoriteTech.map((t) => (
          <span key={t} className="panel__tag">
            {t}
          </span>
        ))}
      </div>

      <h3 style={{ fontWeight: 500, letterSpacing: '0.08em', marginTop: '1.8rem' }}>Future goals</h3>
      {SECRET.goals.map((g) => (
        <p className="panel__body" key={g} style={{ margin: '0.5rem 0' }}>
          → {g}
        </p>
      ))}
    </>
  )
}

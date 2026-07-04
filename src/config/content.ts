/** Single source of truth for everything the museum displays. */

const BASE = import.meta.env.BASE_URL

export const asset = (p: string) => BASE + p

export const PROFILE = {
  name: 'Cristian Ciulică',
  firstName: 'Cristian',
  title: 'Computer Science Student @ UNITBV',
  location: 'Brașov, Romania',
  bio: 'I build things that think — game AIs, trading dashboards, compilers of tiny languages. Computer Science student at Transilvania University of Brașov, most at home in C++ and steadily expanding into full-stack and machine learning. This museum is my work, hung on walls.',
  email: 'cristianciulicajr@gmail.com',
  resume: asset('Resume/Resume (2).pdf'),
  portrait: asset('Images/Profile/profile.jpg'),
  socials: [
    { label: 'GitHub', url: 'https://github.com/CristianCiulica' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/cristian-ciulic%C4%83-66299038a/' },
    { label: 'Instagram', url: 'https://www.instagram.com/cristian.ciulica/' },
  ],
}

export interface Project {
  id: string
  title: string
  short: string
  description: string
  tech: string[]
  /** Screenshot path; when absent a cover is generated from `cover`. */
  image?: string
  cover?: { motif: 'rings' | 'scan' | 'sheet'; from: string; to: string; tagline: string }
  github?: string
  live?: string
  accent: string
}

/** The headline work — displayed under “Main Projects” in the hall. */
export const PROJECTS: Project[] = [
  {
    id: 'fittrack',
    title: 'FitTrack',
    short: 'Workout tracking, beautifully simple',
    description:
      'A web app for tracking workouts: plan sessions, log sets and reps in seconds, and watch progress build over time through clean charts, personal records and streaks. Built to make consistency feel rewarding.',
    tech: ['React', 'TypeScript', 'Node.js', 'Charts'],
    cover: { motif: 'rings', from: '#0f766e', to: '#34d399', tagline: 'Train. Log. Progress.' },
    accent: '#4ade80',
  },
  {
    id: 'skinalert',
    title: 'SkinAlert',
    short: 'Neural networks for skin health',
    description:
      'An application that uses convolutional neural networks to screen photos of the skin for possible conditions and flags what deserves a doctor’s attention. Careful dataset work, honest confidence scores, and a clear “this is not a diagnosis” philosophy.',
    tech: ['Python', 'TensorFlow', 'CNN', 'Computer Vision'],
    cover: { motif: 'scan', from: '#1d4ed8', to: '#60a5fa', tagline: 'Early signals, clearly shown.' },
    accent: '#60a5fa',
  },
  {
    id: 'bacpro',
    title: 'BacPro',
    short: 'The Bac, in your pocket',
    description:
      'A study companion for Romanian high-schoolers preparing for the Bacalaureat: past exam subjects on your phone, worked solutions, and practical tips for exam day. Less panic, more practice.',
    tech: ['React Native', 'TypeScript', 'Firebase'],
    cover: { motif: 'sheet', from: '#b45309', to: '#fbbf24', tagline: 'Subiecte. Rezolvări. Sfaturi.' },
    accent: '#fbbf24',
  },
]

/** Earlier work that still earns wall space. */
export const MORE_PROJECTS: Project[] = [
  {
    id: 'crypto',
    title: 'Crypto Market Aggregator',
    short: 'Real-time market data & trading dashboard',
    description:
      'A full-stack crypto market data aggregator and trading dashboard, deployed on AWS as a DevOps capstone. Live price feeds are ingested, aggregated and served to an interactive dashboard with authentication — built end-to-end: infrastructure, pipeline and UI.',
    tech: ['Java', 'Spring Boot', 'Docker', 'AWS EC2', 'CI/CD', 'JavaScript'],
    image: asset('Images/projects/crypto-dashboard.jpg'),
    github: 'https://github.com/CristianCiulica/DevOps-FinalProject',
    live: 'http://51.21.160.242:8080/login.html',
    accent: '#e8b45a',
  },
  {
    id: 'wonders',
    title: '7 Wonders Duel — AI',
    short: 'Game AI with a built-in hint system',
    description:
      'A digital adaptation of the board game 7 Wonders Duel with an AI opponent and an integrated hint system that evaluates the board and suggests strong moves. Search, evaluation heuristics and game-state design were the heart of this team project.',
    tech: ['C#', 'Game AI', 'Heuristics', 'WPF'],
    image: asset('Images/projects/7wonders-duel.jpg'),
    github: 'https://github.com/pterodactylstfw/7WondersDuel',
    accent: '#7ec8d8',
  },
  {
    id: 'regex',
    title: 'Regex → DFA Converter',
    short: 'Formal languages made executable',
    description:
      'A converter that parses regular expressions and compiles them into deterministic finite automata — regex → NFA (Thompson construction) → DFA (subset construction). Compiler theory, implemented for real.',
    tech: ['C++', 'Automata Theory', 'Parsing'],
    image: asset('Images/projects/regex.jpg'),
    github: 'https://github.com/CristianCiulica/RegexToDFA',
    accent: '#d87e9e',
  },
]

export interface SkillGroup {
  id: string
  label: string
  blurb: string
  skills: { name: string; level: number }[]
}

export const SKILLS: SkillGroup[] = [
  {
    id: 'backend',
    label: 'Backend',
    blurb: 'Languages I think in.',
    skills: [
      { name: 'C++', level: 0.8 },
      { name: 'SQL', level: 0.5 },
      { name: 'C', level: 0.4 },
      { name: 'Python', level: 0.4 },
      { name: 'Java', level: 0.3 },
      { name: 'C#', level: 0.3 },
    ],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    blurb: 'Where the work becomes visible.',
    skills: [
      { name: 'HTML', level: 0.8 },
      { name: 'CSS', level: 0.7 },
      { name: 'JavaScript', level: 0.5 },
    ],
  },
  {
    id: 'frameworks',
    label: 'Frameworks',
    blurb: 'Standing on good shoulders.',
    skills: [
      { name: 'NumPy', level: 0.4 },
      { name: 'WPF', level: 0.3 },
      { name: 'Pandas', level: 0.3 },
      { name: 'Angular', level: 0.15 },
      { name: 'Spring Boot', level: 0.15 },
    ],
  },
]

export interface Certificate {
  id: string
  title: string
  issuer: string
  year: string
  image: string
}

export const CERTIFICATES: Certificate[] = [
  {
    id: 'python-ml',
    title: 'AI with Python — Machine Learning',
    issuer: 'Udemy',
    year: '2026',
    image: asset('Images/Courses/PythonML.png'),
  },
  {
    id: 'cpp',
    title: 'Coding for Everyone: C and C++',
    issuer: 'UC Santa Cruz · Coursera',
    year: '2024',
    image: asset('Images/Courses/CPP.png'),
  },
  {
    id: 'google-ai',
    title: 'Google AI Essentials',
    issuer: 'Google · Coursera',
    year: '2024',
    image: asset('Images/Courses/GoogleAI.png'),
  },
]

export interface TimelineEntry {
  year: string
  title: string
  detail: string
}

export const TIMELINE: TimelineEntry[] = [
  {
    year: '2023',
    title: 'Enrolled at UNITBV',
    detail: 'Computer Science at Transilvania University of Brașov. C, C++ and the fundamentals.',
  },
  {
    year: '2024',
    title: 'Algorithms & Systems',
    detail: 'Coursera C/C++ specialization, Google AI Essentials, first AI projects — minimax, game trees.',
  },
  {
    year: '2025',
    title: 'Full-stack & DevOps',
    detail: 'Shipped a cloud-deployed trading dashboard on AWS. Docker, CI/CD, Spring Boot in production.',
  },
  {
    year: '2026',
    title: 'Machine Learning',
    detail: 'Python ML certification. Building toward intelligent systems — and this museum.',
  },
]

export const ACHIEVEMENT = {
  id: 'krontech',
  place: '7TH PLACE',
  title: 'Krontech Challenge 2026',
  description:
    'Seventh place at the Krontech Challenge 2026 — a timed engineering competition of algorithmic and systems problems. The cup lives here, in the middle of the hall, because it was earned the same way everything else in this museum was: by showing up and building.',
}

export const SECRET = {
  funFacts: [
    'This entire museum weighs less than a single photo of it — every texture and sound is generated in code.',
    'The first program I was proud of was a Snake game. It is hanging in the Projects Hall.',
    'I straighten crooked paintings in real life too.',
    'Favorite debugging technique: explaining the bug to an empty chair.',
  ],
  favoriteTech: ['C++', 'Three.js', 'Python', 'Docker'],
  goals: [
    'Master modern C++ and systems programming',
    'Ship an ML project used by real people',
    'Contribute to open source',
    'Software engineering internship — then the real thing',
  ],
}

export const ROOM_LABELS: Record<string, string> = {
  lobby: 'Lobby',
  about: 'About',
  hall: 'Projects Hall',
  gallery: 'Skills & Journey',
  contact: 'Contact',
  secret: 'The Archive',
  exterior: 'Outside',
}

export const FONTS = {
  serif300: asset('fonts/cormorant-garamond-latin-300-normal.woff'),
  serif500: asset('fonts/cormorant-garamond-latin-500-normal.woff'),
  sans400: asset('fonts/inter-latin-400-normal.woff'),
  sans600: asset('fonts/inter-latin-600-normal.woff'),
}

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
  image: string
  github?: string
  live?: string
  accent: string
}

export const PROJECTS: Project[] = [
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
    id: 'tictactoe',
    title: 'Tic-Tac-Toe Minimax',
    short: 'An unbeatable classic',
    description:
      'Tic-Tac-Toe with a perfect-play AI built on the minimax algorithm with full game-tree exploration. Small game, real lesson: adversarial search, recursion and evaluation done properly.',
    tech: ['Python', 'Minimax', 'Algorithms'],
    image: asset('Images/projects/tictactoe-ai.jpg'),
    github: 'https://github.com/CristianCiulica/X-and-0-AI',
    accent: '#b8d87e',
  },
  {
    id: 'snake',
    title: 'Snake',
    short: 'The arcade classic, rebuilt from scratch',
    description:
      'A from-scratch implementation of Snake — game loop, input handling, collision and rendering all hand-rolled. The kind of project where you learn what a frame actually is.',
    tech: ['C++', 'Game Loop', 'Data Structures'],
    image: asset('Images/projects/snake.png'),
    github: 'https://github.com/CristianCiulica/Snake',
    accent: '#8ed87e',
  },
  {
    id: 'notepad',
    title: 'Notepad Clone',
    short: 'A desktop text editor in WPF',
    description:
      'A Windows desktop text editor modeled on Notepad, built with WPF and MVVM: file I/O, editing commands, find & replace and a native-feeling menu system.',
    tech: ['C#', 'WPF', 'MVVM', '.NET'],
    image: asset('Images/projects/NotepadPlus.png'),
    github: 'https://github.com/CristianCiulica/NotepadClone',
    accent: '#d8d07e',
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
  skills: 'Skills Gallery',
  experience: 'The Journey',
  certificates: 'Certificates',
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

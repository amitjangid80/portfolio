// Real content for Amit Jangid, sourced from his resume. Layout/copy voice
// ported from a Stitch-generated concept ("Elite Professional Digital
// Portfolio"); the underlying facts below are real, not placeholders.

export interface Profile {
    name: string;
    role: string;
    brand: string;
    email: string;
    github: string;
    linkedin: string;
}

export interface NavItem {
    to: string;
    label: string;
}

export type Accent = 'primary' | 'secondary' | 'tertiary';

export interface AboutContent {
    tags: string[];
    eyebrow: string;
    heading: string;
    paragraphs: string[];
    headingAccent: string;
}

export interface AboutStat {
    icon: string;
    label: string;
    value: string;
    accent: Accent;
}

export interface HomeAboutStat {
    value: string;
    label: string;
}

export interface HomeAboutContent {
    body: string;
    heading: string;
    stats: HomeAboutStat[];
}

export interface ExperienceEntry {
    org: string;
    role: string;
    accent: Accent;
    summary: string;
    duration: string;
}

export interface SkillsStatusItem {
    label: string;
    value: string;
}

export interface SkillsIntro {
    body: string;
    eyebrow: string;
    heading: string;
    headingAccent: string;
    statusItems: SkillsStatusItem[];
}

export interface FrontendSkill {
    name: string;
    percent: number;
}

export interface BackendService {
    name: string;
    icon: string;
    badge: string;
    description: string;
}

export interface InfraTool {
    icon: string;
    name: string;
}

export interface Project {
    slug: string;
    name: string;
    image: string;
    stack: string[];
    results: string;
    problem: string;
    solution: string;
    challenges: string;
    heroTags?: string[];
    heroTagline?: string;
}

export const profile: Profile = {
    brand: 'AMIT.DEV',
    name: 'Amit Jangid',
    email: 'hello@amit.dev',
    github: 'https://github.com/amitjangid80/',
    linkedin: 'https://www.linkedin.com/in/amit-jangid-linked-in/',
    role: 'Full Stack Tech Lead | Angular, Node.js & Golang | Kubernetes & AWS Enthusiast',
};

export const nav: NavItem[] = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Skills', to: '/skills' },
    { label: 'Projects', to: '/projects' },
    { label: 'Contact', to: '/contact' },
];

export const heroDiagramImg = '/images/amit-dev.jpg';
export const heroPortraitImg = '/images/hero-portrait.jpg';
export const aboutPortraitImg = '/images/about-portrait.jpg';
export const aboutInfraImg = '/images/about-infra-visualized.jpg';

export const about: AboutContent = {
    headingAccent: 'Systems.',
    heading: 'Engineering Scalable',
    eyebrow: 'Module: Identity_Core',
    tags: ['Microservices', 'CQRS', 'System Design', 'Golang'],
    paragraphs: [
        "I'm a Full Stack Tech Lead with 10+ years of experience designing scalable, microservices-based architectures across web, mobile and backend platforms. My work spans CQRS-based backend microservices, WebSocket-driven BFF services, and dynamic, environment-driven caching strategies that eliminate redeployment overhead and enable real-time, high-throughput performance at scale.",
        "I lead a team of 5-6 engineers, driving system design decisions and shipping production-grade solutions on Angular, Node.js, Golang and Java across AWS, Kubernetes and Docker.",
    ],
};

export const aboutStats: AboutStat[] = [
    { label: 'Runtime', value: '10+ Years', accent: 'primary', icon: 'schedule' },
    { label: 'Team Led', value: '5-6 Engineers', accent: 'secondary', icon: 'groups' },
    { label: 'Projects Shipped', value: '', accent: 'tertiary', icon: 'rocket_launch' },
];

export const homeAbout: HomeAboutContent = {
    heading: 'Engineering intent.',
    body: 'I bridge the gap between design and engineering, architecting scalable microservices-based systems and building the interfaces on top of them. With over a decade of experience across Angular, Node.js, Golang and Java, I focus on real-time, high-throughput platforms that hold up under production load.',
    stats: [
        { value: '10+', label: 'Years Runtime' },
        { value: '20+', label: 'Deployments' },
    ],
};

export const experience: ExperienceEntry[] = [
    {
        role: 'Tech Lead',
        accent: 'primary',
        duration: 'Oct 2022 - Present',
        org: 'Financial Software & Systems',
        summary: "Architected FSS's low-code/no-code platform and real-time WebSocket BFF layer (full write-ups on the Projects page), using Microservices, CQRS and Clean Architecture to keep the system scalable and maintainable. Implemented dynamic Redis caching to cut latency under load, and lead a 5-6 engineer team through system design reviews and CI/CD on Jenkins, Docker and Kubernetes across AWS.",
    },
    {
        org: 'BirlaSoft',
        accent: 'secondary',
        role: 'Technical Specialist',
        duration: 'Mar 2021 - Sep 2022',
        summary: 'Built high-performance cross-platform mobile apps in Flutter and Android SDK, and a real-time chat app on Firebase Firestore/Storage with GetX and Provider for state management. Mentored a team of developers across the full SDLC, improving productivity through structured code reviews and best-practice enforcement.',
    },
    {
        accent: 'tertiary',
        org: 'MindTech Solutions',
        role: 'Android Developer',
        duration: 'Jan 2018 - Mar 2021',
        summary: 'Developed scalable Android/Flutter applications including e-commerce platforms and POS systems, with backend-integrated real-time data updates and payment processing. Collaborated directly with stakeholders to deliver stable, high-performance releases.',
    },
    {
        accent: 'primary',
        org: 'Jobbie Services',
        role: 'Android Developer',
        duration: 'Apr 2017 - Jun 2017',
        summary: 'Built Android applications for customers and drivers, improving usability and reliability, and resolved production issues to keep the apps performant.',
    },
    {
        accent: 'secondary',
        role: 'Software Developer',
        org: 'ConnectMe Informatics',
        duration: 'Aug 2015 - Apr 2017',
        summary: 'Designed and built a Sales and Inventory ERP system, plus an end-to-end e-commerce system with mobile and web components covering order tracking and payment management, integrating frontend and backend for real-time business workflows.',
    },
    {
        accent: 'tertiary',
        role: 'ASP.NET Intern',
        org: 'ConnectMe Informatics',
        duration: 'Jan 2015 - May 2015',
        summary: 'Started out building the same Sales and Inventory ERP system and E-Commerce mobile app on ASP.NET, plus a BackOffice system for managing inventory, orders and payment status across the Android app and website.',
    },
];

export const skillsIntro: SkillsIntro = {
    heading: 'Technical',
    headingAccent: 'Arsenal',
    eyebrow: 'Module: System_Capabilities',
    body: 'A structured overview of core competencies, frameworks, and infrastructure tools. Designed for high-performance, scalable software architecture.',
    statusItems: [
        { label: 'Status', value: 'Online' },
        { label: 'Data_Integrity', value: '100%' },
    ],
};

export const frontendSkills: FrontendSkill[] = [
    { name: 'Angular', percent: 95 },
    { name: 'Flutter', percent: 95 },
    { name: 'TypeScript', percent: 90 },
    { name: 'Tailwind CSS', percent: 98 },
];

export const backendServices: BackendService[] = [
    { badge: 'Node', name: 'Node.js / Express.js', description: 'Core API Layer', icon: 'dns' },
    { badge: 'Go', name: 'Golang', description: 'High-Performance Microservices', icon: 'code' },
    { badge: 'Java', name: 'Java / Spring Boot', description: 'Enterprise Services', icon: 'domain' },
];

export const infraTags: string[] = ['AWS', 'Nginx'];

export const infraTools: InfraTool[] = [
    { icon: 'deployed_code', name: 'Docker' },
    { icon: 'account_tree', name: 'Kubernetes' },
    { icon: 'build', name: 'CI/CD Pipelines' },
];

export const projects: Project[] = [
    {
        name: 'Blaze Studio',
        slug: 'low-code-platform',
        heroTags: ['Angular', 'Golang'],
        image: '/images/proj-nexus-data.jpeg',
        stack: ['Angular', 'Node.js', 'Golang', 'ArangoDB', 'Docker', 'Kubernetes'],
        results: 'Cut development cycle time by over 40% and gave the team a repeatable path from data model to deployed microservice.',
        heroTagline: 'A DDD-based platform that auto-generates Java microservices and Angular UI components, cutting development cycle time by over 40%.',
        problem: 'Manually scaffolding Java microservices and Angular UI code for every new module was slowing the team down and duplicating effort across projects.',
        challenges: 'Keeping generated code idiomatic and maintainable rather than templated boilerplate, while supporting Docker/Kubernetes deployment for every generated service without manual configuration.',
        solution: 'Designed a DDD-based generation engine that maps modeled entities directly to Java microservices and Angular UI components, replacing hand-written boilerplate with automated, modular service scaffolding.',
    },
    {
        name: 'Blaze Studio BFF',
        slug: 'realtime-websocket-bff',
        heroTags: ['WebSocket', 'Redis'],
        image: '/images/proj-synth-ai.jpeg',
        stack: ['Node.js', 'WebSocket', 'Redis'],
        results: 'Delivered real-time, high-throughput performance at scale and eliminated redeployment overhead for cache configuration changes.',
        problem: 'High-concurrency applications needed real-time data synchronization without the latency and overhead of polling-based REST integration.',
        challenges: 'Sustaining low-latency delivery under high concurrency while keeping the caching layer dynamic enough to adapt across environments without a redeploy.',
        heroTagline: 'A WebSocket-based Backend-for-Frontend microservice with event-driven architecture and dynamic caching for real-time, high-concurrency communication.',
        solution: 'Built a WebSocket-based Backend-for-Frontend microservice with event-driven architecture, using dynamic, environment-driven Redis caching to serve real-time updates without redeployment overhead.',
    },
    {
        stack: ['Go', 'MongoDB'],
        slug: 'go-mongodb-client',
        heroTags: ['Go', 'MongoDB'],
        name: 'MongoDB Client Library for Go',
        image: '/images/proj-go-mongodb.jpeg',
        heroTagline: 'An open-source Go package that wraps MongoDB connection, database and collection setup behind a single typed config struct.',
        challenges: 'Keeping the API surface minimal and dependency-light while still supporting both standard and SRV-style MongoDB connection strings for different hosting environments.',
        results: 'Published as an open-source Go module (go get github.com/amitjangid80/go-mongodb-client) that cuts MongoDB setup down to a single config struct, reused across multiple Go services.',
        problem: 'Every new Go service needed its own boilerplate for connecting to MongoDB, creating databases and registering collections, leading to duplicated setup code across personal and professional projects.',
        solution: 'Built and published a standalone Go package that wraps MongoDB connection setup, database creation and collection registration behind a small, typed config struct and DML/response model domains, so any service can wire up MongoDB in a few lines.',
    },
    {
        stack: ['Go', 'gRPC', 'CQRS'],
        slug: 'cqrs-portfolio-backend',
        name: 'CQRS Portfolio Backend',
        image: '/images/proj-cqrs-backend.jpeg',
        results: 'Two independently deployable Go services that decouple write and read paths, letting each scale and evolve on its own schedule.',
        problem: 'A single portfolio content API mixed writes and reads on the same models, coupling read scaling to write consistency and making the data layer harder to reason about as the schema evolved.',
        challenges: 'Keeping the command and query services aligned on the same domain models without sharing a database layer, and wiring gRPC-based token validation into the command service without coupling it tightly to the auth service internals.',
        solution: 'Split the service into two independent Go microservices under a CQRS pattern: portfolio-cmd-be owns writes through a base repository layer (create/update/delete) with JWT tokens validated over gRPC against a dedicated auth service, while portfolio-query-be owns reads through its own usecase/handler layer, both serving the same education, project and work-experience domains.',
    },
    {
        slug: 'auth-server-be',
        stack: ['Go', 'JWT', 'gRPC'],
        image: '/images/proj-auth-server.jpeg',
        name: 'JWT Authentication Microservice',
        problem: 'Each backend service needed its own way to issue and validate user sessions, risking inconsistent auth logic and duplicated login flows across services.',
        challenges: 'Keeping token validation fast enough to call synchronously from other services over gRPC, while still supporting cookie-based sessions for browser clients.',
        results: 'A single source of truth for authentication across the system, with dependent services validating tokens via a gRPC call instead of maintaining their own auth logic.',
        solution: 'Built a standalone Go auth microservice that issues JWTs, manages sessions via HTTP-only cookies, and exposes login/error views plus a gRPC-reachable token-validation endpoint that other services call directly instead of re-implementing auth.',
    },
];

export const featuredProjectSlugs: string[] = ['low-code-platform', 'realtime-websocket-bff', 'go-mongodb-client'];

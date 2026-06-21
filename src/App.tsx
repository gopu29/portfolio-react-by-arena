import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useSpring,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect, useMemo, useRef, useState } from "react";
import { EffectCreative, Keyboard, Mousewheel, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/pagination";
import WorkspaceScene from "./components/WorkspaceScene";
import { cn } from "./utils/cn";

gsap.registerPlugin(ScrollTrigger);

type CursorMode = "default" | "focus" | "drag";

type CreativeWork = {
  title: string;
  category: string;
  description: string;
  tools: string[];
  height: string;
  accent: string;
  stats: string[];
};

type Project = {
  title: string;
  sector: string;
  summary: string;
  description: string;
  highlights: string[];
  tech: string[];
  metrics: { label: string; value: number; suffix?: string }[];
  architecture: string[];
  screens: string[];
  accent: string;
  secondary: string;
  gradient: string;
};

const rotatingRoles = [
  "Angular Developer",
  "Ionic Developer",
  "UI Engineer",
  "Frontend Architect",
  "Problem Solver",
];

const journeyPoints = [
  {
    title: "Enterprise product mindset",
    copy:
      "Govinda builds interfaces like products, not pages — with clear systems thinking, scalable component architecture, and polished interaction design.",
  },
  {
    title: "Government platform experience",
    copy:
      "From company registration to social security operations, he has contributed to mission-critical platforms where reliability, workflow clarity, and data-heavy UX matter.",
  },
  {
    title: "Web + mobile execution",
    copy:
      "His stack spans Angular web applications and Ionic mobile experiences, delivering consistent design language across admin dashboards, CRM tools, and field-ready apps.",
  },
];

const skillGroups = [
  {
    label: "Frontend",
    tone: "from-cyan-400/35 via-sky-500/10 to-transparent",
    description: "Component systems, scalable state, typed UI engineering, and durable architecture for enterprise workflows.",
    skills: [
      { name: "Angular", level: 94 },
      { name: "TypeScript", level: 92 },
      { name: "JavaScript", level: 88 },
      { name: "HTML5", level: 95 },
      { name: "CSS3", level: 93 },
      { name: "SCSS", level: 90 },
    ],
  },
  {
    label: "Mobile",
    tone: "from-violet-400/35 via-fuchsia-500/10 to-transparent",
    description: "Hybrid application delivery focused on performance, cross-platform UI consistency, and mobile-first workflow design.",
    skills: [{ name: "Ionic Angular", level: 89 }],
  },
  {
    label: "UI Systems",
    tone: "from-emerald-400/35 via-teal-500/10 to-transparent",
    description: "Design-to-code execution with strong emphasis on visual quality, responsive behavior, and reusable design primitives.",
    skills: [
      { name: "Angular Material", level: 92 },
      { name: "Bootstrap", level: 87 },
      { name: "Tailwind CSS", level: 86 },
      { name: "Responsive Design", level: 93 },
      { name: "Figma", level: 80 },
    ],
  },
  {
    label: "Integration & Tools",
    tone: "from-amber-400/35 via-orange-500/10 to-transparent",
    description: "API integration, realtime workflows, and modern tooling for fast iteration across product and engineering teams.",
    skills: [
      { name: "REST APIs", level: 90 },
      { name: "Firebase", level: 84 },
      { name: "MongoDB", level: 73 },
      { name: "Git", level: 90 },
      { name: "GitHub", level: 88 },
      { name: "VS Code", level: 94 },
      { name: "Cursor", level: 82 },
    ],
  },
];

const experienceMilestones = [
  {
    title: "Angular-first product delivery",
    copy:
      "Built production-ready modules for enterprise platforms using clean component composition, reusable UI patterns, and TypeScript-driven workflows.",
  },
  {
    title: "Cross-surface execution",
    copy:
      "Contributed to both browser-based dashboards and Ionic mobile applications, aligning experience quality across desktop and mobile contexts.",
  },
  {
    title: "Integration-heavy systems",
    copy:
      "Worked with REST APIs, Firebase services, dashboards, notifications, approval flows, and business-critical data presentation layers.",
  },
];

const projects: Project[] = [
  {
    title: "FUP – Portfolio Management System",
    sector: "Government Finance Platform · Gabon",
    summary: "A registration, compliance, and financial operations platform built for structured company workflows and administrative oversight.",
    description:
      "FUP was designed as a high-trust government product where multi-step submissions, admin approval workflows, dashboards, and notifications needed to feel clear, accountable, and efficient. Govinda contributed to the frontend experience with an emphasis on information hierarchy, Angular component quality, and dashboard clarity.",
    highlights: [
      "Company registration and profile workflows",
      "Employee management and compliance views",
      "Financial reporting dashboards with charts",
      "Admin approval journeys with status clarity",
      "Firebase-powered notifications for workflow events",
    ],
    tech: [
      "Angular",
      "TypeScript",
      "Angular Material",
      "PrimeNG",
      "Firebase",
      "Chart.js",
    ],
    metrics: [
      { label: "Core modules", value: 6 },
      { label: "Approval stages", value: 4 },
      { label: "Dashboard widgets", value: 12 },
    ],
    architecture: ["Registration", "Verification", "Approvals", "Analytics"],
    screens: ["Admin dashboard", "Registration pipeline", "Financial insights"],
    accent: "#22d3ee",
    secondary: "#8b5cf6",
    gradient: "from-cyan-400/18 via-sky-500/10 to-violet-500/16",
  },
  {
    title: "RedTeam CRM",
    sector: "Enterprise CRM Suite",
    summary: "A communication-first CRM platform that connected lead workflows, calling, messaging, files, and mobile access into one operational system.",
    description:
      "RedTeam CRM demanded fast interface flows, dense action surfaces, and reliable integrations. Govinda helped craft responsive Angular experiences and extended the ecosystem into Ionic mobile surfaces for real-time team usage.",
    highlights: [
      "Lead management and sales workflow design",
      "Call tracking and conversation history",
      "WhatsApp integration and file sharing",
      "Voice message handling within CRM flows",
      "Ionic-based mobile application support",
    ],
    tech: ["Angular", "Ionic", "TypeScript", "REST APIs"],
    metrics: [
      { label: "Communication tools", value: 7 },
      { label: "Surface types", value: 3 },
      { label: "Workflow states", value: 14 },
    ],
    architecture: ["Leads", "Calls", "WhatsApp", "Mobile"],
    screens: ["CRM workspace", "Lead stages", "Mobile touchpoints"],
    accent: "#a78bfa",
    secondary: "#22d3ee",
    gradient: "from-violet-400/18 via-fuchsia-500/10 to-cyan-400/14",
  },
  {
    title: "PUPS",
    sector: "Government Social Security Platform · Gabon",
    summary: "A social security administration platform centered on employee lifecycle operations, integrations, and policy-driven reporting.",
    description:
      "PUPS required disciplined UX for administrative flows across benefits, registrations, and reporting. Govinda’s contribution focused on front-end reliability, dashboard readability, and building interfaces that help operators move through complex workflows with confidence.",
    highlights: [
      "CNSS integration support",
      "CNAMGS integration support",
      "Employee lifecycle management",
      "Operational reports and administrative dashboards",
      "Structured navigation for policy-driven workflows",
    ],
    tech: ["Angular", "Firebase", "Chart.js"],
    metrics: [
      { label: "Governance modules", value: 5 },
      { label: "National integrations", value: 2 },
      { label: "Report views", value: 10 },
    ],
    architecture: ["Employees", "Benefits", "Integrations", "Reports"],
    screens: ["Lifecycle hub", "Admin reporting", "System dashboards"],
    accent: "#34d399",
    secondary: "#22d3ee",
    gradient: "from-emerald-400/18 via-teal-500/10 to-cyan-400/12",
  },
  {
    title: "Lakshmi Hyundai",
    sector: "Automotive Showcase Platform",
    summary: "A modern vehicle discovery and test-drive booking experience with location-aware inventory and dynamic admin controls.",
    description:
      "Lakshmi Hyundai combined promotional storytelling with practical booking and content-management flows. Govinda helped shape a clean, responsive frontend experience that made inventory discovery and test-drive conversion feel intuitive across devices.",
    highlights: [
      "Location-based vehicle inventory presentation",
      "Test drive booking journey",
      "Admin portal support",
      "Google Sheets-powered content workflows",
      "Dynamic content management for rapid updates",
    ],
    tech: ["Angular", "TypeScript", "REST APIs"],
    metrics: [
      { label: "Booking flows", value: 3 },
      { label: "Inventory zones", value: 4 },
      { label: "Content pipelines", value: 1 },
    ],
    architecture: ["Showcase", "Inventory", "Bookings", "Content"],
    screens: ["Vehicle gallery", "Booking flow", "Admin updates"],
    accent: "#f59e0b",
    secondary: "#fb7185",
    gradient: "from-amber-400/18 via-orange-500/10 to-rose-400/16",
  },
];

const creativeWorks: CreativeWork[] = [
  {
    title: "Interface Systems",
    category: "UI Design",
    description:
      "Structured dashboard layouts, design-system thinking, enterprise table patterns, and clean interaction hierarchies for complex products.",
    tools: ["Figma", "Angular Material", "Tailwind"],
    height: "h-72",
    accent: "from-cyan-400/25 via-sky-500/10 to-transparent",
    stats: ["Design tokens", "Tables", "Dashboards"],
  },
  {
    title: "Product Prototypes",
    category: "Figma Work",
    description:
      "Rapid product exploration, layout experimentation, and handoff-ready UI concepts optimized for engineering feasibility.",
    tools: ["Figma", "Auto Layout", "Component Sets"],
    height: "h-96",
    accent: "from-violet-400/25 via-fuchsia-500/10 to-transparent",
    stats: ["Flows", "Wireframes", "Variants"],
  },
  {
    title: "Visual Retouching",
    category: "Photo Editing",
    description:
      "Clean marketing-ready image treatment for banners, thumbnails, hero visuals, and polished digital presentation layers.",
    tools: ["Photoshop", "Lightroom", "Color Correction"],
    height: "h-64",
    accent: "from-amber-400/25 via-orange-500/10 to-transparent",
    stats: ["Banners", "Composites", "Exports"],
  },
  {
    title: "Motion Storytelling",
    category: "Video Editing",
    description:
      "Short-form product storytelling, UI walkthrough assembly, and clean edits that communicate software value with clarity.",
    tools: ["Premiere Pro", "After Effects", "Motion Graphics"],
    height: "h-80",
    accent: "from-emerald-400/25 via-teal-500/10 to-transparent",
    stats: ["Cuts", "Transitions", "Showreels"],
  },
];

const stats = [
  { value: 4, label: "Flagship products", suffix: "" },
  { value: 6, label: "Application surfaces", suffix: "+" },
  { value: 10, label: "APIs & services integrated", suffix: "+" },
  { value: 100, label: "Reusable UI components", suffix: "+" },
];

function SectionEyebrow({ children }: { children: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-slate-300 backdrop-blur-xl">
      <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.85)]" />
      {children}
    </div>
  );
}

function MagneticButton({
  href,
  children,
  className,
  download = false,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  download?: boolean;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.35 });
  const my = useSpring(y, { stiffness: 220, damping: 18, mass: 0.35 });

  return (
    <motion.a
      href={href}
      download={download}
      style={{ x: mx, y: my }}
      data-cursor="focus"
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        x.set((event.clientX - rect.left - rect.width / 2) * 0.12);
        y.set((event.clientY - rect.top - rect.height / 2) * 0.12);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className={cn(
        "magnetic-button inline-flex items-center justify-center gap-2 rounded-full border border-white/12 px-6 py-3 text-sm font-semibold text-white transition-transform duration-300",
        className
      )}
    >
      {children}
    </motion.a>
  );
}

function Counter({
  value,
  suffix = "",
  className,
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.7 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let frame = 0;
    const duration = 1400;
    const start = performance.now();

    const tick = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [inView, value]);

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}

function CursorAura({
  x,
  y,
  mode,
  enabled,
}: {
  x: number;
  y: number;
  mode: CursorMode;
  enabled: boolean;
}) {
  if (!enabled) return null;

  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[60] hidden h-4 w-4 rounded-full border border-white/70 bg-white/20 mix-blend-screen md:block"
        animate={{
          x: x - 8,
          y: y - 8,
          scale: mode === "focus" ? 1.7 : mode === "drag" ? 0.8 : 1,
        }}
        transition={{ type: "spring", stiffness: 420, damping: 32, mass: 0.35 }}
      />
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[55] hidden rounded-full border border-cyan-300/35 bg-cyan-300/8 backdrop-blur-md md:block"
        animate={{
          x: x - (mode === "focus" ? 34 : 24),
          y: y - (mode === "focus" ? 34 : 24),
          width: mode === "focus" ? 68 : 48,
          height: mode === "focus" ? 68 : 48,
          opacity: mode === "drag" ? 0.4 : 1,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 28 }}
      />
    </>
  );
}

function ContactChannel({
  label,
  value,
  action,
  href,
  tone,
}: {
  label: string;
  value: string;
  action: string;
  href?: string;
  tone: string;
}) {
  const content = (
    <div
      data-cursor="focus"
      className={cn(
        "group rounded-[1.5rem] border border-white/10 bg-white/6 p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/18",
        tone
      )}
    >
      <div className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">{label}</div>
      <div className="mb-2 text-lg font-semibold text-white">{value}</div>
      <div className="text-sm text-slate-300">{action}</div>
    </div>
  );

  if (!href) return content;

  return (
    <a href={href} className="block" aria-label={label}>
      {content}
    </a>
  );
}

function ProjectVisual({ project, index }: { project: Project; index: number }) {
  return (
    <div className="grid gap-5 lg:grid-rows-[1.2fr_0.8fr]">
      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="project-visual-card relative overflow-hidden rounded-[1.9rem] border border-white/10 bg-slate-950/50 p-5 backdrop-blur-2xl">
          <div className={cn("absolute inset-0 bg-gradient-to-br opacity-90", project.gradient)} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_38%)]" />
          <div className="relative flex h-full min-h-[22rem] flex-col justify-between">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-slate-300">Visual presentation</div>
                <div className="mt-2 text-lg font-semibold text-white">{project.screens[0]}</div>
              </div>
              <div className="rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs text-slate-200">
                0{index + 1}
              </div>
            </div>

            <div className="relative flex items-end justify-center gap-4 py-8">
              <div className="device-frame laptop-card w-[64%] rotate-[-6deg]">
                <div className="screen-shell h-48">
                  <div className="screen-header">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="screen-grid">
                    {project.screens.map((screen) => (
                      <div key={screen} className="screen-row">
                        <div className="screen-chip" style={{ backgroundColor: project.accent }} />
                        <div className="screen-line" />
                        <div className="screen-line short" />
                        <div className="screen-label">{screen}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="device-frame monitor-card hidden w-[28%] translate-y-[-1rem] rotate-[5deg] md:block">
                <div className="screen-shell h-40">
                  <div className="screen-grid compact">
                    {project.metrics.map((metric) => (
                      <div key={metric.label} className="metric-pill">
                        <span className="metric-dot" style={{ backgroundColor: project.secondary }} />
                        {metric.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="device-frame phone-card absolute bottom-3 right-4 w-24 rotate-[12deg] md:right-8 md:w-28">
                <div className="screen-shell h-44">
                  <div className="screen-grid phone">
                    <div className="phone-notch" />
                    <div className="screen-card pulse" style={{ borderColor: `${project.accent}66` }} />
                    <div className="screen-card" style={{ borderColor: `${project.secondary}66` }} />
                    <div className="screen-card small" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-slate-200">
              {project.tech.map((item) => (
                <span key={item} className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[1.9rem] border border-white/10 bg-white/6 p-5 backdrop-blur-2xl">
          <div className="mb-4 text-xs uppercase tracking-[0.3em] text-slate-400">Architecture snapshot</div>
          <div className="architecture-grid relative grid min-h-[22rem] grid-cols-2 gap-3">
            {project.architecture.map((node, nodeIndex) => (
              <div
                key={node}
                className="architecture-node rounded-[1.3rem] border border-white/10 bg-slate-950/55 p-4"
                style={{ animationDelay: `${nodeIndex * 120}ms` }}
              >
                <div className="mb-2 text-xs uppercase tracking-[0.26em] text-slate-500">Node {nodeIndex + 1}</div>
                <div className="text-base font-semibold text-white">{node}</div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/6">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${72 + nodeIndex * 6}%`,
                      background: `linear-gradient(90deg, ${project.accent}, ${project.secondary})`,
                    }}
                  />
                </div>
              </div>
            ))}
            <div className="connector connector-x" />
            <div className="connector connector-y" />
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {project.metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-[1.4rem] border border-white/10 bg-slate-950/55 p-4 backdrop-blur-xl"
          >
            <div className="text-xs uppercase tracking-[0.26em] text-slate-500">{metric.label}</div>
            <Counter
              value={metric.value}
              suffix={metric.suffix}
              className="mt-3 block text-3xl font-semibold text-white"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const appRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const footerInView = useInView(footerRef, { amount: 0.35 });

  const [roleIndex, setRoleIndex] = useState(0);
  const [activeProject, setActiveProject] = useState(0);
  const [selectedWork, setSelectedWork] = useState<CreativeWork | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0, nx: 0, ny: 0 });
  const [cursorMode, setCursorMode] = useState<CursorMode>("default");
  const [finePointer, setFinePointer] = useState(false);

  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, index) => ({
        id: index,
        left: `${(index * 7 + 9) % 100}%`,
        top: `${(index * 13 + 11) % 100}%`,
        delay: index * 0.35,
        duration: 8 + (index % 5) * 1.2,
        size: 6 + (index % 4) * 4,
      })),
    []
  );

  const floatingBadges = useMemo(
    () => ["Angular", "Ionic", "TypeScript", "UI Systems", "REST APIs", "Firebase"],
    []
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      setRoleIndex((current) => (current + 1) % rotatingRoles.length);
    }, 2200);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(pointer: fine)");
    const apply = (matches: boolean) => setFinePointer(matches);
    apply(media.matches);

    const handleChange = (event: MediaQueryListEvent) => apply(event.matches);
    media.addEventListener("change", handleChange);

    const updateCursor = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      const mode = target?.closest("[data-cursor='drag']")
        ? "drag"
        : target?.closest("[data-cursor='focus']")
          ? "focus"
          : "default";

      setCursorMode(mode);
      setCursorPosition({
        x: event.clientX,
        y: event.clientY,
        nx: event.clientX / window.innerWidth - 0.5,
        ny: event.clientY / window.innerHeight - 0.5,
      });
    };

    const resetMode = () => setCursorMode("default");
    window.addEventListener("pointermove", updateCursor);
    window.addEventListener("pointerdown", () => setCursorMode("drag"));
    window.addEventListener("pointerup", resetMode);

    return () => {
      media.removeEventListener("change", handleChange);
      window.removeEventListener("pointermove", updateCursor);
      window.removeEventListener("pointerup", resetMode);
    };
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lenis: Lenis | null = null;
    let rafId = 0;

    if (!reducedMotion) {
      lenis = new Lenis({
        autoRaf: false,
        lerp: 0.08,
        smoothWheel: true,
      });

      const raf = (time: number) => {
        lenis?.raf(time);
        rafId = window.requestAnimationFrame(raf);
      };

      rafId = window.requestAnimationFrame(raf);
      lenis.on("scroll", ScrollTrigger.update);
    }

    const context = gsap.context(() => {
      if (reducedMotion) {
        gsap.set("[data-reveal]", { autoAlpha: 1, y: 0, filter: "blur(0px)" });
        return;
      }

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element, index) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 42, filter: "blur(12px)" },
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1,
            ease: "power3.out",
            delay: (index % 3) * 0.06,
            scrollTrigger: {
              trigger: element,
              start: "top 86%",
              once: true,
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((element) => {
        const depth = Number(element.dataset.depth || 1);
        gsap.to(element, {
          yPercent: -12 * depth,
          ease: "none",
          scrollTrigger: {
            trigger: element.closest("section") ?? element,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      const timelineProgress = document.querySelector<HTMLElement>(".timeline-progress");
      if (timelineProgress) {
        gsap.fromTo(
          timelineProgress,
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: "top top",
            ease: "none",
            scrollTrigger: {
              trigger: "#experience",
              start: "top 65%",
              end: "bottom 80%",
              scrub: true,
            },
          }
        );
      }
    }, appRef);

    return () => {
      context.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      if (lenis) lenis.destroy();
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={appRef} className="relative min-h-screen overflow-x-clip bg-[#050816] text-white">
      <CursorAura
        x={cursorPosition.x}
        y={cursorPosition.y}
        mode={cursorMode}
        enabled={finePointer}
      />

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.14),transparent_24%),radial-gradient(circle_at_50%_120%,rgba(6,182,212,0.12),transparent_36%)]" />
        {particles.map((particle) => (
          <motion.span
            key={particle.id}
            className="particle-dot absolute rounded-full bg-white/50"
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
            }}
            animate={{
              y: [0, -18, 0],
              x: [0, 10, -4, 0],
              opacity: [0.2, 0.8, 0.24],
              scale: [1, 1.22, 0.92, 1],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: particle.duration,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <header className="fixed inset-x-0 top-0 z-40 mx-auto flex max-w-7xl items-center justify-between px-4 pt-4 sm:px-6 lg:px-8">
        <div className="glass-panel flex w-full items-center justify-between rounded-full px-4 py-3">
          <a href="#home" className="flex items-center gap-3" data-cursor="focus">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-sm font-semibold text-white">
              GPB
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Govinda P B</div>
              <div className="text-xs text-slate-400">Angular & Ionic Developer</div>
            </div>
          </a>

          <nav className="hidden items-center gap-6 text-sm text-slate-300 lg:flex">
            {[
              ["About", "#about"],
              ["Skills", "#skills"],
              ["Experience", "#experience"],
              ["Projects", "#projects"],
              ["Contact", "#contact"],
            ].map(([label, href]) => (
              <a key={label} href={href} data-cursor="focus" className="transition hover:text-white">
                {label}
              </a>
            ))}
          </nav>

          <MagneticButton href="#projects" className="hidden bg-white/10 lg:inline-flex">
            View Case Studies
          </MagneticButton>
        </div>
      </header>

      <main className="relative z-10">
        <section id="home" className="section-shell pt-30 pb-18 sm:pt-36 lg:pt-40">
          <div className="grid gap-10 xl:grid-cols-[1.04fr_0.96fr] xl:items-center">
            <div className="space-y-8">
              <div data-reveal className="space-y-5">
                <SectionEyebrow>Premium frontend portfolio</SectionEyebrow>
                <div className="space-y-4">
                  <p className="text-sm uppercase tracking-[0.34em] text-slate-400">
                    Frontend Developer | Angular & Ionic Developer
                  </p>
                  <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl xl:text-[5.4rem]">
                    Govinda P B
                  </h1>
                  <div className="flex min-h-14 flex-wrap items-center gap-3 text-xl text-slate-200 sm:text-2xl">
                    <span className="text-slate-400">Crafting enterprise-grade experiences as</span>
                    <span className="glass-pill relative inline-flex h-11 items-center overflow-hidden px-4 font-semibold text-white">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={rotatingRoles[roleIndex]}
                          initial={{ y: 18, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -18, opacity: 0 }}
                          transition={{ duration: 0.42, ease: "easeOut" }}
                          className="inline-block"
                        >
                          {rotatingRoles[roleIndex]}
                        </motion.span>
                      </AnimatePresence>
                    </span>
                  </div>
                  <p className="max-w-2xl text-lg leading-8 text-slate-300">
                    Nearly 2 years of professional experience building enterprise web and mobile
                    applications — from government systems in Gabon to CRM platforms and booking
                    experiences — with a strong focus on Angular architecture, Ionic delivery,
                    polished UI systems, and product-minded frontend execution.
                  </p>
                </div>
              </div>

              <div data-reveal className="flex flex-wrap gap-4">
                <MagneticButton href="#contact" className="bg-white text-slate-950">
                  Let’s Build Something Great
                </MagneticButton>
                <MagneticButton href="/govinda-pb-resume.txt" download className="bg-white/8">
                  Download Resume Snapshot
                </MagneticButton>
              </div>

              <div data-reveal className="grid gap-4 sm:grid-cols-3">
                {[
                  ["Enterprise UX", "Angular interfaces for dense workflows and admin-heavy systems."],
                  ["Mobile Delivery", "Ionic experiences aligned with the same quality bar as web."],
                  ["Product Thinking", "Cleaner flows, stronger systems, and sharper interaction details."],
                ].map(([title, copy]) => (
                  <div key={title} className="glass-panel rounded-[1.6rem] p-5">
                    <div className="mb-3 text-sm font-semibold text-white">{title}</div>
                    <p className="text-sm leading-6 text-slate-300">{copy}</p>
                  </div>
                ))}
              </div>
            </div>

            <div data-reveal className="relative">
              <div className="absolute -left-6 top-10 h-28 w-28 rounded-full bg-cyan-400/22 blur-3xl" data-parallax data-depth="1.2" />
              <div className="absolute right-8 top-0 h-32 w-32 rounded-full bg-violet-500/22 blur-3xl" data-parallax data-depth="1.5" />
              <div className="glass-panel hero-scene-shell relative overflow-hidden rounded-[2rem] p-3 sm:p-5">
                <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 pt-5 text-xs uppercase tracking-[0.28em] text-slate-400">
                  <span>Interactive workspace</span>
                  <span>Angular • Ionic • UI</span>
                </div>
                <WorkspaceScene
                  cursor={{ x: cursorPosition.nx, y: cursorPosition.ny }}
                  active
                  mode="hero"
                  className="h-[26rem] w-full sm:h-[32rem] lg:h-[36rem]"
                />
                <div className="absolute bottom-5 left-5 right-5 grid gap-3 sm:grid-cols-3">
                  {[
                    ["Code Flow", "Animated Angular-style workspace with responsive motion."],
                    ["Product Desk", "Laptop, monitor, phone, mug, keyboard, headphones, lamp."],
                    ["Micro Motion", "Cursor reaction, ambient particles, and subtle scene life."],
                  ].map(([title, copy]) => (
                    <div key={title} className="rounded-2xl border border-white/10 bg-slate-950/36 p-3 backdrop-blur-xl">
                      <div className="text-sm font-semibold text-white">{title}</div>
                      <div className="mt-1 text-xs leading-5 text-slate-300">{copy}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="section-shell py-16 sm:py-20">
          <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
            <div data-reveal className="space-y-6 xl:sticky xl:top-28 xl:self-start">
              <SectionEyebrow>About</SectionEyebrow>
              <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
                A frontend engineer growing through product complexity, not just visuals.
              </h2>
              <p className="text-lg leading-8 text-slate-300">
                Govinda’s journey is rooted in building interfaces that help real organizations
                operate better. That means understanding workflows, reducing friction, structuring
                information clearly, and shipping UI that can scale across teams, data, and devices.
              </p>
            </div>

            <div className="space-y-5">
              <div data-reveal className="glass-panel rounded-[2rem] p-6 sm:p-8">
                <p className="text-base leading-8 text-slate-300 sm:text-lg">
                  At <span className="font-semibold text-white">Saiha Software Technologies Pvt Ltd</span>,
                  he has contributed to products ranging from government administration systems and
                  financial platforms to enterprise CRM tools and automotive booking experiences.
                  Across each project, his focus has remained consistent: bring clarity to complex
                  interfaces, elevate UX quality, and create frontend systems that are dependable,
                  maintainable, and pleasant to use.
                </p>
              </div>

              <div className="grid gap-5">
                {journeyPoints.map((point) => (
                  <div key={point.title} data-reveal className="glass-panel rounded-[1.75rem] p-6">
                    <div className="mb-2 text-lg font-semibold text-white">{point.title}</div>
                    <p className="text-sm leading-7 text-slate-300">{point.copy}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="section-shell py-16 sm:py-20">
          <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div data-reveal className="space-y-4">
              <SectionEyebrow>Skills map</SectionEyebrow>
              <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
                Frontend capability visualized as a living system.
              </h2>
            </div>
            <p data-reveal className="max-w-2xl text-base leading-7 text-slate-300">
              Instead of static skill cards, this section frames Govinda’s strengths the way modern
              product teams experience them: layered, interconnected, and sharpened by execution.
            </p>
          </div>

          <div className="relative">
            <div className="skill-orb absolute left-1/2 top-1/2 hidden h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full xl:block" />
            <div className="absolute left-1/2 top-[14%] hidden -translate-x-1/2 xl:flex">
              <div className="glass-pill px-5 py-3 text-sm text-slate-200">Architecture-first mindset</div>
            </div>
            <div className="grid gap-5 xl:grid-cols-2">
              {skillGroups.map((group, groupIndex) => (
                <div
                  key={group.label}
                  data-reveal
                  data-cursor="focus"
                  className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/45 p-6 backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-white/16"
                >
                  <div className={cn("absolute inset-0 bg-gradient-to-br opacity-90", group.tone)} />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_36%)]" />
                  <div className="relative space-y-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-xs uppercase tracking-[0.32em] text-slate-400">Cluster 0{groupIndex + 1}</div>
                        <h3 className="mt-2 text-2xl font-semibold text-white">{group.label}</h3>
                      </div>
                      <div className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs text-slate-200">
                        {group.skills.length} skills
                      </div>
                    </div>
                    <p className="max-w-xl text-sm leading-7 text-slate-300">{group.description}</p>
                    <div className="space-y-4">
                      {group.skills.map((skill, skillIndex) => (
                        <div key={skill.name} className="space-y-2">
                          <div className="flex items-center justify-between text-sm text-slate-200">
                            <span>{skill.name}</span>
                            <span>{skill.level}%</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-white/8">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.level}%` }}
                              viewport={{ once: true, amount: 0.6 }}
                              transition={{ duration: 0.8, delay: skillIndex * 0.06, ease: "easeOut" }}
                              className="h-full rounded-full bg-[linear-gradient(90deg,rgba(34,211,238,1),rgba(167,139,250,1))]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {[
                "Angular Material",
                "Bootstrap",
                "Tailwind CSS",
                "Responsive Design",
                "Figma",
                "Firebase",
                "MongoDB",
                "GitHub",
              ].map((item, index) => (
                <div
                  key={item}
                  data-reveal
                  data-parallax
                  data-depth={1 + (index % 3) * 0.2}
                  className="glass-pill px-4 py-2 text-sm text-slate-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="experience" className="section-shell py-16 sm:py-20">
          <div className="mb-10 space-y-4" data-reveal>
            <SectionEyebrow>Experience timeline</SectionEyebrow>
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
              Production experience in enterprise-grade product environments.
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-[0.56fr_1.44fr]">
            <div data-reveal className="glass-panel rounded-[2rem] p-6">
              <div className="text-sm uppercase tracking-[0.3em] text-slate-400">Current role</div>
              <h3 className="mt-4 text-2xl font-semibold text-white">Junior Full Stack Developer</h3>
              <p className="mt-3 text-slate-300">Saiha Software Technologies Pvt Ltd</p>
              <p className="text-slate-400">Kochi, Kerala</p>
              <div className="mt-6 inline-flex rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-slate-200">
                June 2024 — Present
              </div>
            </div>

            <div className="relative pl-8 sm:pl-10">
              <div className="absolute left-3 top-0 h-full w-px bg-white/10 sm:left-4" />
              <div className="timeline-progress absolute left-3 top-0 h-full w-px bg-[linear-gradient(180deg,rgba(34,211,238,1),rgba(167,139,250,1))] sm:left-4" />
              <div className="space-y-8">
                {experienceMilestones.map((milestone) => (
                  <div key={milestone.title} data-reveal className="relative">
                    <div className="absolute -left-[1.55rem] top-3 h-4 w-4 rounded-full border border-cyan-300/50 bg-[#050816] shadow-[0_0_18px_rgba(34,211,238,0.55)] sm:-left-[1.65rem]" />
                    <div className="glass-panel rounded-[1.75rem] p-6">
                      <div className="mb-2 text-lg font-semibold text-white">{milestone.title}</div>
                      <p className="text-sm leading-7 text-slate-300">{milestone.copy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="section-shell py-16 sm:py-20">
          <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div data-reveal className="space-y-4">
              <SectionEyebrow>Case studies</SectionEyebrow>
              <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
                Flagship projects presented like premium product stories.
              </h2>
            </div>
            <p data-reveal className="max-w-2xl text-base leading-7 text-slate-300">
              This showcase is built as the centerpiece of the portfolio — horizontal, immersive,
              and recruiter-friendly — to demonstrate the kind of frontend thinking Govinda brings
              to architecture, UX, and implementation.
            </p>
          </div>

          <div data-reveal className="project-swiper-shell rounded-[2.2rem] border border-white/10 bg-white/4 p-3 backdrop-blur-2xl">
            <Swiper
              modules={[EffectCreative, Pagination, Mousewheel, Keyboard]}
              effect="creative"
              creativeEffect={{
                prev: { translate: ["-8%", 0, -1], opacity: 0.6, scale: 0.94 },
                next: { translate: ["8%", 0, 0], opacity: 0.7, scale: 0.97 },
              }}
              pagination={{ clickable: true }}
              mousewheel={{ forceToAxis: true, sensitivity: 0.7 }}
              keyboard={{ enabled: true }}
              onSlideChange={(swiper) => setActiveProject(swiper.realIndex)}
              className="project-swiper"
            >
              {projects.map((project, index) => (
                <SwiperSlide key={project.title}>
                  <div
                    data-cursor="drag"
                    className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/55 px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10"
                  >
                    <div className={cn("absolute inset-0 bg-gradient-to-br opacity-95", project.gradient)} />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_28%),linear-gradient(180deg,rgba(2,6,23,0.15),rgba(2,6,23,0.72))]" />
                    <div className="relative grid min-h-[76vh] gap-8 xl:grid-cols-[0.88fr_1.12fr]">
                      <div className="flex flex-col justify-between gap-6">
                        <div className="space-y-5">
                          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.32em] text-slate-300">
                            <span>{project.sector}</span>
                            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-white/50" />
                            <span>Slide 0{index + 1}</span>
                          </div>
                          <div>
                            <h3 className="max-w-xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                              {project.title}
                            </h3>
                            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-200">{project.summary}</p>
                            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">{project.description}</p>
                          </div>
                        </div>

                        <div className="grid gap-5 lg:grid-cols-[0.98fr_1.02fr]">
                          <div className="rounded-[1.6rem] border border-white/10 bg-slate-950/45 p-5 backdrop-blur-xl">
                            <div className="mb-3 text-xs uppercase tracking-[0.3em] text-slate-400">Highlights</div>
                            <ul className="space-y-3 text-sm leading-7 text-slate-200">
                              {project.highlights.map((highlight) => (
                                <li key={highlight} className="flex gap-3">
                                  <span className="mt-2 h-2 w-2 rounded-full bg-cyan-300" />
                                  <span>{highlight}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="rounded-[1.6rem] border border-white/10 bg-slate-950/45 p-5 backdrop-blur-xl">
                            <div className="mb-3 text-xs uppercase tracking-[0.3em] text-slate-400">Technology stack</div>
                            <div className="flex flex-wrap gap-2">
                              {project.tech.map((item) => (
                                <span key={item} className="rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-sm text-slate-100">
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <ProjectVisual key={`${project.title}-${activeProject === index}`} project={project} index={index} />
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        <section id="creative" className="section-shell py-16 sm:py-20">
          <div className="mb-10 grid gap-5 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div data-reveal className="space-y-4">
              <SectionEyebrow>Creative works</SectionEyebrow>
              <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
                Design fluency beyond implementation.
              </h2>
            </div>
            <p data-reveal className="max-w-2xl text-base leading-7 text-slate-300 lg:justify-self-end">
              Govinda’s creative side strengthens his engineering judgment: better spacing,
              stronger hierarchy, cleaner motion, and tighter collaboration with design.
            </p>
          </div>

          <div className="columns-1 gap-5 space-y-5 md:columns-2 xl:columns-4">
            {creativeWorks.map((work) => (
              <button
                key={work.title}
                type="button"
                data-reveal
                data-cursor="focus"
                onClick={() => setSelectedWork(work)}
                className={cn(
                  "group mb-5 block w-full break-inside-avoid overflow-hidden rounded-[1.9rem] border border-white/10 bg-slate-950/55 p-5 text-left backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-white/18",
                  work.height
                )}
              >
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-85", work.accent)} />
                <div className="relative flex h-full flex-col justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.3em] text-slate-400">{work.category}</div>
                    <h3 className="mt-3 text-2xl font-semibold text-white">{work.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-slate-300">{work.description}</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {work.tools.map((tool) => (
                        <span key={tool} className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs text-slate-200">
                          {tool}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                      {work.stats.map((item) => (
                        <span key={item} className="rounded-full border border-white/10 px-3 py-1">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="section-shell py-16 sm:py-20">
          <div className="glass-panel rounded-[2.2rem] p-6 sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
              <div data-reveal className="space-y-4">
                <SectionEyebrow>Statistics</SectionEyebrow>
                <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                  Quantified momentum behind the work.
                </h2>
                <p className="text-base leading-7 text-slate-300">
                  A concise snapshot of the scale and breadth of Govinda’s application-focused
                  frontend work so far.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((item) => (
                  <div key={item.label} data-reveal className="rounded-[1.5rem] border border-white/10 bg-slate-950/42 p-5 backdrop-blur-xl">
                    <Counter
                      value={item.value}
                      suffix={item.suffix}
                      className="block text-4xl font-semibold tracking-[-0.04em] text-white"
                    />
                    <div className="mt-3 text-sm leading-6 text-slate-300">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="section-shell py-16 sm:py-20">
          <div className="glass-panel rounded-[2.3rem] p-6 sm:p-8 lg:p-10">
            <div className="grid gap-8 xl:grid-cols-[0.82fr_1.18fr]">
              <div data-reveal className="space-y-5">
                <SectionEyebrow>Contact</SectionEyebrow>
                <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
                  Ready to contribute to ambitious frontend teams and product experiences.
                </h2>
                <p className="max-w-xl text-base leading-8 text-slate-300">
                  If you’re hiring for Angular, Ionic, frontend architecture, or product-focused UI
                  execution, this portfolio is built to show how Govinda thinks, designs, and ships.
                </p>
                <div className="flex flex-wrap gap-4">
                  <MagneticButton href="mailto:" className="bg-white text-slate-950">
                    Start a Conversation
                  </MagneticButton>
                  <MagneticButton href="/govinda-pb-resume.txt" download className="bg-white/8">
                    Resume Download
                  </MagneticButton>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div data-reveal>
                  <ContactChannel
                    label="Email"
                    value="Available via direct outreach"
                    action="Open your mail client and start the conversation."
                    href="mailto:"
                    tone=""
                  />
                </div>
                <div data-reveal>
                  <ContactChannel
                    label="GitHub"
                    value="Portfolio-ready profile slot"
                    action="Add personal repository URL for recruiter handoff."
                    tone=""
                  />
                </div>
                <div data-reveal>
                  <ContactChannel
                    label="LinkedIn"
                    value="Recruiter connection slot"
                    action="Ideal place to connect for opportunities and collaboration."
                    tone=""
                  />
                </div>
                <div data-reveal>
                  <ContactChannel
                    label="Resume"
                    value="Downloadable career snapshot"
                    action="Quick summary of experience, stack, and flagship projects."
                    href="/govinda-pb-resume.txt"
                    tone=""
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer ref={footerRef} className="section-shell relative pb-14 pt-8 sm:pb-16">
        <div className="city-lights absolute inset-x-0 bottom-0 h-56" />
        <div className="grid gap-8 xl:grid-cols-[0.72fr_1.28fr] xl:items-center">
          <div data-reveal className="space-y-5">
            <SectionEyebrow>Final scene</SectionEyebrow>
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
              A developer workspace that comes alive at the finish.
            </h2>
            <p className="max-w-xl text-base leading-8 text-slate-300">
              The closing scene mirrors Govinda’s craft: calm, organized, premium, and always in
              motion — shaped by Angular precision, Ionic adaptability, and a strong UI sensibility.
            </p>
            <div className="flex flex-wrap gap-3">
              {floatingBadges.map((badge, index) => (
                <motion.div
                  key={badge}
                  data-cursor="focus"
                  className="glass-pill px-4 py-2 text-sm text-slate-200"
                  animate={
                    footerInView
                      ? {
                          y: [0, -8, 0],
                          rotate: [0, index % 2 === 0 ? 2 : -2, 0],
                        }
                      : { y: 0, rotate: 0 }
                  }
                  transition={{
                    repeat: footerInView ? Number.POSITIVE_INFINITY : 0,
                    duration: 4 + index * 0.35,
                    ease: "easeInOut",
                  }}
                >
                  {badge}
                </motion.div>
              ))}
            </div>
          </div>

          <div data-reveal className="relative overflow-hidden rounded-[2.2rem] border border-white/10 bg-white/4 p-4 backdrop-blur-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_34%),radial-gradient(circle_at_80%_10%,rgba(139,92,246,0.18),transparent_26%)]" />
            <div className="relative h-[24rem] sm:h-[30rem] lg:h-[34rem]">
              <div className="pointer-events-none absolute left-5 top-5 z-10 rounded-full border border-white/10 bg-slate-950/50 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-300 backdrop-blur-xl">
                Live workspace • 3D desk scene
              </div>
              <WorkspaceScene
                cursor={{ x: cursorPosition.nx, y: cursorPosition.ny }}
                active={footerInView}
                mode="footer"
                className="h-full w-full"
              />
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/8 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>Designed as a premium portfolio for Govinda P B — Frontend Developer specializing in Angular & Ionic.</p>
          <p>Built with React, Tailwind CSS, GSAP, Lenis, Swiper, Framer Motion, and Three.js.</p>
        </div>
      </footer>

      <AnimatePresence>
        {selectedWork ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedWork(null)}
          >
            <motion.div
              className="relative w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/92 p-6 sm:p-8"
              initial={{ y: 32, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-90", selectedWork.accent)} />
              <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                <div>
                  <div className="text-xs uppercase tracking-[0.3em] text-slate-400">{selectedWork.category}</div>
                  <h3 className="mt-3 text-3xl font-semibold text-white">{selectedWork.title}</h3>
                  <p className="mt-5 text-base leading-8 text-slate-200">{selectedWork.description}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {selectedWork.tools.map((tool) => (
                      <span key={tool} className="rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-sm text-slate-100">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.6rem] border border-white/10 bg-slate-950/48 p-5 backdrop-blur-xl">
                  <div className="mb-4 text-xs uppercase tracking-[0.28em] text-slate-400">Preview board</div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {selectedWork.stats.map((item, index) => (
                      <div key={item} className="rounded-2xl border border-white/10 bg-white/6 p-4">
                        <div className="text-xs uppercase tracking-[0.28em] text-slate-500">Focus 0{index + 1}</div>
                        <div className="mt-2 text-lg font-semibold text-white">{item}</div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedWork(null)}
                    className="mt-5 inline-flex rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/12"
                  >
                    Close preview
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

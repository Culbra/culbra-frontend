import Reveal from "./Reveal";

const HIGHLIGHTS = [
  {
    title: "WEEKLY CHALLENGES",
    subtitle: "A NEW CHALLENGE. EVERY WEEK.",
    body: "From culture and knowledge to creativity, problem-solving and real-world intelligence, every week brings a new challenge designed to test what you know and what you can do.",
    accent: "#ee2e29",
  },
  {
    title: "WILDCARDS",
    subtitle: "EXPECT THE UNEXPECTED.",
    body: "Just when you think you've figured out the game, the Wildcard changes the energy. Pick a challenge, defend your position, beat the clock or face the unknown",
    accent: "#12a066",
  },
  {
    title: "CREATE & SUBMIT",
    subtitle: "YOUR IDEA. YOUR STAGE.",
    body: "Turn your ideas into content, submit your work and put your creativity in front of the CULBRA audience.",
    accent: "#fc8a0d",
  },
  {
    title: "GET DISCOVERED",
    subtitle: "YOUR MOMENT COULD BE NEXT.",
    body: "CULBRA is more than a competition. Your work can be seen, shared and celebrated through the CULBRA Showcase, putting your talent in front of an audience beyond the Arena.",
    accent: "#ee2e29",
  },
  {
    title: "AUDIENCE & VOTING",
    subtitle: "THE AUDIENCE HAS A SAY.",
    body: "Engage your audience, earn verified votes and let your supporters become part of your journey.",
    accent: "#12a066",
  },
  {
    title: "SCORE & PROGRESS",
    subtitle: "EVERY POINT MATTERS.",
    body: "Judges evaluate your performance, participation counts and your score determines your journey through the competition.",
    accent: "#fc8a0d",
  },
];

export default function ExpectSection() {
  return (
    <section id="expect" className="bg-white px-6 py-14 text-black sm:py-20 lg:px-16 dark:bg-[#0a0a0a] dark:text-white">
      <div className="mx-auto max-w-6xl">
        <Reveal className="text-left">
           <h2 className="mt-1 text-3xl font-extrabold sm:text-5xl">
          WELCOME TO THE ARENA
          </h2>

          <p className="text-sm font-semibold sm:text-base">
            Where every challenge tests something different — and every round gives you another chance to make your mark.
          </p>
          {/* <h2 className="mt-1 text-3xl font-extrabold sm:text-5xl">
            What To Expect
          </h2> */}
        </Reveal>

        <ul className="mt-10 grid gap-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12">
          {HIGHLIGHTS.map(({ title, subtitle, body, accent }, i) => (
            // On phones each card sticks near the top as you scroll, and the
            // next one slides up over it, so they stack like a deck. Each
            // card sticks a little lower than the one before so the edges
            // of earlier cards stay visible.
            <li
              key={title}
              className="max-sm:sticky max-sm:top-[var(--stack-top)]"
              style={
                { "--stack-top": `${6 + i * 0.75}rem` } as React.CSSProperties
              }
            >
              <Reveal delay={(i % 3) * 120} className="h-full">
                {/* The accent strip peeks out from behind the left edge. */}
                <div
                  className="h-full rounded-3xl"
                  style={{ backgroundColor: accent }}
                >
                  <div className="ml-2 flex h-full min-h-56 flex-col items-start justify-start rounded-3xl bg-[#181818] px-6 py-8 text-left text-white">
                    <h3
                      className={
                        subtitle
                          ? "text-sm font-normal tracking-wide sm:text-base"
                          : "text-xl font-extrabold sm:text-2xl"
                      }
                    >
                      {title}
                    </h3>
                    {subtitle && (
                      <p className="text-sm font-bold tracking-wide text-white sm:text-base">
                        {subtitle}
                      </p>
                    )}
                    <p
                      className={`text-sm leading-relaxed text-white/85 sm:text-base ${
                        subtitle ? "mt-5" : "mt-3"
                      }`}
                    >
                      {body}
                    </p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

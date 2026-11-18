import Reveal from "./Reveal";
import ChallengeCards from "./ChallengeCards";

export default function EnterArenaBanner() {
  return (
    <section
      id="enter"
      className="relative overflow-hidden bg-[#fc8a0d] px-6 lg:px-16"
    >
      {/* Brand pattern, tiled and blended into the yellow so it reads as a
          subtle texture behind the content. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-10 mix-blend-multiply"
        style={{
          backgroundImage: "url(/images/tribal-pattern.jpg)",
          backgroundSize: "380px",
          filter: "saturate(0.2) brightness(0.55)",
        }}
      />

      <div className="relative mx-auto grid max-w-6xl items-center md:grid-cols-2">
        <div className="pt-12 pb-2 text-left sm:py-16">
          <Reveal>
            <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-5xl">
              THE CHALLENGE
            </h2>
            <p className="mt-2 text-sm font-extrabold tracking-wide text-black sm:text-lg">
              EVERY CHALLENGE IS A CHANCE TO SHOW WHAT YOU’VE GOT.
            </p>
          </Reveal>
          <Reveal delay={150}>
            <p className="mt-5 max-w-xl text-sm font-medium leading-relaxed text-black/85 sm:text-base">
              CULBRA challenges you across culture, knowledge, creativity,
              problem-solving and real-world thinking, with new challenges
              designed to test not just what you know, but how you think,
              create, express and respond.
            </p>
          </Reveal>
        </div>

        <Reveal delay={200} className="pb-6 sm:py-12">
          <ChallengeCards />
        </Reveal>
      </div>
    </section>
  );
}

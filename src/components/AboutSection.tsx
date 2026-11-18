import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";

// Stacked order on phones and tablets: headline, image, body text, CTA.
// On desktop the image moves to its own right-hand column, spanning the
// headline row and the body/CTA row.
export default function AboutSection() {
  return (
    <section
      id="about"
      className="bg-white px-6 py-14 text-black sm:py-20 lg:px-16 dark:bg-[#0a0a0a] dark:text-white"
    >
      <div className="mx-auto grid max-w-6xl gap-y-8 lg:grid-cols-[1fr_30rem] lg:gap-x-12 lg:gap-y-8">
        <Reveal className="text-left lg:col-start-1 lg:row-start-1">
          <h2 className="text-2xl font-extrabold leading-[1.45] sm:text-4xl">
            MORE THAN
            <br />
            A COMPETITION
          </h2>
        </Reveal>

        <Reveal
          delay={150}
          className="w-full justify-self-center sm:max-w-lg lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:max-w-none lg:self-center lg:justify-self-end"
        >
          {/* A cut-out with a transparent background, shown whole (no box,
              no cropping) so the group stands straight on the page. */}
          <Image
            src="/images/about-group-v2.png"
            alt="Five young people in white and black CULBRA T-shirts styled with traditional Nigerian gele, caps, wrappers and lace, one holding a talking drum"
            width={1121}
            height={1403}
            sizes="(min-width: 1024px) 480px, (min-width: 640px) 512px, 100vw"
            className="h-auto w-full"
            style={{
              // The photo crops the outer two people at its left and right
              // edges, and the feet at the bottom. Fade those edges out so the
              // straight cut-offs melt into the page instead of showing.
              maskImage:
                "linear-gradient(to right, transparent 0%, #000 14%, #000 86%, transparent 100%), linear-gradient(to bottom, #000 82%, transparent 100%)",
              maskComposite: "intersect",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, #000 14%, #000 86%, transparent 100%), linear-gradient(to bottom, #000 82%, transparent 100%)",
              WebkitMaskComposite: "source-in",
            }}
          />
        </Reveal>

        <div className="text-left lg:col-start-1 lg:row-start-2">
          <Reveal>
            <p className="max-w-xl text-sm font-medium leading-relaxed text-black/80 sm:text-base dark:text-white/80">
              CULBRA is a hybrid cultural experience where Culture, Brains,
              Creativity and Impact come together in one dynamic world.
              Participants are challenged to think, create, express and solve,
              while audiences watch, engage and have a voice in the journey.
              Beyond the Arena, CULBRA creates a platform for talent discovery,
              cultural expression, ideas, visibility and meaningful
              participation giving young people a stage to make their mark,
              giving audiences something to experience, and giving brands an
              opportunity to connect with the next generation in a way that
              feels authentic, relevant and lasting.
            </p>
          </Reveal>

          <Reveal delay={150}>
            <Link
              href="/register"
              className="mx-auto mt-8 block w-full max-w-xs rounded-full bg-[#fc8a0d] px-6 py-3.5 text-center text-sm font-extrabold tracking-wide text-black uppercase shadow-xl shadow-black/10 transition-transform hover:scale-105 sm:text-lg lg:mx-0 lg:inline-block lg:w-auto lg:max-w-none lg:px-8 lg:py-4 lg:text-left"
            >
              Register Now
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

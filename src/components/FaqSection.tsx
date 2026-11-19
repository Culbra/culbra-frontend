"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";
import Reveal from "./Reveal";

// Each answer is a list of paragraphs.
const FAQS: { q: string; a: string[] }[] = [
  {
    q: "What is CULBRA?",
    a: [
      "CULBRA, which stands for Culture and Brains, is an eight-week youth impact competition designed to promote cultural values, intellectual excellence, integrity, and practical problem-solving in Nigeria.",
      "The competition challenges participants to demonstrate not only what they know, but also how they apply their knowledge, skills, creativity, and values to real-world problems and stand a chance to win from a 10 million Naira prize pool.",
    ],
  },
  {
    q: "What is CULBRA’s purpose?",
    a: [
      "CULBRA was created to rebuild the values that should define Nigerian society, at a time when cultural identity, integrity, and dignity are increasingly neglected. It aims to raise a generation that combines strong character with practical intelligence by promoting cultural values, critical thinking, practical skills, and entrepreneurship, and by showing that culture and intelligence must be reflected in people’s actions, not just discussed.",
    ],
  },
  {
    q: "What makes CULBRA different from other youth competitions?",
    a: [
      "CULBRA goes beyond conventional talent displays. Participants are challenged to demonstrate their abilities through practical tasks involving cultural values, social responsibility, economic problem-solving, entrepreneurship, technology, and communication, thereby sharing a part in impacting and building the nation.",
      "The competition focuses on both who participants are and what they can do for the nation.",
    ],
  },
  {
    q: "How long will CULBRA last?",
    a: [
      "CULBRA will run for eight weeks. The first seven weeks will form part of the competition programme, while the eighth and final week will be for the physical and final event session for finalists.",
      "Further details about the weekly activities and the final event will be communicated through official CULBRA channels.",
    ],
  },
  {
    q: "Is there a registration fee?",
    a: ["Yes, there is a very friendly registration fee."],
  },
  {
    q: "Why should I register for CULBRA?",
    a: [
      "You stand a chance to win from 5 million Naira, 2 million Naira, 1 million Naira, and/or from a 2 million Naira extra prize pool.",
    ],
  },
  {
    q: "How will participants be evaluated?",
    a: [
      "CULBRA is designed to assess participants through practical tasks connected to its cultural and intellectual pillars. Contestants will be assessed by a mix of public voting and judges’ votes.",
      "The official judging criteria, scoring system, assessment process, and any applicable rules will be published or communicated before the competition kickstarts.",
    ],
  },
  {
    q: "Can I participate if I am not an expert in every pillar?",
    a: [
      "You do not need to be an expert in any pillar. You just need to have zeal to pass a message that will drive development.",
    ],
  },
  {
    q: "Which types of organisations can sponsor CULBRA?",
    a: [
      "CULBRA is accepting partnerships across several categories of organisations whose work aligns with CULBRA’s objectives, creating and expanding value and impact by shaping cultural values, intelligence, integrity, and responsible citizenship.",
    ],
  },
  {
    q: "What will sponsors gain from partnering with CULBRA?",
    a: [
      "Depending on the partnership arrangement, sponsors will benefit from an audience pool of 100,000 participants. They will gain brand visibility, engagement with participants and audiences, product demonstrations, opportunities to showcase their solutions, and association with a youth-development initiative promoting positive social change. Specific benefits and deliverables will be agreed upon with each partner. Apply for partnership via the website.",
    ],
  },
  {
    q: "Can a company sponsor a specific competition challenge?",
    a: [
      "Yes. CULBRA’s proposed partnership structure includes opportunities for organisations to support specific challenges related to their areas of expertise.",
      "The scope of participation, resources required, and sponsorship terms would be agreed upon with the organisation.",
    ],
  },
  {
    q: "Can members of the public attend the final physical event?",
    a: ["Yes."],
  },
  {
    q: "What will participants be expected to do?",
    a: [
      "Participants will take part in tasks and challenges designed around CULBRA’s Culture and Brains pillars. These may require them to demonstrate practical problem-solving, critical thinking, creativity, communication, entrepreneurship, and responsible decision-making. The specific requirements for each task will be communicated per time to the participants.",
    ],
  },
  {
    q: "How can I support CULBRA if I am not a participant or sponsor?",
    a: [
      "You can support CULBRA by following its official channels, sharing announcements, encouraging eligible people to participate, engaging with its activities, and helping spread its message about cultural values, intelligence, integrity, and responsible citizenship. For other forms of support, contact the CULBRA business team for enquiry.",
    ],
  },
  {
    q: "Who can participate in CULBRA?",
    a: [
      "This edition of CULBRA is designed for Nigerians interested in demonstrating their cultural values, intelligence, creativity, and practical problem-solving abilities and taking the prize home.",
    ],
  },
];

function FaqItem({
  q,
  a,
  open,
  onToggle,
}: {
  q: string;
  a: string[];
  open: boolean;
  onToggle: () => void;
}) {
  const id = useId();

  return (
    <li className="border-b border-black/10 dark:border-white/10">
      <h3>
        <button
          type="button"
          id={`${id}-q`}
          aria-expanded={open}
          aria-controls={`${id}-a`}
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-6 py-5 text-left text-base font-bold transition-colors hover:text-[#fc8a0d] sm:py-6 sm:text-lg"
        >
          {q}
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
              open
                ? "rotate-45 border-[#fc8a0d] bg-[#fc8a0d] text-black"
                : "border-black/20 dark:border-white/20"
            }`}
            aria-hidden="true"
          >
            <Plus size={16} />
          </span>
        </button>
      </h3>
      <div
        id={`${id}-a`}
        role="region"
        aria-labelledby={`${id}-q`}
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out motion-reduce:transition-none ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden" inert={!open}>
          <div className="max-w-2xl space-y-3 pr-14 pb-6 text-sm leading-relaxed text-black/75 sm:text-base dark:text-white/75">
            {a.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </li>
  );
}

export default function FaqSection() {
  // One answer open at a time; the first starts open.
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="bg-white px-6 py-14 text-black sm:py-20 lg:px-16 dark:bg-[#0a0a0a] dark:text-white"
    >
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[20rem_1fr] lg:gap-16">
        <Reveal className="text-left lg:sticky lg:top-28 lg:self-start">
          <h2 className="text-3xl font-extrabold leading-tight sm:text-5xl">
            GOT
            <br />
            QUESTIONS?
          </h2>
          <p className="mt-3 text-sm font-semibold sm:text-base">
            EVERYTHING YOU NEED TO KNOW BEFORE YOU ENTER THE ARENA.
          </p>
        </Reveal>

        <Reveal delay={150}>
          <ul className="border-t border-black/10 dark:border-white/10">
            {FAQS.map(({ q, a }, i) => (
              <FaqItem
                key={q}
                q={q}
                a={a}
                open={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

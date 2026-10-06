import Image from "next/image";

export default function Logo() {
  return (
    <a href="#top" aria-label="Culbra home">
      <Image
        src="/images/logo-v2.png"
        alt="Culbra"
        width={1054}
        height={268}
        priority
        className="h-6 w-auto sm:h-11"
      />
    </a>
  );
}

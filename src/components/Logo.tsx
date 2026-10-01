import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src="/images/logo-v2.png"
      alt="Culbra"
      width={1054}
      height={268}
      priority
      className="h-12 w-auto sm:h-14"
    />
  );
}

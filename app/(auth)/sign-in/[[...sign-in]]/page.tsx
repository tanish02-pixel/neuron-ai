import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <SignIn
      appearance={{
        elements: {
          rootBox: "shadow-none",
          card: `
            bg-transparent
            shadow-none
            border border-zinc-800
            backdrop-blur-2xl
          `,
          footer: "bg-transparent",
          footerAction: "bg-transparent",
        },
      }}
    />
  );
}
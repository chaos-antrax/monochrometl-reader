import Link from "next/link";

interface ButtonProps {
  href?: string;
  type?: "minimal" | "block";
  className?: string;
  children: React.ReactNode;
}

const Button = ({ href, type, children, className }: ButtonProps) => {
  return type === "block" ? (
    <Link
      href={href || "#"}
      className={`${className} border border-white/7 py-2 font-inter text-xs px-8`}
    >
      {children}
    </Link>
  ) : (
    <Link href={href || "#"} className={`${className}`}>
      {children}
    </Link>
  );
};

export default Button;

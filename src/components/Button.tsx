import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  btnType?: "minimal" | "block";
  className?: string;
  children: React.ReactNode;
}

const Button = ({
  href,
  btnType,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) => {
  const classNames =
    `${className} ${btnType === "block" ? "border border-white/7 py-2 font-inter text-xs px-8" : ""}`.trim();

  if (href && !disabled) {
    return (
      <Link href={href} className={classNames}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={`${classNames} cursor-pointer`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

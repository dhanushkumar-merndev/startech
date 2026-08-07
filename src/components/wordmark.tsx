type WordmarkProps = {
  className?: string;
  /** Renders for dark backgrounds. */
  invert?: boolean;
};

/**
 * The mark: a red four-point star set against the company name. The star
 * spins a quarter turn on hover of the enclosing link.
 */
export function Wordmark({ className = "", invert = false }: WordmarkProps) {
  return (
    <span className={`group/mark inline-flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className="size-[22px] shrink-0 text-brand transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/mark:rotate-90"
      >
        <path
          fill="currentColor"
          d="M12 0c.5 5.9 2.4 9.1 5.4 10.5 1.6.8 3.7 1.2 6.6 1.5-2.9.3-5 .7-6.6 1.5C14.4 14.9 12.5 18.1 12 24c-.5-5.9-2.4-9.1-5.4-10.5C5 12.7 2.9 12.3 0 12c2.9-.3 5-.7 6.6-1.5C9.6 9.1 11.5 5.9 12 0Z"
        />
      </svg>
      <span
        className={`font-display text-[1.0625rem] font-semibold leading-none tracking-[-0.045em] ${
          invert ? "text-white" : "text-ink"
        }`}
      >
        Star Tech
        <span className={invert ? "text-muted-dark" : "text-muted"}> India</span>
      </span>
    </span>
  );
}

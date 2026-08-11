/**
 * Forces the page subtree to remount on navigation.
 *
 * Layouts persist across routes, so React reconciles the incoming page against
 * the outgoing one — `/services` and `/about` both open with `<PageHero>`, so
 * it reuses that instance and never re-runs its effects. GSAP has meanwhile
 * replaced the heading's children with SplitText line wrappers that React does
 * not know about, leaving the new route showing stale, half-animated DOM until
 * a hard refresh. A template carries its own key, so the tree is rebuilt and
 * every useGSAP effect re-runs against the markup actually on screen.
 *
 * Templates only remount when their own segment changes, which is why the
 * dynamic routes underneath carry one of their own.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

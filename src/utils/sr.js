// ScrollReveal is intentionally disabled for the minimal rebrand —
// content renders immediately with no scroll-triggered animation.
// Keeping the same export shape so existing `sr.reveal(...)` calls are no-ops.
const sr = { reveal: () => {} };

export default sr;

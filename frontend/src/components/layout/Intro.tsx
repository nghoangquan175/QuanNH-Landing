const SEEN_KEY = "intro-seen";
// Both variants show the same words; only the motion and mood differ.
const NAME = "Nguyen Hoang Quan";
const ROLE = "full-stack developer";

/**
 * Runs before first paint (see layout.tsx). Decides whether the intro plays: once per
 * browser session, never with reduced motion, never without JS (the overlay only shows
 * under data-intro="play"). Interaction is locked by CSS while it plays.
 */
export const introInitScript = `(function(){var d=document.documentElement,seen=false;try{seen=sessionStorage.getItem("${SEEN_KEY}")==="1"}catch(e){}if(seen||matchMedia("(prefers-reduced-motion: reduce)").matches){d.dataset.intro="skip";return}d.dataset.intro="play";setTimeout(function(){d.dataset.intro="done";try{sessionStorage.setItem("${SEEN_KEY}","1")}catch(e){}},2600)})();`;

// Columns lift from the centre outwards: delay grows with distance from column 5.
const COLUMN_DELAYS = [4, 3, 2, 1, 0, 1, 2, 3, 4];

/** Opening overlay. Both variants are in the markup; CSS shows the one for the theme. */
export function Intro() {
  return (
    <div className="intro" aria-hidden="true">
      {/* Dark: the name typed out terminal-style, then the staircase columns lift away. */}
      <div className="intro-dark">
        <div className="intro-cols">
          {COLUMN_DELAYS.map((step, i) => (
            <span key={i} style={{ "--step": step } as React.CSSProperties} />
          ))}
        </div>
        <div className="intro-term">
          <p className="intro-term__name" style={{ "--chars": NAME.length } as React.CSSProperties}>
            <span>{NAME}</span>
          </p>
          <p className="intro-term__role" style={{ "--chars": ROLE.length } as React.CSSProperties}>
            <span>{ROLE}</span>
          </p>
        </div>
      </div>

      {/* Light: a violet bloom, the name drifting into focus, then an iris closes. */}
      <div className="intro-light">
        <div className="intro-orb" />
        <div className="intro-name">
          {NAME.split("").map((char, i) => (
            <span key={i} style={{ "--i": i } as React.CSSProperties}>
              {char === " " ? " " : char}
            </span>
          ))}
        </div>
        <p className="intro-role">{ROLE}</p>
      </div>
    </div>
  );
}

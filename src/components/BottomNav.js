import { useLocation } from "react-router-dom";
import { Ripple, initTE } from "tw-elements";

function BottomNav() {
  const getPreferredScheme = () =>
    window?.matchMedia?.("(prefers-color-scheme:dark)")?.matches
      ? "dark"
      : "light";
  const location = useLocation();

  initTE({ Ripple });
  return (
    <div className="btm-nav h-[2.5rem]">
      <a
        href={"/"}
        className={
          location.pathname === "/" ? `text-primary active` : `text-primary`
        }
      >
        <button
          className={
            location.pathname === "/" ? `text-primary active` : `text-primary`
          }
        >
          <svg viewBox="0 0 24 24" fill="currentColor" height="1em" width="1em">
            <path d="M12.97 2.59a1.5 1.5 0 00-1.94 0l-7.5 6.363A1.5 1.5 0 003 10.097V19.5A1.5 1.5 0 004.5 21h4.75a.75.75 0 00.75-.75V14h4v6.25c0 .414.336.75.75.75h4.75a1.5 1.5 0 001.5-1.5v-9.403a1.5 1.5 0 00-.53-1.144l-7.5-6.363z" />
          </svg>
        </button>
      </a>
      <a
        href={"/map"}
        className={
          location.pathname === "/map" ? `text-primary active` : `text-primary`
        }
      >
        <button
          className={
            location.pathname === "/map"
              ? `text-primary active`
              : `text-primary`
          }
        >
          <svg
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            viewBox="0 0 24 24"
            height="1em"
            width="1em"
          >
            <path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4zM8 2v16M16 6v16" />
          </svg>
        </button>
      </a>
      <a
        href={"/search"}
        className={
          location.pathname === "/search"
            ? `text-primary active`
            : `text-primary`
        }
      >
        <button
          className={
            location.pathname === "/search"
              ? `text-primary active`
              : `text-primary`
          }
        >
          <svg
            viewBox="0 0 788.5 1000"
            fill="currentColor"
            height="1em"
            width="1em"
          >
            <path d="M772 772c20 22.667 22 43.333 6 62l-46 46c-24 21.333-46.667 21.333-68 0L474 690c-49.333 28-101.333 42-156 42-85.333 0-159.667-31.667-223-95S0 499.333 0 414s30-158.333 90-219 132.667-91 218-91 160 31.667 224 95 96 137.667 96 223c0 58.667-15.333 112.667-46 162l190 188M94 414c0 58.667 22.667 110.667 68 156s97.333 68 156 68 109-21 151-63 63-93 63-153c0-58.667-22.667-110.333-68-155s-97.333-67-156-67-109 21-151 63-63 92.333-63 151" />
          </svg>
        </button>
      </a>
    </div>
  );
}

export default BottomNav;

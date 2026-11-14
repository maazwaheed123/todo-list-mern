export default function Onboarding({ onStart }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas p-0 md:p-8">
      <div className="flex min-h-screen w-full max-w-[520px] flex-col bg-white md:min-h-0 md:max-w-4xl md:flex-row md:overflow-hidden md:rounded-3xl md:shadow-card">
        <div className="relative h-[46vh] overflow-hidden bg-brand-500 md:h-auto md:w-1/2">
          <svg
            className="absolute inset-0 h-full w-full opacity-40"
            viewBox="0 0 200 400"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <circle cx="170" cy="40" r="70" fill="#ffffff" fillOpacity="0.12" />
            <circle cx="30" cy="330" r="90" fill="#ffffff" fillOpacity="0.08" />
            <path
              d="M10 90 l20 -16 20 16 20 -16 20 16 20 -16 20 16"
              stroke="#ffffff"
              strokeOpacity="0.5"
              strokeWidth="4"
              fill="none"
            />
            <path
              d="M10 110 l20 -16 20 16 20 -16 20 16 20 -16 20 16"
              stroke="#ffffff"
              strokeOpacity="0.35"
              strokeWidth="4"
              fill="none"
            />
            <path
              d="M80 300 l20 -16 20 16 20 -16 20 16 20 -16 20 16"
              stroke="#ffffff"
              strokeOpacity="0.4"
              strokeWidth="4"
              fill="none"
            />
            <path
              d="M80 320 l20 -16 20 16 20 -16 20 16 20 -16 20 16"
              stroke="#ffffff"
              strokeOpacity="0.25"
              strokeWidth="4"
              fill="none"
            />
          </svg>
        </div>

        <div className="flex flex-1 flex-col justify-between px-7 py-8 md:w-1/2 md:justify-center md:px-12">
          <div>
            <h1 className="text-2xl font-bold leading-snug text-ink-900 md:text-3xl">
              Manage What To Do
            </h1>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-500">
              The best way to manage the tasks you have to do, so you never forget your plans.
            </p>
          </div>

          <button type="button" onClick={onStart} className="btn-primary mt-10 w-full md:max-w-xs">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

from controllers.types import Works
from engine.drivers import DRIVERS
from resources.base import SYSTEM

AUTO = "work.auto"


def automatic(record) -> bool:
    from features import FEATURES
    return "work" in FEATURES and bool(FEATURES["work"].on(record, "auto"))


QUESTION_REFUSAL = "Auto mode is on. Decide and continue without a blocking question. If only the user can supply the answer, ask with journal question ask or journal todo ask, end any waiting work, and continue with the next ready row."


def refusal(provider, hook) -> str:
    return QUESTION_REFUSAL if provider.question(hook.tool) else ""


QUIET_FOR = 300.0
ASK_AGAIN = 300.0
STILL_THERE = "journal: you have been quiet for {minutes} minutes with work still open. Are you still working? Say where it stands, or carry on."


def still_there(record, quiet: float, state: str) -> str:
    if not automatic(record) or quiet < QUIET_FOR or state in ("idle", "stopped"):
        return ""
    waiting = [w for w in Works(record, actor=SYSTEM)._standing() if not w.parked]
    return STILL_THERE.format(minutes=int(quiet // 60)) if waiting else ""


def launch_args(record, provider: str, args: list[str]) -> list[str]:
    driver = DRIVERS.get(provider)
    return driver.launch_args(args, automatic(record)) if driver else args

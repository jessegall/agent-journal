from engine.drivers import DRIVERS


QUESTION_REFUSAL = "Auto mode is on. Decide and continue without a blocking question. If only the user can supply the answer, ask with journal question ask or journal todo ask, end any waiting work, and continue with the next ready row."


def refusal(provider, hook) -> str:
    return QUESTION_REFUSAL if provider.question(hook.tool) else ""


def launch_args(record, provider: str, args: list[str]) -> list[str]:
    from features.auto.feature import Auto
    driver = DRIVERS.get(provider)
    return driver.launch_args(args, Auto.on_for(record)) if driver else args

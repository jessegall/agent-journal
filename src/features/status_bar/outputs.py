from features.status_bar.runs import current_run
from providers.payload import Hook

OUTPUTS = "outputs"
KEPT_RUNS = 30
MOST_LINES = 60
MOST_CHARS = 4000


def capped(text: str) -> str:
    lines = text[:MOST_CHARS].splitlines()
    hidden = text.count("\n") + 1 - min(len(lines), MOST_LINES)
    kept = "\n".join(lines[:MOST_LINES])
    return f"{kept}\n… {hidden} more lines" if hidden > 0 else kept


def keep(record, row, hook: Hook) -> None:
    running, text = current_run(row), hook.tool.output.strip()
    if not running.at or not text:
        return
    with record.state(OUTPUTS, hook.session).changing() as held:
        held.update({str(running.at): capped(text)})
        for at in sorted(held, key=float)[:-KEPT_RUNS]:
            del held[at]


def outputs(record, session: str) -> dict:
    return record.state(OUTPUTS, session).all()

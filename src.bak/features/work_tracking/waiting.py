import re

WAIT_LOOP = re.compile(r"\b(?:until|while)\b[^;\n]*;?\s*do\b")
WAIT_ONLY = re.compile(r"(?:timeout\s+\S+(?:\s+sleep\s+\S+)?|sleep\s+\S+)")
WAIT_WAY = ('Say what you wait for with the await tag ([!await] or journal work await "..." --on <ids>) and stop; '
            "a message or a report wakes you.")


def only_waits(shell: str) -> bool:
    steps = [step.strip() for step in re.split(r"[;&|\n]+", WAIT_LOOP.sub(";", shell))]
    steps = [step for step in steps if step and step != "done"]
    return bool(steps) and all(WAIT_ONLY.fullmatch(step) for step in steps)

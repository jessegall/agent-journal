import re
import sys
from pathlib import Path

SOURCE = Path(__file__).resolve().parents[2] / "src" / "web" / "src"
MINIMUM = 1000
INTERVAL = re.compile(r"\b(?:const\s+\w*EVERY\w*\s*=|every:)\s*(\d[\d_]*)\b(?!\s*,\s*unit)")
# (file, milliseconds) pairs polled faster than a second, each with the reason it has to be.
ALLOWED = {
    ("chat/AgentScreen.vue", 400): "a live terminal screen, which has to follow what the agent types",
    ("sync/polled.js", 500): "the event poll while the agent works, one request shared by every open page",
}


def problems() -> list[str]:
    found = []
    for path in sorted(SOURCE.rglob("*")):
        if path.suffix not in (".js", ".vue", ".ts"):
            continue
        name = str(path.relative_to(SOURCE))
        for number, line in enumerate(path.read_text().splitlines(), 1):
            match = INTERVAL.search(line)
            milliseconds = int(match.group(1).replace("_", "")) if match else MINIMUM
            if milliseconds < MINIMUM and (name, milliseconds) not in ALLOWED:
                found.append(f"web/src/{name}:{number} polls every {milliseconds} ms; a poll under a second hurts a busy journal, so make it a second or slower or allow it in scripts/checks/polls.py with its reason")
    return found


if __name__ == "__main__":
    text = problems()
    print("\n".join(text) if text else "every viewer poll waits a second or more")
    sys.exit(1 if text else 0)

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HERE = ROOT / "src"
FUNNELS = {"engine/sessions.py", "engine/seats.py"}
FILES = re.compile(r"""["']s(?:ession|eat)\.json["']|\bseat_file\(""")
HOT = ("runner", "agents", "commands/dispatch.py", "commands/http.py")
HOT_PATTERNS = ("features/*/handlers.py", "features/*/routes.py")
SLOW = {
    "glob": re.compile(r"\.glob\("),
    "rglob": re.compile(r"\.rglob\("),
    "os.scandir": re.compile(r"\bos\.scandir\("),
    "os.listdir": re.compile(r"\bos\.listdir\("),
    "subprocess": re.compile(r"\bsubprocess\."),
    "git": re.compile(r"(?<![\w.])git\("),
    "resolve": re.compile(r"\.resolve\("),
}
# (file, call) pairs allowed on a hot path, each with the reason it is cheap or cannot be avoided.
ALLOWED = {
    ("runner/worker.py", "resolve"): "one import path, once at process start",
    ("runner/engines.py", "subprocess"): "the supervisor lists and spawns engine processes; it is not a request or a hook",
    ("runner/spool.py", "glob"): "the unsent-messages folder, scanned by the spool loop on its own thread",
    ("agents/seat.py", "git"): "the seat reads the branch of the checkout it sits in, on the terminal's own thread",
    ("agents/terminal.py", "subprocess"): "starting an agent process is the job",
    ("commands/http.py", "resolve"): "compares the root a request names with this server's, on the rare journals-list and switch routes",
    ("features/close_from_commits/handlers.py", "git"): "the commit hook reads the log it closes rows from",
    ("features/phone/routes.py", "resolve"): "the places route names the root once",
}


def hot_files() -> list[Path]:
    found = []
    for name in HOT:
        path = HERE / name
        found += sorted(path.rglob("*.py")) if path.is_dir() else [path]
    for pattern in HOT_PATTERNS:
        found += sorted(HERE.glob(pattern))
    return [path for path in found if path.name != "test.py"]


def problems() -> list[str]:
    text = []
    for path in sorted(HERE.rglob("*.py")):
        name = str(path.relative_to(HERE))
        if name in FUNNELS or path.name == "test.py" or "migrations" in path.parts or "node_modules" in path.parts:
            continue
        for n, line in enumerate(path.read_text().splitlines(), 1):
            if FILES.search(line):
                text.append(f"{name}:{n} reads a session or seat file outside engine/sessions.py and engine/seats.py; go through Sessions or the seat funnel")
    for path in hot_files():
        name = str(path.relative_to(HERE))
        for n, line in enumerate(path.read_text().splitlines(), 1):
            for call, pattern in SLOW.items():
                if pattern.search(line) and (name, call) not in ALLOWED:
                    text.append(f"{name}:{n} calls {call} on a hot path; cache it in a funnel or allow it in scripts/checks/hot_paths.py with its reason")
    return text


if __name__ == "__main__":
    found = problems()
    print("\n".join(found) or "session and seat files are read only by their funnels, and hot paths scan, spawn and resolve nothing outside the allow-list")
    sys.exit(1 if found else 0)

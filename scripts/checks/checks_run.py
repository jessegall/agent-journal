import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SCRIPTS = ROOT / "scripts" / "checks"
SECONDS = 60
LISTED = re.compile(r"^\s*(\d+)\s", re.M)
NAMED = re.compile(r"scripts/checks/(\w+)\.py")


def journal(*words: str) -> str:
    return subprocess.run(["journal", *words], capture_output=True, text=True, cwd=ROOT, timeout=SECONDS, check=True).stdout


def commands() -> dict[str, str]:
    rows = {}
    for number in LISTED.findall(journal("check", "all", "--last", "0")):
        shown = journal("check", "show", number)
        rows[number] = json.JSONDecoder().raw_decode(shown[shown.index("{"):])[0]["data"].get("command", "")
    return rows


def problems() -> list[str]:
    rows = commands()
    run = {name for command in rows.values() for name in NAMED.findall(command)}
    on_disk = {path.stem for path in SCRIPTS.glob("*.py") if path.name != "__init__.py"}
    found = [f"scripts/checks/{name}.py is run by no check; wire it with journal check create or delete it" for name in sorted(on_disk - run)]
    found += [f"check {number} runs scripts/checks/{name}.py, which is not there" for number, command in rows.items() for name in NAMED.findall(command) if name not in on_disk]
    return found


if __name__ == "__main__":
    text = problems()
    print("\n".join(text) if text else "every script in scripts/checks is run by a check, and every check names a script that is there")
    sys.exit(1 if text else 0)

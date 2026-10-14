import json
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class Choice:
    environment: str
    resume: str
    """The session to resume, or empty for a new conversation."""
    hooks_aside: bool


class Menu:
    """What journal claude asks before it launches, each with a default so Enter alone is the common case: the environment, whether to continue its last conversation, and whether the hooks run this time."""

    def __init__(self, root: Path, journal_py: Path, ask=input, say=print) -> None:
        self.root, self.journal_py, self.ask, self.say = root, journal_py, ask, say

    def environments(self) -> list[dict]:
        try:
            out = subprocess.run([sys.executable, str(self.journal_py), "environment", "json"], cwd=self.root, capture_output=True, text=True, timeout=30, env={"JOURNAL_ROOT": str(self.root), "PATH": "/usr/bin:/bin:/usr/local/bin"}).stdout
            return json.loads(out or "[]")
        except (OSError, ValueError, subprocess.TimeoutExpired):
            return []

    def choose(self, env: str = "", new: bool = False, aside: bool = False, yes: bool = False) -> Choice:
        rows = self.environments()
        chosen = env or (self._pick_environment(rows) if not yes else "main")
        last = next((row.get("last_session", "") for row in rows if row["name"] == chosen), "")
        resume = "" if new or not last else (last if yes else self._ask_resume(chosen, last))
        hooks_aside = aside or (False if yes else self._ask_hooks())
        return Choice(chosen, resume, hooks_aside)

    def _pick_environment(self, rows: list[dict]) -> str:
        if not rows:
            return "main"
        self.say(f"Environment in {self.root.name}:")
        for n, row in enumerate(rows, 1):
            self.say(f"  {n}) {row['name']}{'  (last used ' + row['last_used'] + ')' if row.get('last_used') else ''}")
        self.say("  or type a new name")
        answer = self.ask("> [1] ").strip()
        if not answer:
            return rows[0]["name"]
        if answer.isdigit() and 1 <= int(answer) <= len(rows):
            return rows[int(answer) - 1]["name"]
        return answer

    def _ask_resume(self, environment: str, last: str) -> str:
        answer = self.ask(f"Continue the last conversation in {environment}? [Y/n] ").strip().lower()
        return "" if answer.startswith("n") else last

    def _ask_hooks(self) -> bool:
        answer = self.ask("Run with the journal's hooks, or set them aside this time? [hooks/aside] ").strip().lower()
        return answer.startswith("a")

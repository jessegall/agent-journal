import json
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path

from supervisor.screen import GOOD, Screen


@dataclass(frozen=True)
class Choice:
    environment: str
    resume: str
    """The session to resume, or empty for a new conversation."""
    hooks_aside: bool


class Menu:
    """What journal claude asks before it launches, one question per screen, each with a default so Enter alone is the common case: the environment, whether to continue its last conversation, and whether the hooks run this time."""

    def __init__(self, root: Path, journal_py: Path, screen: Screen | None = None) -> None:
        self.root, self.journal_py = root, journal_py
        self.screen = screen or Screen()

    def environments(self) -> list[dict]:
        try:
            out = subprocess.run([sys.executable, str(self.journal_py), "environment", "json"], cwd=self.root, capture_output=True, text=True, timeout=30, env={"JOURNAL_ROOT": str(self.root), "PATH": "/usr/bin:/bin:/usr/local/bin"}).stdout
            return json.loads(out or "[]")
        except (OSError, ValueError, subprocess.TimeoutExpired):
            return []

    def choose(self, env: str = "", new: bool = False, aside: bool = False, yes: bool = False) -> Choice:
        rows = self.environments()
        chosen = env or ("main" if yes else self._pick_environment(rows))
        last = next((row.get("last_session", "") for row in rows if row["name"] == chosen), "")
        resume = "" if new or not last else (last if yes else self._ask_resume(chosen, last))
        hooks_aside = aside or (False if yes else self._ask_hooks())
        self._summary(chosen, resume, hooks_aside)
        return Choice(chosen, resume, hooks_aside)

    def _pick_environment(self, rows: list[dict]) -> str:
        if not rows:
            return "main"
        self.screen.head(self.root.name, "Which environment, which is one line of work with its own record?")
        for n, row in enumerate(rows, 1):
            self.screen.option(str(n), row["name"], f"last used {row['last_used']}" if row.get("last_used") else "never used", chosen=n == 1)
        self.screen.option("a name", "a new environment")
        answer = self.screen.ask("Environment", "1")
        if not answer:
            return rows[0]["name"]
        if answer.isdigit() and 1 <= int(answer) <= len(rows):
            return rows[int(answer) - 1]["name"]
        return answer

    def _ask_resume(self, environment: str, last: str) -> str:
        self.screen.head(self.root.name, f"{environment} has a conversation to continue.")
        self.screen.option("y", "Continue the last conversation", f"session {last[:8]}", chosen=True)
        self.screen.option("n", "Start a new conversation")
        answer = self.screen.ask("Continue?", "y").lower()
        return "" if answer.startswith("n") else last

    def _ask_hooks(self) -> bool:
        self.screen.head(self.root.name, "The journal's hooks tell the agent what to do at the moments that matter.")
        self.screen.option("h", "Run with the hooks", "the journal guides the agent", chosen=True)
        self.screen.option("a", "Set the hooks aside this time", "a plain session; the journal only watches")
        answer = self.screen.ask("Hooks?", "h").lower()
        return answer.startswith("a")

    def _summary(self, environment: str, resume: str, aside: bool) -> None:
        self.screen.head(self.root.name, "Starting.")
        self.screen.say(f"  {self.screen.paint(GOOD, '✓')} environment  {environment}")
        self.screen.say(f"  {self.screen.paint(GOOD, '✓')} conversation {'continued from ' + resume[:8] if resume else 'new'}")
        self.screen.say(f"  {self.screen.paint(GOOD, '✓')} hooks        {'set aside' if aside else 'on'}")
        self.screen.say(f"  {self.screen.paint(GOOD, '✓')} viewer       opens in your browser once the journal is up")
        self.screen.say()

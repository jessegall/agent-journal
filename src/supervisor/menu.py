import json
import subprocess
import sys
from pathlib import Path

from supervisor.choice import Choice
from supervisor.option import Option
from supervisor.remembered import Remembered
from supervisor.screen import Screen


class Menu:
    """What journal claude asks before it launches, one question at a time, the last answer as the default: the environment, whether to carry on its last conversation, whether the agent asks before each tool, and whether the hooks run this time."""

    def __init__(self, root: Path, journal_py: Path, screen: Screen | None = None) -> None:
        self.root, self.journal_py = root, journal_py
        self.screen = screen or Screen()
        self.remembered = Remembered(root)

    def environments(self) -> list[dict]:
        try:
            out = subprocess.run([sys.executable, str(self.journal_py), "environment", "json"], cwd=self.root, capture_output=True, text=True, timeout=30, env={"JOURNAL_ROOT": str(self.root), "PATH": "/usr/bin:/bin:/usr/local/bin"}).stdout
            return json.loads(out or "[]")
        except (OSError, ValueError, subprocess.TimeoutExpired):
            return []

    def choose(self, agent: str, env: str = "", new: bool = False, aside: bool = False, skip: bool = False, yes: bool = False) -> Choice:
        self.screen.banner(agent, str(self.root))
        rows, before = self.environments(), self.remembered.read()
        asking = not yes
        chosen = env or (self._environment(rows) if asking else "main")
        last = next((row.get("last_session", "") for row in rows if row["name"] == chosen), "")
        resume = "" if new or not last else (self._resume(agent, chosen, last) if asking else last)
        asking = asking and not resume
        """Carrying on takes last time's answers to the other questions, as the banner promised."""
        skip_prompts = skip or (self._prompts(agent, before.get("skip_prompts", False)) if asking else before.get("skip_prompts", False))
        hooks_aside = aside or (self._hooks(before.get("hooks_aside", False)) if asking else before.get("hooks_aside", False))
        self.remembered.write(skip_prompts=skip_prompts, hooks_aside=hooks_aside)
        choice = Choice(chosen, resume, hooks_aside, skip_prompts)
        self._summary(choice)
        return choice

    def _environment(self, rows: list[dict]) -> str:
        if not rows:
            return "main"
        options = [Option(row["name"], self._badges(row)) for row in rows] + [Option("A new environment")]
        picked = self.screen.pick("Which environment", ["An environment is one line of work with a record of its own."], options, 0)
        if picked < len(rows):
            return rows[picked]["name"]
        return self.screen.ask("Name:") or "main"

    @staticmethod
    def _badges(row: dict) -> tuple[str, ...]:
        badges = ("agent working",) if row.get("working") else ()
        return (*badges, f"last used {row['last_used']}") if row.get("last_used") else badges

    def _resume(self, agent: str, environment: str, last: str) -> str:
        notes = [f"An earlier {agent.capitalize()} session worked {environment}. Carrying on opens that conversation again,", "without asking the other questions."]
        picked = self.screen.pick("Carry on from the last session", notes, [Option("Yes, carry on", (last[:8],)), Option("No, start a new one")], 0)
        return last if picked == 0 else ""

    def _prompts(self, agent: str, skipped_before: bool) -> bool:
        notes = [f"{agent.capitalize()} then runs without stopping to ask before each tool call,", "so the journal can keep it working."]
        return self.screen.pick("Run without permission prompts", notes, [Option("Yes, skip them"), Option("No, ask me each time")], 0 if skipped_before else 1) == 0

    def _hooks(self, aside_before: bool) -> bool:
        notes = ["The journal's hooks tell the agent what to do at the moments that matter.", "Set aside, the agent runs plain and the journal only watches."]
        return self.screen.pick("Run with the journal's hooks", notes, [Option("Yes, with the hooks"), Option("No, set them aside this time")], 1 if aside_before else 0) == 1

    def _summary(self, choice: Choice) -> None:
        self.screen.summary([("environment", choice.environment), ("conversation", f"continued from {choice.resume[:8]}" if choice.resume else "new"),
                             ("prompts", "skipped" if choice.skip_prompts else "asked"), ("hooks", "set aside" if choice.hooks_aside else "on"),
                             ("viewer", "opens in your browser once the journal is up")])

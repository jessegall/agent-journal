import json
import subprocess
import sys
from pathlib import Path

from journal.launcher.choice import Choice
from journal.launcher.option import Option
from journal.launcher.other_hooks import OtherHooks
from journal.launcher.remembered import Remembered
from journal.launcher.screen import Screen


class Menu:
    """What journal claude asks before it launches, one question at a time, the last answer as the default: the environment, whether to carry on its last conversation, whether the agent asks before each tool, and whether the hooks that are not the journal's are set aside for the run."""

    def __init__(self, root: Path, journal_py: Path, screen: Screen | None = None) -> None:
        self.root, self.journal_py = root, journal_py
        self.screen = screen or Screen()
        self.remembered = Remembered(root)

    def environments(self) -> list[dict]:
        try:
            return json.loads(self.journal("environment", "json") or "[]")
        except ValueError:
            return []

    def journal(self, *argv: str) -> str:
        """Runs a command of the package and returns what it printed."""
        try:
            return subprocess.run([sys.executable, str(self.journal_py), *argv], cwd=self.root, capture_output=True, text=True, timeout=30, env={"JOURNAL_ROOT": str(self.root), "PATH": "/usr/bin:/bin:/usr/local/bin"}).stdout
        except (OSError, subprocess.TimeoutExpired):
            return ""

    def choose(self, agent: str, env: str = "", new: bool = False, aside: bool = False, skip: bool = False, yes: bool = False) -> Choice:
        self.screen.banner(agent, str(self.root))
        rows, before = self.environments(), self.remembered.read()
        asking = not yes
        chosen = env or (self._environment(agent, rows) if asking else "main")
        rows = self.environments() if chosen not in {row["name"] for row in rows} else rows
        last = next((row.get("last_sessions", {}).get(agent, "") for row in rows if row["name"] == chosen), "")
        resume = "" if new or not last else (self._resume(agent, chosen, last) if asking else last)
        asking = asking and not resume
        """Carrying on takes last time's answers to the other questions, as the banner promised."""
        skip_prompts = skip or (self._prompts(agent, before.get("skip_prompts", False)) if asking else before.get("skip_prompts", False))
        hooks_aside = aside or (self._hooks(OtherHooks(self.root, agent).others(), before.get("hooks_aside", False)) if asking else before.get("hooks_aside", False))
        self.remembered.write(skip_prompts=skip_prompts, hooks_aside=hooks_aside)
        choice = Choice(chosen, resume, hooks_aside, skip_prompts)
        self._summary(choice)
        return choice

    def _environment(self, agent: str, rows: list[dict]) -> str:
        """Enter picks the environment under the cursor; x deletes it after a confirmation, and the list is asked again."""
        options = [Option(row["name"], self._badges(row)) for row in rows] + [Option("A new environment", apart=True)]
        picked, key = self.screen.pick_or("Which environment", ["An environment is one line of work with a record of its own."], options, 0, ("x",))
        if key == "x" and picked < len(rows):
            self._delete(rows[picked])
            return self._environment(agent, self.environments())
        if picked < len(rows):
            return rows[picked]["name"]
        return self.screen.ask("Name:") or "main"

    def _delete(self, row: dict) -> None:
        if row.get("working"):
            self.screen.pick(f"{row['name']} has an agent working", ["Stop that agent first."], [Option("Back")], 0)
            return
        notes = ["Everything recorded in it goes with it: tasks, messages, plans, memory, the record. This cannot be undone."]
        if self.screen.pick(f"Delete {row['name']}?", notes, [Option("No, keep it"), Option("Yes, delete it")], 0) == 1:
            self.journal("environment", "delete", row["name"])

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

    def _hooks(self, others: list[Path], aside_before: bool) -> bool:
        found = [f"Found now, in {len(others)} file{'s' if len(others) != 1 else ''}:", *(f"  {path}" for path in others)] if others else ["None found in the settings right now."]
        notes = ["They might conflict with the journal's. Set aside, a copy is kept and they are put back when the journal ends.", *found]
        return self.screen.pick("Set aside your existing hooks?", notes, [Option("Yes, set them aside"), Option("No, keep them")], 0 if aside_before else 1) == 0

    def _summary(self, choice: Choice) -> None:
        self.screen.summary([("environment", choice.environment), ("conversation", f"continued from {choice.resume[:8]}" if choice.resume else "new"),
                             ("prompts", "skipped" if choice.skip_prompts else "asked"), ("other hooks", "set aside" if choice.hooks_aside else "kept"),
                             ("viewer", "opens in your browser once the journal is up")])

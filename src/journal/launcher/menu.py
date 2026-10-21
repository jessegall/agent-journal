import json
import subprocess
import sys
from pathlib import Path

from journal.support.worktree import Worktree
from journal.launcher.support.answers import Answers
from journal.launcher.support.choice import Choice
from journal.support.environment_row import EnvironmentRow
from journal.launcher.support.option import Option
from journal.launcher.support.foreign_hooks import ForeignHooks
from journal.launcher.support.launcher_memory import LauncherMemory
from journal.launcher.screen import Screen
from journal.providers.providers import Providers


class Menu:
    """What journal claude asks before it launches, one question at a time, the last answer as the default: the environment, whether to carry on its last conversation, whether the agent asks before each tool, and whether the hooks that are not the journal's are set aside for the run."""

    def __init__(self, root: Path, journal_py: Path, screen: Screen | None = None) -> None:
        self.root, self.journal_py = root, journal_py
        self.screen = screen or Screen()
        self.remembered = LauncherMemory(root)

    def environments(self) -> list[EnvironmentRow]:
        try:
            return [EnvironmentRow.from_json(row) for row in json.loads(self.journal("environment", "json") or "[]")]
        except ValueError:
            return []

    def journal(self, *argv: str) -> str:
        try:
            return subprocess.run([sys.executable, str(self.journal_py), *argv], cwd=self.root, capture_output=True, text=True, timeout=30, env={"JOURNAL_ROOT": str(self.root), "PATH": "/usr/bin:/bin:/usr/local/bin"}).stdout
        except (OSError, subprocess.TimeoutExpired):
            return ""

    def choose(self, agent: str, env: str = "", new: bool = False, aside: bool = False, skip: bool = False, yes: bool = False) -> Choice:
        self.screen.banner(agent, str(self.root))
        rows, before = self.environments(), self.remembered.read()
        asking = not yes
        chosen = env or (self._environment(agent, rows) if asking else "main")
        if chosen not in {row.name for row in rows}:
            self.journal("environment", "create", chosen)
            rows = self.environments()
        last = next((row.last_session(agent) for row in rows if row.name == chosen), "")
        resume = "" if new or not last else self._continuation(agent, chosen, last, asking)
        skip_prompts = skip or yes or self._prompts(agent)
        asking = asking and not resume
        hooks_aside = aside or (self._hooks(ForeignHooks(self.root, agent).others(), before.hooks_aside) if asking else before.hooks_aside)
        self.remembered.write(Answers(skip_prompts, hooks_aside))
        choice = Choice(chosen, resume, hooks_aside, skip_prompts)
        if not yes:
            self._trust_question(agent)
        self._summary(choice)
        return choice

    def _environment(self, agent: str, rows: list[EnvironmentRow]) -> str:
        options = [Option(row.name, (*row.badges(), *Worktree(self.root, row.name).badges())) for row in rows] + [Option("A new environment", apart=True)]
        picked, key = self.screen.pick_or("Which environment", ["An environment is one line of work with a record of its own."], options, 0, ("x",))
        if key == "x" and picked < len(rows):
            self._delete(rows[picked])
            return self._environment(agent, self.environments())
        if picked < len(rows):
            return rows[picked].name
        return self.screen.ask("Name:") or "main"

    def _delete(self, row: EnvironmentRow) -> None:
        if row.working:
            self.screen.pick(f"{row.name} has an agent working", ["Stop that agent first."], [Option("Back")], 0)
            return
        notes = ["Everything recorded in it goes with it: tasks, messages, plans, memory, the record. This cannot be undone."]
        if self.screen.pick(f"Delete {row.name}?", notes, [Option("No, keep it"), Option("Yes, delete it")], 0) == 1:
            self.journal("environment", "delete", row.name)

    def _continuation(self, agent: str, environment: str, last: str, asking: bool) -> str:
        return self._resume(agent, environment, last) if asking else last

    def _resume(self, agent: str, environment: str, last: str) -> str:
        notes = [f"An earlier {agent.capitalize()} session worked {environment}. Carrying on opens that conversation again,", "without asking the other questions."]
        picked = self.screen.pick("Carry on from the last session", notes, [Option("Yes, carry on", (last[:8],)), Option("No, start a new one")], 0)
        return last if picked == 0 else ""

    def _prompts(self, agent: str) -> bool:
        notes = [f"{agent.capitalize()} then runs without stopping to ask before each tool call,", "so the journal can keep it working."]
        return self.screen.pick("Run without permission prompts", notes, [Option("Yes, skip them"), Option("No, ask me each time")], 0) == 0

    def _hooks(self, others: list[Path], aside_before: bool) -> bool:
        files = f"{len(others)} file" + ("s" if len(others) != 1 else "")
        rows = [f"Found now, in {files}:", *(f"  {path}" for path in others)] if others else ["None found in the settings right now."]
        notes = ["They might conflict with the journal's. Set aside, a copy is kept and they are put back when the journal ends.", *rows]
        return self.screen.pick("Set aside your existing hooks?", notes, [Option("Yes, set them aside"), Option("No, keep them")], 0 if aside_before else 1) == 0

    def _trust_question(self, agent: str) -> None:
        if Providers().lookup(agent).hooks_trusted(self.root):
            return
        notes = [f"{agent.capitalize()} asks once to trust the hooks the journal wrote into this project. Choose Trust all and continue", f"when {agent.capitalize()} asks, or the journal cannot follow what {agent.capitalize()} does."]
        self.screen.pick(f"Trust the journal's hooks in {agent.capitalize()}", notes, [Option("Understood")], 0)

    def _summary(self, choice: Choice) -> None:
        self.screen.summary([("environment", choice.environment), ("conversation", f"continued from {choice.resume[:8]}" if choice.resume else "new"),
                             ("prompts", "skipped" if choice.skip_prompts else "asked"), ("other hooks", "set aside" if choice.hooks_aside else "kept"),
                             ("viewer", "opens in your browser once the journal is up")])

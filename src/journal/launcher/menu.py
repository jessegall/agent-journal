import json
import subprocess
import sys
import time
from pathlib import Path
from typing import TypeVar

from journal.support.worktree import Worktree
from journal.launcher.support.answers import Answers
from journal.launcher.support.command_environment import CommandEnvironment
from journal.support.choice import Choice
from journal.support.environment_row import EnvironmentRow
from journal.support.past_session_row import PastSessionRow
from journal.launcher.support.option import Option
from journal.launcher.support.foreign_hooks import ForeignHooks
from journal.launcher.support.launcher_memory import LauncherMemory
from journal.launcher.support.menu_return import MenuReturn
from journal.launcher.support.environment_repick import EnvironmentRepick
from journal.launcher.support.menu_answers import MenuAnswers
from journal.launcher.support.menu_stage import MenuStage
from journal.launcher.screen import Screen
from journal.providers.providers import Providers

SESSIONS_SHOWN = 12
FILL_POLL_SECONDS = 0.3
# a launch the journal starts itself, as after a container start, may ask while the server still boots: it asks again this
# long before it takes "no environments" for an answer, so it never starts a fresh session only because it asked too early
LISTING_WAIT_SECONDS, LISTING_POLL_SECONDS = 300, 3
ListedRow = TypeVar("ListedRow", EnvironmentRow, PastSessionRow)


class Menu:
    """What journal claude asks before it launches, one question at a time, the last answer as the default: the environment, for a new one a past conversation of the project to continue from, whether to continue its last conversation, whether the agent asks before each tool, and whether the hooks that are not the journal's are set aside for the run. The left arrow asks again the last question that was asked, and each question is skipped where it does not apply."""

    def __init__(self, root: Path, journal_sh: Path, screen: Screen | None = None) -> None:
        self.root, self.journal_sh = root, journal_sh
        self.screen = screen or Screen()
        self.remembered = LauncherMemory(root)

    def environments(self) -> list[EnvironmentRow]:
        return self.listed(EnvironmentRow, "environment", "json")

    def listed(self, row_type: type[ListedRow], *argv: str) -> list[ListedRow]:
        try:
            return [row_type.parsed(row) for row in json.loads(self.journal(*argv) or "[]")]
        except ValueError:
            return []

    def journal(self, *argv: str) -> str:
        try:
            return subprocess.run(self.command(argv), cwd=self.root, capture_output=True, text=True, timeout=30, env=self.command_environment()).stdout
        except (OSError, subprocess.TimeoutExpired):
            return ""

    def command(self, argv: tuple[str, ...]) -> list[str]:
        return ["sh", str(self.journal_sh), *argv]

    def command_environment(self) -> CommandEnvironment:
        return CommandEnvironment(JOURNAL_ROOT=str(self.root), PATH=f"{Path(sys.executable).parent}:/usr/bin:/bin:/usr/local/bin")

    # every project has an environment, so an empty listing means the server did not answer yet, never that none exists
    def listed_environments(self) -> list[EnvironmentRow]:
        deadline = time.monotonic() + LISTING_WAIT_SECONDS
        rows = self.environments()
        while not rows and time.monotonic() < deadline:
            time.sleep(LISTING_POLL_SECONDS)
            rows = self.environments()
        return rows

    def environment_rows(self, name: str, rows: list) -> list:
        if name in {row.name for row in rows}:
            return rows
        self.journal("environment", "create", name)
        return self.environments()

    def choose(self, agent: str, environment: str = "", new: bool = False, stashed: bool = False, omit: bool = False, confirmed: bool = False) -> Choice:
        self.screen.banner(agent, str(self.root))
        choice = self.confirmed(agent, environment, new, stashed) if confirmed else self.menu_choice(agent, environment, new, stashed, omit)
        self.remembered.write(Answers(choice.prompt_flags, choice.stashed_hooks))
        self._summary(choice)
        return choice

    def confirmed(self, agent: str, environment: str, new: bool, stashed: bool) -> Choice:
        selection = environment or "main"
        rows = self.environment_rows(selection, self.listed_environments())
        last = next((row.last_session(agent) for row in rows if row.name == selection), "")
        return Choice(selection, "" if new else last, stashed or self.remembered.read().stashed_hooks, True)

    def menu_choice(self, agent: str, environment: str, new: bool, stashed: bool, omit: bool) -> Choice:
        answers = MenuAnswers(agent, environment, new, stashed, omit, self.environments(), self.remembered.read())
        steps = (self._environment_stage, self._session_stage, self._continuation_stage, self._takeover_stage, self._prompts_stage, self._hooks_stage, self._trust_stage)
        shown: list[int] = []
        index = 0
        while index < len(steps):
            try:
                stage = steps[index](answers)
            except MenuReturn:
                index = shown.pop() if shown else index
                continue
            except EnvironmentRepick:
                index, shown = 0, []
                continue
            answers = stage.answers
            shown += [index] if stage.is_shown else []
            index += 1
        return Choice(answers.selection, answers.resume, answers.stashed_hooks, answers.prompt_flags)

    def _environment_stage(self, answers: MenuAnswers) -> MenuStage:
        return answers.with_environment(self._environment)

    def _session_stage(self, answers: MenuAnswers) -> MenuStage:
        return answers.with_session(self.free_sessions, self._session_question)

    def _continuation_stage(self, answers: MenuAnswers) -> MenuStage:
        return answers.with_resume(self.environment_rows, self._resume)

    def _takeover_stage(self, answers: MenuAnswers) -> MenuStage:
        row = next((row for row in answers.rows if row.name == answers.selection), None)
        if row is None or not row.agent or answers.resume == row.agent_session:
            return MenuStage(answers, False)
        state = "at work" if row.working else "not at work"
        if self.screen.pick(f"{row.name} has an agent, {state}: {row.agent}", ["A new session takes it over, with its task and its record; the earlier session, if it still runs, is stopped."], [Option("Continue anyway"), Option("Pick another environment")], 0) == 1:
            raise EnvironmentRepick()
        return MenuStage(answers, True)

    def _prompts_stage(self, answers: MenuAnswers) -> MenuStage:
        return answers.with_prompts(self._prompts)

    def _hooks_stage(self, answers: MenuAnswers) -> MenuStage:
        return answers.with_hooks(self._foreign_hooks)

    def _trust_stage(self, answers: MenuAnswers) -> MenuStage:
        return MenuStage(answers, self._trust_question(answers.agent))

    def _foreign_hooks(self, agent: str, previous: bool) -> bool:
        return self._hooks(ForeignHooks(self.root, Providers().lookup(agent)).foreign(), previous)

    def _environment(self, agent: str, rows: list[EnvironmentRow]) -> str:
        options = [Option(row.name, (*row.badges(), *Worktree(self.root, row.name).badges())) for row in rows] + [Option("A new environment", separate=True)]
        selected, key = self.screen.choice("Which environment", ["An environment is one line of work with a record of its own."], options, 0, ("x",))
        if key == "x" and selected < len(rows):
            self._delete(rows[selected])
            return self._environment(agent, self.environments())
        if selected < len(rows):
            return rows[selected].name
        return self.screen.ask("Name:") or "main"

    def past_sessions(self) -> list[PastSessionRow]:
        return self.listed(PastSessionRow, "environment", "sessions")

    def free_sessions(self, agent: str) -> list[PastSessionRow]:
        return [session for session in self.past_sessions() if session.is_free() and session.provider == agent][:SESSIONS_SHOWN]

    def _session_question(self, name: str, sessions: list[PastSessionRow]) -> str:
        if self.screen.pick(f"Start {name} fresh or continue an earlier session?", [], [Option("Start fresh"), Option("Continue from an earlier session")], 0) == 0:
            return ""
        options = [Option(session.label(), session.badges()) for session in sessions]
        notes = ["Its chat is filled from the conversation you pick, and the agent carries it on.", "Conversations already in an environment are not listed."]
        session = sessions[self.screen.pick(f"Which earlier session does {name} continue?", notes, options, 0)]
        self.fill_chat(name, session)
        return session.session

    def fill_chat(self, name: str, session: PastSessionRow) -> None:
        creation = subprocess.Popen(self.command(("environment", "create", name, "--session", session.session, "--provider", session.provider)),
                                    cwd=self.root, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, env=self.command_environment())
        frame_number = 0
        while creation.poll() is None:
            percent = self.journal("environment", "filling", name).strip() or "0"
            self.screen.progress(frame_number, f"Filling {name}'s chat from the conversation: {percent}%")
            frame_number += 1
            time.sleep(FILL_POLL_SECONDS)
        self.screen.progress(frame_number, f"Filled {name}'s chat from the conversation.")

    def _delete(self, row: EnvironmentRow) -> None:
        if row.working:
            self.screen.pick(f"{row.name} has an agent working", ["Stop that agent first."], [Option("Back")], 0)
            return
        notes = ["Everything recorded in it goes with it: tasks, messages, plans, memory, the record. This cannot be undone.", *self.worktree_notes(row)]
        if self.screen.pick(f"Delete {row.name}?", notes, [Option("No, keep it"), Option("Yes, delete it")], 0) == 1:
            self.journal("environment", "delete", row.name)

    def worktree_notes(self, row: EnvironmentRow) -> list[str]:
        if not row.worktree:
            return []
        return [f"Its worktree folder and its branch stay; journal worktree remove {row.name} removes them once their work is done."]

    def _resume(self, agent: str, environment: str, last: str) -> str:
        notes = [f"An earlier {agent.capitalize()} session worked {environment}. Carrying on opens that conversation again,", "without asking the other questions."]
        selected = self.screen.pick("Carry on from the last session", notes, [Option("Yes, carry on", (last[:8],)), Option("No, start a new one")], 0)
        return last if selected == 0 else ""

    def _prompts(self, agent: str) -> bool:
        notes = [f"{agent.capitalize()} then runs without stopping to ask before each tool call,", "so the journal can keep it working."]
        return self.screen.pick("Run without permission prompts", notes, [Option("Yes, skip them"), Option("No, ask me each time")], 0) == 0

    def _hooks(self, peers: list[Path], stashed_prior: bool) -> bool:
        files = f"{len(peers)} file" + ("s" if len(peers) != 1 else "")
        rows = [f"Found now, in {files}:", *(f"  {path}" for path in peers)] if peers else ["None found in the settings right now."]
        notes = ["They might conflict with the journal's. Set aside, a copy is kept and they are put back when the journal ends.", *rows]
        return self.screen.pick("Set aside your existing hooks?", notes, [Option("Yes, set them aside"), Option("No, keep them")], 0 if stashed_prior else 1) == 0

    def _trust_question(self, agent: str) -> bool:
        if not Providers().lookup(agent).hooks_ready(self.root).needs_trust():
            return False
        notes = [f"{agent.capitalize()} asks once to trust the hooks the journal wrote into this project. Choose Trust all and continue", f"when {agent.capitalize()} asks, or the journal cannot follow what {agent.capitalize()} does."]
        self.screen.pick(f"Trust the journal's hooks in {agent.capitalize()}", notes, [Option("Understood")], 0)
        return True

    def _summary(self, choice: Choice) -> None:
        self.screen.summary([("environment", choice.environment), ("conversation", f"continued from {choice.resume[:8]}" if choice.resume else "new"),
                             ("prompts", "skipped" if choice.prompt_flags else "asked"), ("other hooks", "set aside" if choice.stashed_hooks else "kept"),
                             ("viewer", "opens in your browser once the journal is up")])

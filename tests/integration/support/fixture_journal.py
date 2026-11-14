import shlex
from datetime import timedelta
from dataclasses import dataclass, field
from typing import TypeVar, cast
from collections.abc import Generator
from contextlib import contextmanager
import io
import sqlite3

from engine.actor.actor import Actor
from engine.container.container import Container
from engine.database.repeated_work import RepeatedWork
from engine.driver.hook_reply import HookReply
from engine.enums.actor_type import ActorType
from engine.journal.journal_home import JournalHome
from engine.listener.commit.commit_listener_runner import CommitListenerRunner
from engine.query.queries import Queries
from engine.caller.process_row import ProcessRow
from engine.caller.process_table import ProcessTable
from engine.testing.fakes.fixed_process_table import FixedProcessTable
from engine.module.module_finder import ModuleFinder
from engine.cli.module_sync_line import SYNC_ARGV, ModuleSyncLine
from engine.file.file_access import FileAccess
from engine.command.bus import Bus
from engine.command.command import Command
from engine.testing.expectations.text_match import ExpectedText, contains_line, contains_text
from core.modules.settings.support.setting_catalogue import SettingCatalogue
from core.modules.settings.support.setting_reader import SettingReader
from engine.setting.errors.setting_type_error import SettingTypeError
from core.modules.agents.commands.end_agent.end_agent import EndAgent
from core.modules.agents.models.agent import Agent
from engine.testing.stories.kit_rows import KitRows
from core.modules.skills.support.skill_catalogue import SkillCatalogue
from core.modules.skills.support.unread_skills import UnreadSkills
from engine.enums.command_category import CommandCategory
from engine.enums.tool_type import ToolType
from engine.testing.examples.shell_part import ShellPart
from engine.testing.examples.hook_sample import HookSample
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.fakes.manual_clock import ManualClock
from tests.integration.support.integration_journal import MAIN_ENVIRONMENT, IntegrationJournal

R = TypeVar("R")


@dataclass(frozen=True)
class FixtureLine:
    """What one line printed, checked the way a moved story checks it."""

    code: int
    output_text: str

    def expect_text(self, *texts: ExpectedText) -> None:
        assert all(contains_text(self.output_text, text) for text in texts), self.output_text

    def expect_no_text(self, text: str) -> None:
        assert text not in self.output_text, self.output_text


@dataclass
class FixtureJournal(KitRows):
    """An integration journal copied from a story fixture's template, with the agent, user and helper that fixture made, so a
    mechanical story moved to tests/integration starts from the same state. A person's line runs in the main
    environment and an agent's in its own, as in a story."""

    journal: IntegrationJournal
    clock: ManualClock
    replacements: dict[type, object]
    agent: Actor = field(default_factory=Actor.core)
    user: Actor = field(default_factory=Actor.core)
    helper: Actor = field(default_factory=Actor.core)
    # the environment a moved story named: each line names it, as the story kit's scope_line does
    environment: str | None = None
    # the steps a moved story's helpers note, kept as the story kit keeps them; no overlap check reads them here
    steps: list[str] = field(default_factory=list)

    @property
    def home(self) -> JournalHome:
        return self.journal.home

    @property
    def container(self) -> Container:
        return self.journal.container

    def run(self, line: str, actor: Actor | None = None, environment_id: int | None = None) -> FixtureLine:
        caller_environment = environment_id or (None if actor is not None and actor.type is ActorType.AGENT else MAIN_ENVIRONMENT)
        if self.environment is not None and "--environment" not in shlex.split(line):
            line = f"{line} --environment {shlex.quote(self.environment)}"
        if "environment make" in line:
            caller_environment = None
        with self.journal.database.repeated_work.request():
            answer = self.journal.run(line, actor, caller_environment)
        return FixtureLine(answer.code, answer.text)

    def advance(self, duration: timedelta) -> None:
        self.clock.advance(duration)

    def new_row_id(self, line: str, actor: Actor | None = None) -> int:
        return self.journal.new_row_id(line, actor)

    def hook(self, session: str, sample: HookSample) -> HookReply:
        return self.journal.hook(session, sample)

    @property
    def repeated_work(self) -> RepeatedWork:
        return cast(RepeatedWork, self.journal.database.repeated_work)

    # puts the instance in place of the type, and forgets what was already built on the old one, as a story does
    def replace(self, kind: type, instance: object) -> None:
        self.container.replace(kind, instance)

    # what an agent does after its session starts: it reads the overview and reads the file of each skill it must load,
    # through its program's Read tool, so the journal's own blocks and refusals lift as they do for a real agent
    # a stand-in for a part of the outside world, in this container and in every container later built from the home
    def bind(self, kind: type, instance: object) -> None:
        self.replacements[kind] = instance
        self.replace(kind, instance)

    def unbind(self, kind: type) -> None:
        self.replacements.pop(kind, None)
        self.container.replace(kind, self.container.constructed(kind))

    def expect_sync_success(self, module: str) -> None:
        self.journal.expect_sync_success(module)

    def expect_sync_refusal(self, module: str, text: str) -> None:
        self.journal.expect_sync_refusal(module, text)

    def reads_what_it_must(self, session: str) -> None:
        self.hook(session, HookSamples.shell("journal overview", ShellPart("journal", CommandCategory.JOURNAL, ["overview"], subcommand="overview")))
        self.run("overview", actor=self.agent)
        skills = {skill.folder: skill.path for skill in self.container.get(SkillCatalogue).skills()}
        for name in self.container.get(UnreadSkills).unread(self.agent.id):
            self.hook(session, HookSamples.sample("pre_tool_use", {"name": "Read", "category": ToolType.READ, "files": [skills[name]], "diff": None}))
        self.run_listeners()

    # a step a module offers for a part of the world no command makes, such as a run printing its output
    def step(self, name: str, *arguments: object) -> object:
        return self.journal.step(name, *arguments)

    def tick(self, session: str) -> HookReply:
        return self.hook(session, HookSamples.tick())

    def expect_no_text(self, line: str, *texts: ExpectedText, actor: Actor | None = None) -> None:
        answer = self.run(line, actor)
        assert not any(contains_text(answer.output_text, text) for text in texts), (line, answer)

    def row(self, model: type, row_id: int):
        return self.container.get(Queries).query(model).find(row_id)

    def run_listeners(self) -> None:
        self.container.get(CommitListenerRunner).run()

    def expect_success(self, line: str, *texts: ExpectedText, actor: Actor | None = None) -> FixtureLine:
        answer = self.run(line, actor)
        written = self.with_touched_rows(answer.output_text)
        assert answer.code == 0 and all(contains_text(written, text) for text in texts), (line, answer)
        return answer

    def expect_text(self, line: str, *texts: ExpectedText, actor: Actor | None = None) -> None:
        self.run(line, actor).expect_text(*texts)

    def expect_rows(self, *conditions: bool, detail: str = "") -> None:
        assert all(conditions), detail

    def expect_refusal(self, line: str, reason: ExpectedText, actor: Actor | None = None) -> None:
        answer = self.run(line, actor)
        assert answer.code == 1 and contains_text(answer.output_text, reason), (line, reason, answer)

    def run_command(self, command: Command[R], actor: Actor, environment_id: int | None = None) -> R:
        return self.container.get(Bus).run(command, actor, environment_id=environment_id)

    # the session end hook ends the agent as itself, with no journal line; its commit listeners run after it
    def end_session(self, agent: Actor) -> None:
        self.run_command(EndAgent(agent.id), agent, self.container.get(Queries).query(Agent).find(agent.id).environment_id)
        self.run_listeners()

    def expect_usage_error(self, line: str, actor: Actor | None = None) -> None:
        answer = self.run(line, actor)
        assert answer.code == 2, (line, answer)

    def expect_absent(self, line: str, *absent_lines: str, actor: Actor | None = None) -> None:
        answer = self.run(line, actor)
        printed = answer.output_text.splitlines()
        assert answer.code == 0 and not [absent for absent in absent_lines if absent in printed], (line, absent_lines, answer)

    def expect_hook_allowed(self, session: str, sample: HookSample, *expected_lines: ExpectedText) -> None:
        reply = self.hook(session, sample)
        missing = [line for line in expected_lines if not contains_line(reply.lines, line)]
        assert reply.refusal == "" and not missing, (sample.action, missing, reply)

    def expect_hook_refusal(self, session: str, sample: HookSample, reason: ExpectedText) -> None:
        reply = self.hook(session, sample)
        assert contains_text(reply.refusal, reason), (sample.action, reason, reply)

    def expect_hook_silent(self, session: str, sample: HookSample) -> None:
        reply = self.hook(session, sample)
        assert reply.refusal == "" and not reply.lines, (sample.action, reply)

    def expect_absent_hook_line(self, session: str, sample: HookSample, line: ExpectedText) -> None:
        reply = self.hook(session, sample)
        assert not contains_line(reply.lines, line), (sample.action, line, reply)

    def number_default(self, key: str) -> int:
        default = SettingReader.default(self.container.get(SettingCatalogue).value(key))
        if not isinstance(default, int) or isinstance(default, bool):
            raise SettingTypeError(f"{key} declares {default!r}, not a whole number")
        return default

    def use_fixture_environment(self, name: str | None) -> None:
        self.environment = name

    def use_processes(self, *rows: ProcessRow) -> None:
        self.replace(ProcessTable, FixedProcessTable(list(rows)))

    def rebuild(self, class_type: type, implementation: type | None = None) -> None:
        if CommitListenerRunner in self.container.instances:
            self.container.get(CommitListenerRunner).close()
        self.container.rebuild(class_type, implementation or class_type)

    def run_tick_handler(self, label: str) -> None:
        handler = next(handler for module in ModuleFinder(self.home).modules() for handler in module.tick_handlers if handler.label == label)
        with self.journal.database.repeated_work.request():
            handler.handler(self.container)

    @contextmanager
    def busy_database(self) -> Generator[None]:
        writer = sqlite3.connect(self.home.database, timeout=0, autocommit=True)
        try:
            writer.execute("BEGIN IMMEDIATE")
            yield
            writer.execute("ROLLBACK")
        finally:
            writer.close()

    def system_log_text(self) -> str:
        return FileAccess.read(self.home.system_log) if FileAccess.exists(self.home.system_log) else ""

    def synced(self) -> tuple[int, str]:
        stream = io.StringIO()
        code = self.container.get(ModuleSyncLine).run(list(SYNC_ARGV), stream)
        return code, stream.getvalue()

    def expect_ordered_lines(self, line: str, *texts: str, actor: Actor | None = None) -> None:
        answer = self.run(line, actor)
        places = [answer.output_text.find(text) for text in texts]
        assert answer.code == 0 and -1 not in places and places == sorted(places), (line, texts, answer)

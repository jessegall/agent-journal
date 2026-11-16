from engine.enums.actor_type import ActorType
from engine.module.module_finder import ModuleFinder
from engine.testing.stories.kit_rows import KitRows
from engine.environment.environment_names import EnvironmentNames
from engine.file.file_access import FileAccess
import io
import linecache
import json
import re
import shlex
import sys
from unittest.mock import patch
import sqlite3
from collections.abc import Generator
from contextlib import contextmanager
from dataclasses import asdict, replace
from uuid import uuid4
from typing import TypeVar, cast
from datetime import timedelta
from engine.actor.actor import Actor
from core.modules.agents.commands.end_agent.end_agent import EndAgent
from core.modules.agents.models.agent import Agent
from engine.sandbox.shell_sandbox import ShellSandbox
from engine.testing.stories.story_shell_sandbox import StoryShellSandbox
from engine.cli.console import Console
from engine.cli.module_sync_line import SYNC_ARGV, ModuleSyncLine
from engine.registry.registry import Registry
from engine.event.event_log import EventLog
from engine.caller.caller_request import CallerRequest
from engine.caller.process_table import ProcessTable
from engine.caller.process_row import ProcessRow
from engine.time.clock import Clock
from engine.container.container import Container
from engine.database.points import Points
from engine.module.performance_tools import PerformanceTools
from collections.abc import Callable
from engine.database.database import Database
from engine.database.statement import Statement
from engine.database.schema import Schema
from engine.driver.hook_event import HookEvent
from engine.driver.hook_reply import HookReply
from engine.driver.hook_route import HookRoute
from engine.command.script_policy import ScriptPolicy
from engine.module.journal_container import synced_container
from engine.listener.commit.commit_listener_runner import CommitListenerRunner
from engine.hosting.hosting import Hosting
from engine.journal.journal_home import JournalHome
from engine.model.model import Model
from core.modules import DEFAULT_MODULES
from core.modules.settings.support.setting_catalogue import SettingCatalogue
from core.modules.settings.support.setting_reader import SettingReader
from engine.setting.errors.setting_type_error import SettingTypeError
from engine.setting.setting_declaration import SettingDefault
from engine.module.module import Module
from engine.query.queries import Queries
from engine.log.refusal_log import RefusalLog
from engine.log.recorded_refusal import RecordedRefusal
from engine.caller.caller import Caller
from core.modules.helpers.support.helper_programs import HelperPrograms
from core.modules.overview.support.overview_first import OverviewFirst
from core.modules.helpers.testing.story_helper_programs import StoryHelperPrograms
from core.modules.skills.support.skill_requirement import SkillRequirement
from core.modules.skills.support.main_agent_skills import MainAgentSkills
from core.modules.plugins.support.login_path import LoginPath
from engine.database.repeated_work import RepeatedWork
from core.modules.plugins.testing.story_login_path import StoryLoginPath
from core.modules.skills.testing.story_main_agent_skills import StoryMainAgentSkills
from core.modules.overview.testing.story_overview_first import StoryOverviewFirst
from core.modules.skills.testing.story_skill_requirement import StorySkillRequirement
from core.modules.tasks.testing.story_task_brief_requirement import StoryTaskBriefRequirement
from core.modules.tasks.support.task_brief_requirement import TaskBriefRequirement
from engine.testing.examples.hook_sample import HookSample
from engine.testing.examples.hook_samples import SAMPLE_EVENT_ID, HookSamples
from engine.testing.fakes.manual_clock import ManualClock
from engine.testing.stories.story_journal import StoryJournal
from engine.testing.seeds.seed import Seed
from engine.testing.seeds.seeder import Seeder
from engine.testing.stories.story_path import StoryPath
from engine.testing.stories.story_state import StoryState
from engine.testing.fakes.fixed_process_table import FixedProcessTable
from engine.testing.expectations.line_outcome import LineOutcome
from engine.time.polled_wait import PolledWait
from engine.testing.expectations.expected_message import ExpectedMessage
from engine.testing.expectations.text_match import ExpectedText, contains_line, contains_text



M = TypeVar("M", bound=Model)
R = TypeVar("R")
S = TypeVar("S")

COMMITTING_JOURNAL = StoryJournal()


# how long a story's wake ask waits for a line, so a story never waits the 25 seconds a real ask does
AGENT_LINE_PAUSE_SECONDS = 0.2


class Story(KitRows[tuple[int, str]]):
    """One story on a journal of its template that rolls back at its end, the public entry a plugin's stories
    use: it loads the modules named, runs command lines as text through the same console, container and
    registry as a real run, moves its clock by hand, reads rows and refusals, and checks what came back. It
    fills a table with many made-up rows of a seed in one line, and reads the rows a story made itself,
    which are numbered one and up, apart from the seeded rows below them. It knows no model of the core."""

    def __init__(self, home: JournalHome, container: Container, clock: ManualClock, process_table: "FixedProcessTable", state: StoryState) -> None:
        self.home, self.container, self.clock, self.process_table = home, container, clock, process_table
        self.journal = COMMITTING_JOURNAL
        self.results: list[LineOutcome] = []
        self.failed_expectations: list[str] = []
        self.steps: list[str] = []
        self.path: list[str] = []
        self.checks: list[str] = []
        self.state = state
        self.environment: str | None = None
        self.fixture_environment: str | None = None
        self.environment_ids: dict[str, int] = {}
        self.replacements: dict[type, object] = {}

    @classmethod
    def opened(cls, home: JournalHome, state: StoryState) -> "Story":
        # what the story binds reaches every container built from its home, the server's and its background work's too
        replacements: dict[type, object] = {}
        home = replace(home, container_setup=story_stand_ins(home, replacements))
        clock, process_table = ManualClock(), FixedProcessTable([])
        story = cls(home, story_container(home, clock, process_table), clock, process_table, state)
        story.replacements = replacements
        story.container.get(Database).cuts_raise = True
        return story

    def attach_journal(self, journal: StoryJournal) -> None:
        self.journal = journal
        journal.defer_writes(self.container.get(Database))

    @property
    def agent(self) -> Actor:
        return self.state.agent

    @agent.setter
    def agent(self, agent: Actor) -> None:
        self.state = replace(self.state, agent=agent)

    @property
    def user(self) -> Actor:
        return self.state.user

    @user.setter
    def user(self, user: Actor) -> None:
        self.state = replace(self.state, user=user)

    @property
    def helper(self) -> Actor:
        return self.state.helper

    @helper.setter
    def helper(self, helper: Actor) -> None:
        self.state = replace(self.state, helper=helper)

    def close(self) -> None:
        self.container.get(Database).close()
        self.journal.discard_writes()

    # what was built on the old one is built again on the replacement, the listeners too; a sync keeps it
    def bind(self, class_type: type[S], replacement: S) -> None:
        self.replacements[class_type] = replacement
        self.replace(class_type, replacement)

    # lifts what bind put in place: the class is built anew as the journal builds it, here and in every later container
    def unbind(self, class_type: type) -> None:
        self.replacements.pop(class_type, None)
        self.replace(class_type, self.container.constructed(class_type))

    # as bind, for this container only: a sync builds its own
    def replace(self, class_type: type[S], replacement: S) -> None:
        self.release_listeners()
        self.container.replace(class_type, replacement)

    # builds the class anew in this container, as the implementation when one is named, with what was built on it;
    # a sync builds its own
    def rebuild(self, class_type: type[S], implementation: type[S] | None = None) -> None:
        self.release_listeners()
        self.container.rebuild(class_type, implementation or class_type)

    def release_listeners(self) -> None:
        if CommitListenerRunner in self.container.instances:
            self.container.get(CommitListenerRunner).close()

    def run(self, line: str, actor: Actor | None = None, environment_id: int | None = None, process_id: int | None = None) -> LineOutcome:
        stream = io.StringIO()
        line = self.scope_line(line)
        caller = Caller(actor or Actor.core(), environment_id or self.caller_environment_id(actor), process_id=process_id)
        self.steps.append(f"command {caller.actor.id} {environment_id}: {line}")
        with self.repeated_work.request():
            code = self.container.get(Console).run(shlex.split(line), caller, stream)
        self.path.append(StoryPath.command(caller.actor.id, shlex.split(line), code, stream.getvalue()))
        self.results.append(LineOutcome(line, code, stream.getvalue()))
        return self.results[-1]

    def seed(self, seed: type[Seed], count: int, **fixed: object) -> tuple[int, ...]:
        seeder = Seeder(self.container.get(Database), self.clock.timestamp().text, self.caller_environment_id(None))
        with seeder.filling():
            return seeder.seed(seed(), count, **fixed)

    # the session end hook ends the agent as itself, with no journal line, so no command list judges it; its commit
    # listeners run after it, as they do after a line
    def end_session(self, agent: Actor) -> None:
        self.steps.append(f"end session of agent {agent.id}")
        self.run_command(EndAgent(agent.id), agent, self.container.get(Queries).query(Agent).find(agent.id).environment_id)
        self.run_listeners()

    def expect_agent_group(self, helper_type: str, profile: str, group: str) -> None:
        self.checked(f"agent group of {helper_type} {profile}")
        registry = self.container.get(Registry)
        group_entry = registry.agent_group_book().group(registry.helper_type_book().find(helper_type), profile)
        self.expected(group_entry is not None and group_entry.key == group, f"{helper_type} with profile {profile} is in group {group_entry.key if group_entry else 'none'}, not {group}")

    def use_fixture_environment(self, name: str | None) -> None:
        self.fixture_environment = name

    def caller_environment_id(self, actor: Actor | None) -> int | None:
        if self.fixture_environment is None or Actor.given_agent(actor):
            return None
        if self.fixture_environment not in self.environment_ids:
            self.environment_ids[self.fixture_environment] = self.container.get(EnvironmentNames).environment_id(self.fixture_environment)
        return self.environment_ids[self.fixture_environment]

    def scope_line(self, line: str) -> str:
        if self.environment is None or "--environment" in shlex.split(line):
            return line
        return f"{line} --environment {shlex.quote(self.environment)}"

    def run_requested(self, line: str, request: CallerRequest) -> LineOutcome:
        stream = io.StringIO()
        self.steps.append(f"request {line}: {json.dumps(asdict(request), sort_keys=True)}")
        with self.repeated_work.request():
            code = self.container.get(Console).requested_run(shlex.split(line), request, stream)
        self.path.append(StoryPath.command(0, shlex.split(line), code, stream.getvalue()))
        self.results.append(LineOutcome(line, code, stream.getvalue()))
        return self.results[-1]

    def use_processes(self, *rows: ProcessRow) -> None:
        self.steps.append(f"process table {rows!r}")
        self.process_table.fixed_rows = list(rows)

    # The default a module declares for a setting, so a story counts from it and a new default breaks no story.
    def setting_default(self, key: str) -> SettingDefault:
        return SettingReader.default(self.container.get(SettingCatalogue).value(key))

    def number_default(self, key: str) -> int:
        default = self.setting_default(key)
        if not isinstance(default, int) or isinstance(default, bool):
            raise SettingTypeError(f"{key} declares {default!r}, not a whole number")
        return default

    def refusals(self) -> tuple[RecordedRefusal, ...]:
        return self.container.get(RefusalLog).page(1, 1000).rows

    def advance(self, duration: timedelta) -> None:
        self.steps.append(f"advance {duration}")
        self.path.append("advance")
        self.clock.advance(duration)

    def hook(self, session: str, sample: HookSample) -> HookReply:
        self.steps.append(f"hook {session}: {json.dumps(sample.body, sort_keys=True)}")
        milliseconds = int(self.clock.timestamp().value.timestamp() * 1000)
        event_id = f"story-{uuid4().hex}" if sample.event_id == SAMPLE_EVENT_ID else sample.event_id
        event = HookEvent.parsed(sample.with_fields(session=session, event_id=event_id, fired_at_ms=milliseconds).body)
        with self.repeated_work.request():
            reply = self.container.get(HookRoute).answer(event)
        self.path += StoryPath.hook(sample.action, reply)
        return reply

    @property
    def repeated_work(self) -> RepeatedWork:
        return cast(RepeatedWork, self.container.get(Database).repeated_work)

    def run_listeners(self) -> None:
        self.steps.append("listeners")
        with self.repeated_work.request():
            self.container.get(CommitListenerRunner).run()

    # a step a module offers stories, such as a run printing its output, asked for by the name the module gives it
    def step(self, name: str, *arguments: object) -> object:
        self.steps.append(f"step {name} {arguments!r}")
        with self.repeated_work.request():
            return ModuleFinder(self.home).story_step(name).run(self.container, *arguments)

    def run_tick_handler(self, label: str) -> None:
        handler = next(handler for module in ModuleFinder(self.home).modules() for handler in module.tick_handler_declarations() if handler.label == label)
        self.steps.append(f"tick handler {label}")
        with self.repeated_work.request():
            handler.handler(self.container)

    # one round of the server's ticker: the listeners of what was written, then the named tick handlers in order
    def run_ticker_round(self, *labels: str) -> None:
        self.steps.append(f"ticker round {', '.join(labels)}")
        with self.repeated_work.request():
            self.container.get(CommitListenerRunner).run()
        for label in labels:
            handler = next(handler for module in ModuleFinder(self.home).modules() for handler in module.tick_handler_declarations() if handler.label == label)
            with self.repeated_work.request():
                handler.handler(self.container)

    # a line a background part of the journal gives the agent comes a moment later: its text shows among the agent's lines in time
    def expect_agent_line_shown(self, agent_id: int, text: str, limit_seconds: float) -> None:
        self.checked("agent line in time")
        match = PolledWait(limit_seconds, AGENT_LINE_PAUSE_SECONDS).poll(lambda: text in self.run(f"agent-line list --agent {agent_id}").output_text)
        self.expected(match, f"no line of agent {agent_id} said {text!r} within {limit_seconds} seconds")

    def tick(self, session: str) -> HookReply:
        return self.hook(session, HookSamples.tick())

    # Holds the database's write lock from another connection, as a busy writer would, until the block ends.
    @contextmanager
    def busy_database(self) -> Generator[None]:
        self.steps.append("database held busy")
        writer = sqlite3.connect(self.home.database, timeout=0, autocommit=True)
        try:
            writer.execute("BEGIN IMMEDIATE")
            yield
            writer.execute("ROLLBACK")
        finally:
            writer.close()

    def tick_handler_points(self, tick_handler: Callable[[Container], object]) -> Points | None:
        tools = self.container.get(PerformanceTools)
        start = tools.begin()
        tick_handler(self.container)
        return tools.cost(start)

    def expect_hook_allowed(self, session: str, sample: HookSample, *expected_lines: ExpectedText) -> None:
        self.checked(f"hook {sample.action}")
        reply = self.hook(session, sample)
        self.expected(reply.refusal == "", f"the hook was refused: {reply.refusal}")
        missing = [line for line in expected_lines if not contains_line(reply.lines, line)]
        self.expected(not missing, f"the hook's lines {list(reply.lines)} hold none of {missing}")

    def expect_hook_agent_messages(self, session: str, sample: HookSample, *agent_messages: ExpectedMessage) -> HookReply:
        self.checked(f"hook {sample.action}")
        reply = self.hook(session, sample)
        informed = [*reply.lines, reply.refusal]
        missing = [agent_message.declaration.key for agent_message in agent_messages if not agent_message.matches_lines(informed)]
        self.expected(not missing, f"the hook told {informed}, without {missing}")
        return reply

    def expect_no_hook_agent_message(self, session: str, sample: HookSample, agent_message: ExpectedMessage) -> HookReply:
        self.checked(f"hook {sample.action}")
        reply = self.hook(session, sample)
        informed = [*reply.lines, reply.refusal]
        self.expected(not agent_message.matches_lines(informed), f"the hook told {agent_message.declaration.key}: {informed}")
        return reply

    def expect_ordered_hook_lines(self, session: str, sample: HookSample, *texts: str) -> None:
        self.checked(f"hook {sample.action}")
        reply = self.hook(session, sample)
        places = [next((place for place, line in enumerate(reply.lines) if text in line), -1) for text in texts]
        self.expected(-1 not in places and places == sorted(places), f"the hook's lines {list(reply.lines)} do not hold {list(texts)} in this order")

    def expect_hook_silent(self, session: str, sample: HookSample) -> None:
        self.checked(f"hook {sample.action}")
        reply = self.hook(session, sample)
        self.expected(reply.is_silent, f"the hook was answered: {reply}")

    def expect_absent_hook_line(self, session: str, sample: HookSample, line: ExpectedText) -> None:
        self.checked(f"hook {sample.action}")
        reply = self.hook(session, sample)
        self.expected(not contains_line(reply.lines, line), f"the hook's lines {list(reply.lines)} hold {line!r}")

    def expect_hook_refusal(self, session: str, sample: HookSample, reason: ExpectedText) -> None:
        self.checked(f"hook {sample.action}")
        reply = self.hook(session, sample)
        self.expected(contains_text(reply.refusal, reason), f"the hook's refusal {reply.refusal!r} does not say {reason!r}")

    # The line of the story's own test function that led to a check, through any helper it called, so two stories check
    # the same thing when they check it from the same line; a check made outside a test function keeps its subject.
    @staticmethod
    def story_line(subject: str) -> str:
        stack_entry = sys._getframe(2)
        while stack_entry is not None and not stack_entry.f_code.co_name.startswith("test_"):
            stack_entry = stack_entry.f_back
        if stack_entry is None:
            return subject
        return linecache.getline(stack_entry.f_code.co_filename, stack_entry.f_lineno).strip()

    # Keeps what a check reads, its numbers left out, so the overlap check can tell stories that check the same thing
    # from stories that check wholly different things.
    def checked(self, subject: str) -> None:
        self.checks.append(re.sub(r"\d+", "N", Story.story_line(subject)))

    def expected(self, passed: bool, message: str) -> None:
        if not passed:
            self.failed_expectations.append(message)

    def expect_success(self, line: str, *expected_lines: str, actor: Actor | None = None) -> None:
        if expected_lines:
            self.checked(line)
        outcome = self.run(line, actor)
        self.expected(outcome.code == 0, f"{line} gave {outcome.code}: {outcome.output_text}")
        lines = self.with_touched_rows(outcome.output_text).splitlines()
        for expected_line in expected_lines:
            self.expected(expected_line in lines, f"{line} printed no line {expected_line!r}:\n{outcome.output_text}")

    def expect_ordered_lines(self, line: str, *texts: str, actor: Actor | None = None) -> None:
        self.checked(line)
        outcome = self.run(line, actor)
        places = [outcome.output_text.find(text) for text in texts]
        self.expected(outcome.code == 0 and -1 not in places and places == sorted(places), f"{line} did not name {texts} in order: {outcome.output_text}")

    def expect_text(self, line: str, *texts: ExpectedText, actor: Actor | None = None) -> None:
        self.checked(line)
        outcome = self.run(line, actor)
        self.expected(outcome.code == 0, f"{line} gave {outcome.code}: {outcome.output_text}")
        output_text = self.with_touched_rows(outcome.output_text)
        missing = [text for text in texts if not contains_text(output_text, text)]
        self.expected(not missing, f"{line} printed none of {missing}:\n{outcome.output_text}")

    # What a person reads of an agent's stack on its card: the text of journal driver stack, never the machine's classes.
    def expect_stack(self, agent: Actor, *texts: ExpectedText) -> None:
        self.expect_text(f"driver stack {agent.id}", *texts, actor=self.user)

    # What a person reads of the open escalations: the text of journal escalation list.
    def expect_escalation(self, *texts: ExpectedText) -> None:
        self.expect_text("escalation list", *texts, actor=self.user)

    def expect_no_text(self, line: str, *texts: ExpectedText, actor: Actor | None = None) -> None:
        self.checked(line)
        outcome = self.run(line, actor)
        matching = [text for text in texts if contains_text(outcome.output_text, text)]
        self.expected(not matching, f"{line} printed {matching}:\n{outcome.output_text}")

    def expect_refusal(self, line: str, reason: ExpectedText, actor: Actor | None = None) -> None:
        self.checked(line)
        outcome = self.run(line, actor)
        self.expected(outcome.code == 1, f"{line} was not refused: {outcome.code} {outcome.output_text}")
        self.expected(contains_text(outcome.output_text, reason), f"{line} was refused, but not for {reason!r}: {outcome.output_text}")

    def expect_usage_error(self, line: str, actor: Actor | None = None) -> None:
        outcome = self.run(line, actor)
        self.expected(outcome.code == 2, f"{line} was no usage error: {outcome.code} {outcome.output_text}")

    def expect_absent(self, line: str, *absent_lines: str, actor: Actor | None = None) -> None:
        self.checked(line)
        outcome = self.run(line, actor)
        self.expected(outcome.code == 0, f"{line} gave {outcome.code}: {outcome.output_text}")
        for absent_line in absent_lines:
            self.expected(absent_line not in outcome.output_text.splitlines(), f"{line} printed {absent_line!r}:\n{outcome.output_text}")

    def expect_requested_success(self, line: str, request: CallerRequest, *expected_lines: str) -> None:
        self.checked(line)
        outcome = self.run_requested(line, request)
        self.expected(outcome.code == 0, f"{line} gave {outcome.code}: {outcome.output_text}")
        lines = self.with_touched_rows(outcome.output_text).splitlines()
        for expected_line in expected_lines:
            self.expected(expected_line in lines, f"{line} printed no line {expected_line!r}:\n{outcome.output_text}")

    def expect_requested_exit(self, line: str, request: CallerRequest, code: int, text: str) -> None:
        self.checked(line)
        outcome = self.run_requested(line, request)
        self.expected(outcome.code == code and contains_text(outcome.output_text, text), f"{line} did not exit {code} naming {text!r}: {outcome.code} {outcome.output_text}")

    def new_row_id(self, line: str, actor: Actor | None = None) -> int:
        outcome = self.run(f"{line} --json", actor)
        assert outcome.code == 0, f"{line} gave {outcome.code}: {outcome.output_text}"
        return int(json.loads(outcome.output_text.splitlines()[0])["id"])

    def report_context_percent(self, session: str, percent: int) -> None:
        FileAccess.mkdir(self.home.status_folder, parents=True, exist_ok=True)
        FileAccess.write(self.home.status_folder / f"{session}.json", json.dumps({"session_id": session, "context_window": {"used_percentage": percent}}))

    def expect_sync_refusal(self, module: str, text: str) -> None:
        registry_text = Registry.read(self.container.get(Database)).entries_text()
        code, output_text = self.synced_with(module)
        assert code != 0 and text in output_text, f"module sync with {module} gave {code}: {output_text}"
        assert Registry.read(self.container.get(Database)).entries_text() == registry_text, "a refused sync changed the registry"

    def expect_sync_success(self, module: str) -> None:
        code, output_text = self.synced_with(module)
        self.expected(code == 0, f"module sync with {module} gave {code}: {output_text}")

    def expect_default_module_sync_refusal(self, module: type[Module], text: str) -> None:
        with patch("core.modules.DEFAULT_MODULES", (*DEFAULT_MODULES, module)):
            code, output_text = self.synced()
        self.expected(code != 0 and text in output_text, f"module sync with the shipped {module.name} gave {code}: {output_text}")

    def expect_registered_window(self, name: str, text: str) -> None:
        windows = [window for window in Registry.read(self.container.get(Database)).windows if window.name == name]
        self.expected(windows and text in windows[0].unavailable_reason, f"window {name} is registered as {windows}")

    def expect_registered_inspectors(self, models: list[type[Model]]) -> None:
        registered = [inspector.declaration.model for inspector in Registry.read(self.container.get(Database)).inspectors]
        self.expected(registered == models, f"inspectors are registered for {registered}")

    def expect_registered_provider(self, name: str, module: str) -> None:
        providers = [provider for provider in Registry.read(self.container.get(Database)).providers if provider.name == name]
        self.expected([provider.module for provider in providers] == [module], f"agent program {name} is registered as {providers}")

    def expect_helper_type_extends(self, key: str, base: str) -> None:
        self.checked(f"helper type {key} extends {base}")
        book = Registry.read(self.container.get(Database)).helper_type_book()
        self.expected(book.extends(key, base), f"helper type {key} does not extend {base}: {book.find(key)}")

    def expect_unrelated_helper_types(self, key: str, base: str) -> None:
        self.checked(f"helper type {key} apart from {base}")
        book = Registry.read(self.container.get(Database)).helper_type_book()
        self.expected(not book.extends(key, base), f"helper type {key} extends {base}: {book.find(key)}")

    def expect_registered_helper_type(self, key: str, **fields: object) -> None:
        self.checked(f"registered helper type {key}")
        stored = self.registered_helper_types()
        registered = {name: stored[key].get(name) for name in fields} if key in stored else {}
        self.expected(registered == fields, f"helper type {key} is registered as {stored.get(key)}")

    def expect_helper_type_behaviours(self, key: str, **answers: bool) -> None:
        self.checked(f"behaviours of helper type {key}")
        behaviours = self.registered_helper_types().get(key, {}).get("behaviours", {})
        registered = {name: behaviours.get(name) for name in answers} if isinstance(behaviours, dict) else {}
        self.expected(registered == answers, f"helper type {key} has the behaviours {behaviours}")

    def expect_helper_type_field_absent(self, key: str, field: str) -> None:
        self.checked(f"helper type {key} without {field}")
        stored = self.registered_helper_types()
        self.expected(key in stored and field not in stored[key], f"helper type {key} is registered as {stored.get(key)}")

    def expect_suite_field_absent(self, name: str, field: str) -> None:
        self.checked(f"suite {name} without {field}")
        suites = {entry["name"]: entry for entry in json.loads(Registry.read(self.container.get(Database)).entries_text())["suites"]}
        self.expected(name in suites and field not in suites[name], f"suite {name} is registered as {suites.get(name)}")

    def registered_helper_types(self) -> dict[str, dict[str, object]]:
        entries = json.loads(Registry.read(self.container.get(Database)).entries_text())["helper_types"]
        return {entry["key"]: entry for entry in entries}

    def expect_logged_event(self, name: str) -> None:
        self.expected(self.container.get(EventLog).latest_event(name) is not None, f"no {name} event was logged")

    def rerun_migration(self, module: str, number: int) -> None:
        self.container.get(Schema).remove_migration_record(module, number)
        code, output_text = self.synced()
        self.expected(code == 0, f"module sync after forgetting {module} migration {number} gave {code}: {output_text}")

    def expect_sync_without(self, module: str) -> None:
        modules = json.loads(FileAccess.read(self.home.module_list))
        FileAccess.write(self.home.module_list, json.dumps([listed for listed in modules if listed != module]))
        code, output_text = self.synced()
        self.expected(code == 0, f"module sync without {module} gave {code}: {output_text}")

    def synced(self) -> tuple[int, str]:
        stream = io.StringIO()
        code = self.container.get(ModuleSyncLine).run(list(SYNC_ARGV), stream)
        if code == 0:
            self.container.get(Database).close()
            self.container = story_container(self.home, self.clock, self.process_table, self.journal)
        return code, stream.getvalue()

    def expect_rows(self, *checks: object, detail: object | None = None) -> None:
        self.checked("rows")
        self.expected(all(checks), f"a row check failed: {checks}" if detail is None else str(detail))


STORY_ACTOR_ID_OFFSET = 10000
STORY_ACTOR_OFFSET = Statement("INSERT OR IGNORE INTO actors (id, creator_id, type, name, created_at, updated_at)"
                               " VALUES (?, 1, 'agent', 'story actor id offset', '2026-01-01T00:00:00+00:00', '2026-01-01T00:00:00+00:00')", [STORY_ACTOR_ID_OFFSET])


def story_container(home: JournalHome, clock: ManualClock, process_table: "FixedProcessTable", journal: StoryJournal = COMMITTING_JOURNAL) -> Container:
    container = synced_container(home)
    container.get(Database).update(STORY_ACTOR_OFFSET)
    journal.defer_writes(container.get(Database))
    container.bind(ScriptPolicy, ScriptPolicy(guards_run=True, commit_limit_ms=None))
    container.bind(Clock, clock)
    container.bind(ProcessTable, process_table)
    container.bind(Hosting, Hosting.local())
    database = container.get(Database)
    database.repeated_work = RepeatedWork(database)
    return container


# the parts a story stands in for, so it is not about them: the sandbox, the overview and skills an agent must read
# first, the helper programs installed, the login path and the task brief requirement; a story's home names this step,
# so every container built from it during the story, a server's among them, gets the same
def story_stand_ins(home: JournalHome, replacements: dict[type, object]) -> Callable[[Container], None]:
    def bind(container: Container) -> None:
        container.bind(ShellSandbox, StoryShellSandbox(home))
        container.bind(OverviewFirst, StoryOverviewFirst())
        container.bind(HelperPrograms, StoryHelperPrograms())
        container.bind(SkillRequirement, StorySkillRequirement())
        container.bind(MainAgentSkills, StoryMainAgentSkills())
        container.bind(LoginPath, StoryLoginPath(home))
        container.bind(TaskBriefRequirement, StoryTaskBriefRequirement())
        for class_type, replacement in replacements.items():
            container.bind(class_type, replacement)
    return bind

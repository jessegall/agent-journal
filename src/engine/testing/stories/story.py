from engine.enums.actor_type import ActorType
from engine.environment.environment_names import EnvironmentNames
from engine.file.file_access import FileAccess
import io
import linecache
import json
import re
import shlex
import sys
from unittest.mock import patch
from dataclasses import asdict, replace
from uuid import uuid4
from typing import TypeVar, cast
from datetime import timedelta
from engine.actor.actor import Actor
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
from engine.database.database import Database
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
from engine.model.tables import Tables
from engine.subcommand.output import Output
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
from engine.testing.examples.hook_samples import SAMPLE_FIRING, HookSamples
from engine.testing.fakes.manual_clock import ManualClock
from engine.testing.stories.story_journal import StoryJournal
from engine.database.seed_tables import ID_COLUMN
from engine.query.conditions.minimum import Minimum
from engine.testing.seeds.seed import Seed
from engine.testing.seeds.seeder import Seeder
from engine.testing.stories.story_path import StoryPath
from engine.testing.stories.story_state import StoryState
from engine.testing.fakes.fixed_process_table import FixedProcessTable
from engine.testing.expectations.line_outcome import LineOutcome
from engine.testing.expectations.expected_nudge import ExpectedNudge
from engine.testing.expectations.text_match import ExpectedText, holds_line, holds_text

STORY_ROWS_REASON = "the story kit lists every row of a table for an assertion"


M = TypeVar("M", bound=Model)
S = TypeVar("S")

COMMITTING_JOURNAL = StoryJournal()
TOUCHED_LINE = re.compile(r"^(?:created|updated): (.+)$", re.MULTILINE)


class Story:
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
        self.fixture_environment_id: int | None = None
        self.replacements: dict[type, object] = {}

    @classmethod
    def opened(cls, home: JournalHome, state: StoryState) -> "Story":
        clock, process_table = ManualClock(), FixedProcessTable([])
        story = cls(home, story_container(home, clock, process_table), clock, process_table, state)
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

    def bind(self, class_type: type[S], replacement: S) -> None:
        self.replacements[class_type] = replacement
        self.container.bind(class_type, replacement)

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

    def story_rows(self, model: type[M], **values: object) -> tuple[M, ...]:
        return tuple(self.container.get(Queries).query(model).filter(**values).matching(Minimum(ID_COLUMN, 1)).every_row(STORY_ROWS_REASON))

    def use_fixture_environment(self, name: str | None) -> None:
        self.fixture_environment, self.fixture_environment_id = name, None

    def caller_environment_id(self, actor: Actor | None) -> int | None:
        if self.fixture_environment is None or (actor is not None and actor.type is ActorType.AGENT):
            return None
        if self.fixture_environment_id is None:
            self.fixture_environment_id = self.container.get(EnvironmentNames).environment_id(self.fixture_environment)
        return self.fixture_environment_id

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

    def row(self, model: type[M], row_id: int) -> M:
        return self.container.get(Queries).query(model).find(row_id)

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
        firing = f"story-{uuid4().hex}" if sample.firing == SAMPLE_FIRING else sample.firing
        event = HookEvent.parsed(sample.with_fields(session=session, firing=firing, fired_at_ms=milliseconds).body)
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

    def tick(self, session: str) -> HookReply:
        return self.hook(session, HookSamples.tick())

    def expect_hook_allowed(self, session: str, sample: HookSample, *expected_lines: ExpectedText) -> None:
        self.checked(f"hook {sample.action}")
        reply = self.hook(session, sample)
        self.expected(reply.refusal == "", f"the hook was refused: {reply.refusal}")
        missing = [line for line in expected_lines if not holds_line(reply.lines, line)]
        self.expected(not missing, f"the hook's lines {list(reply.lines)} hold none of {missing}")

    def expect_hook_nudges(self, session: str, sample: HookSample, *nudges: ExpectedNudge) -> HookReply:
        self.checked(f"hook {sample.action}")
        reply = self.hook(session, sample)
        told = [*reply.lines, reply.refusal]
        missing = [nudge.declaration.key for nudge in nudges if not nudge.is_in_any(told)]
        self.expected(not missing, f"the hook told {told}, without {missing}")
        return reply

    def expect_no_hook_nudge(self, session: str, sample: HookSample, nudge: ExpectedNudge) -> HookReply:
        self.checked(f"hook {sample.action}")
        reply = self.hook(session, sample)
        told = [*reply.lines, reply.refusal]
        self.expected(not nudge.is_in_any(told), f"the hook told {nudge.declaration.key}: {told}")
        return reply

    def expect_ordered_hook_lines(self, session: str, sample: HookSample, *texts: str) -> None:
        self.checked(f"hook {sample.action}")
        reply = self.hook(session, sample)
        places = [next((place for place, line in enumerate(reply.lines) if text in line), -1) for text in texts]
        self.expected(-1 not in places and places == sorted(places), f"the hook's lines {list(reply.lines)} do not hold {list(texts)} in this order")

    def expect_hook_silent(self, session: str, sample: HookSample) -> None:
        self.checked(f"hook {sample.action}")
        reply = self.hook(session, sample)
        self.expected(reply.refusal == "" and not reply.lines, f"the hook was answered: {reply}")

    def expect_absent_hook_line(self, session: str, sample: HookSample, line: ExpectedText) -> None:
        self.checked(f"hook {sample.action}")
        reply = self.hook(session, sample)
        self.expected(not holds_line(reply.lines, line), f"the hook's lines {list(reply.lines)} hold {line!r}")

    def expect_hook_refusal(self, session: str, sample: HookSample, reason: ExpectedText) -> None:
        self.checked(f"hook {sample.action}")
        reply = self.hook(session, sample)
        self.expected(holds_text(reply.refusal, reason), f"the hook's refusal {reply.refusal!r} does not say {reason!r}")

    # The line of the story's own test function that led to a check, through any helper it called, so two stories check
    # the same thing when they check it from the same line; a check made outside a test function keeps its subject.
    @staticmethod
    def story_line(subject: str) -> str:
        frame = sys._getframe(2)
        while frame is not None and not frame.f_code.co_name.startswith("test_"):
            frame = frame.f_back
        if frame is None:
            return subject
        return linecache.getline(frame.f_code.co_filename, frame.f_lineno).strip()

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
        lines = self.with_touched_rows(outcome).splitlines()
        for expected_line in expected_lines:
            self.expected(expected_line in lines, f"{line} printed no line {expected_line!r}:\n{outcome.output_text}")

    def with_touched_rows(self, outcome: LineOutcome) -> str:
        loaded_classes = (entry.model.loaded() for entry in self.container.get(Registry).models.values())
        models = {model.model_name: model for model in loaded_classes if issubclass(model, Model)}
        stream = io.StringIO()
        output = Output(self.container.get(Tables), False, stream)
        for match in TOUCHED_LINE.finditer(outcome.output_text):
            for model_name, row_id in (name.split(":") for name in match[1].split(", ")):
                for row in self.container.get(Queries).query(models[model_name]).filter(id=int(row_id)).get() if model_name in models else ():
                    output.row(row)
        return outcome.output_text + stream.getvalue()

    def expect_ordered_lines(self, line: str, *texts: str, actor: Actor | None = None) -> None:
        self.checked(line)
        outcome = self.run(line, actor)
        places = [outcome.output_text.find(text) for text in texts]
        self.expected(outcome.code == 0 and -1 not in places and places == sorted(places), f"{line} did not name {texts} in order: {outcome.output_text}")

    def expect_text(self, line: str, *texts: ExpectedText, actor: Actor | None = None) -> None:
        self.checked(line)
        outcome = self.run(line, actor)
        self.expected(outcome.code == 0, f"{line} gave {outcome.code}: {outcome.output_text}")
        output_text = self.with_touched_rows(outcome)
        missing = [text for text in texts if not holds_text(output_text, text)]
        self.expected(not missing, f"{line} printed none of {missing}:\n{outcome.output_text}")

    def expect_no_text(self, line: str, *texts: ExpectedText, actor: Actor | None = None) -> None:
        self.checked(line)
        outcome = self.run(line, actor)
        matching = [text for text in texts if holds_text(outcome.output_text, text)]
        self.expected(not matching, f"{line} printed {matching}:\n{outcome.output_text}")

    def expect_refusal(self, line: str, reason: ExpectedText, actor: Actor | None = None) -> None:
        self.checked(line)
        outcome = self.run(line, actor)
        self.expected(outcome.code == 1, f"{line} was not refused: {outcome.code} {outcome.output_text}")
        self.expected(holds_text(outcome.output_text, reason), f"{line} was refused, but not for {reason!r}: {outcome.output_text}")

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
        lines = self.with_touched_rows(outcome).splitlines()
        for expected_line in expected_lines:
            self.expected(expected_line in lines, f"{line} printed no line {expected_line!r}:\n{outcome.output_text}")

    def expect_requested_exit(self, line: str, request: CallerRequest, code: int, text: str) -> None:
        self.checked(line)
        outcome = self.run_requested(line, request)
        self.expected(outcome.code == code and holds_text(outcome.output_text, text), f"{line} did not exit {code} naming {text!r}: {outcome.code} {outcome.output_text}")

    def new_row_id(self, line: str, actor: Actor | None = None) -> int:
        outcome = self.run(f"{line} --json", actor)
        assert outcome.code == 0, f"{line} gave {outcome.code}: {outcome.output_text}"
        return int(json.loads(outcome.output_text.splitlines()[0])["id"])

    def report_context_percent(self, session: str, percent: int) -> None:
        self.home.status_folder.mkdir(parents=True, exist_ok=True)
        FileAccess.shared().write(self.home.status_folder / f"{session}.json", json.dumps({"session_id": session, "context_window": {"used_percentage": percent}}))

    def system_log_text(self) -> str:
        return FileAccess.shared().read(self.home.system_log) if self.home.system_log.exists() else ""

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

    def expect_logged_event(self, name: str) -> None:
        self.expected(self.container.get(EventLog).latest_event(name) is not None, f"no {name} event was logged")

    def synced_with(self, module: str) -> tuple[int, str]:
        modules = json.loads(FileAccess.shared().read(self.home.module_list))
        FileAccess.shared().write(self.home.module_list, json.dumps([*modules, module]))
        return self.synced()

    def synced(self) -> tuple[int, str]:
        stream = io.StringIO()
        code = self.container.get(ModuleSyncLine).run(list(SYNC_ARGV), stream)
        if code == 0:
            self.container.get(Database).close()
            self.container = story_container(self.home, self.clock, self.process_table, self.journal)
            for class_type, replacement in self.replacements.items():
                self.container.bind(class_type, replacement)
        return code, stream.getvalue()

    def expect_rows(self, *checks: object, detail: str = "") -> None:
        self.checked("rows")
        self.expected(all(checks), detail or f"a row check failed: {checks}")


def story_container(home: JournalHome, clock: ManualClock, process_table: "FixedProcessTable", journal: StoryJournal = COMMITTING_JOURNAL) -> Container:
    container = synced_container(home)
    journal.defer_writes(container.get(Database))
    container.bind(ScriptPolicy, ScriptPolicy(guards_run=True, commit_limit_ms=None))
    container.bind(Clock, clock)
    container.bind(ProcessTable, process_table)
    container.bind(Hosting, Hosting.local())
    container.bind(ShellSandbox, StoryShellSandbox(home))
    container.bind(OverviewFirst, StoryOverviewFirst())
    container.bind(HelperPrograms, StoryHelperPrograms())
    container.bind(SkillRequirement, StorySkillRequirement())
    container.bind(MainAgentSkills, StoryMainAgentSkills())
    container.bind(LoginPath, StoryLoginPath(home))
    database = container.get(Database)
    database.repeated_work = RepeatedWork(database)
    container.bind(TaskBriefRequirement, StoryTaskBriefRequirement())
    return container

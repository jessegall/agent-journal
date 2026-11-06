from core.base.file_access import FileAccess
import io
import json
import re
import shlex
from dataclasses import asdict
from uuid import uuid4
from typing import TypeVar, cast
from datetime import timedelta
from core.base.actor import Actor
from core.base.shell_sandbox import ShellSandbox
from core.testing.story_shell_sandbox import StoryShellSandbox
from core.base.cli.console import Console
from core.base.cli.module_sync_line import SYNC_ARGV, ModuleSyncLine
from core.base.registry.registry import Registry
from core.base.change.event_log import EventLog
from core.base.caller.caller_request import CallerRequest
from core.base.caller.process_table import ProcessTable
from core.base.caller.process_row import ProcessRow
from core.base.clock import Clock
from core.base.container import Container
from core.base.database.database import Database
from core.base.driver.hook_event import HookEvent
from core.base.driver.hook_reply import HookReply
from core.base.driver.hook_route import HookRoute
from core.base.command.script_policy import ScriptPolicy
from core.base.journal_container import synced_container
from core.base.listener.commit_listener_runner import CommitListenerRunner
from core.base.journal_home import JournalHome
from core.base.model.model import Model
from core.base.model.tables import Tables
from core.base.subcommand.output import Output
from core.base.query.queries import Queries
from core.base.refusal_log import RefusalLog
from core.base.recorded_refusal import RecordedRefusal
from core.base.caller.caller import Caller
from core.modules.helpers.support.helper_programs import HelperPrograms
from core.modules.overview.support.overview_first import OverviewFirst
from core.testing.story_helper_programs import StoryHelperPrograms
from core.modules.skills.support.skill_requirement import SkillRequirement
from core.modules.skills.support.main_agent_skills import MainAgentSkills
from core.modules.plugins.support.login_path import LoginPath
from core.base.database.repeated_work import RepeatedWork
from core.testing.story_login_path import StoryLoginPath
from core.testing.story_main_agent_skills import StoryMainAgentSkills
from core.testing.story_overview_first import StoryOverviewFirst
from core.testing.story_skill_requirement import StorySkillRequirement
from core.testing.story_task_brief_requirement import StoryTaskBriefRequirement
from core.modules.tasks.support.task_brief_requirement import TaskBriefRequirement
from core.testing.hook_sample import HookSample
from core.testing.hook_samples import SAMPLE_FIRING, HookSamples
from core.testing.manual_clock import ManualClock
from core.testing.story_state import StoryState
from core.testing.fixed_process_table import FixedProcessTable
from core.testing.line_outcome import LineOutcome


M = TypeVar("M", bound=Model)

TOUCHED_LINE = re.compile(r"^(?:created|updated): (.+)$", re.MULTILINE)


class Story:
    """One story on its own copy of the template database, the public entry a plugin's stories use: it loads
    the modules named, runs command lines as text through the same console, container and registry as a real
    run, moves its clock by hand, reads rows and refusals, and checks what came back. It knows no model of the
    core."""

    def __init__(self, home: JournalHome, container: Container, clock: ManualClock, process_table: "FixedProcessTable", state: StoryState) -> None:
        self.home, self.container, self.clock, self.process_table = home, container, clock, process_table
        self.results: list[LineOutcome] = []
        self.steps: list[str] = []
        self.agent, self.user, self.helper = state.agent, state.user, state.helper

    @classmethod
    def opened(cls, home: JournalHome, state: StoryState) -> "Story":
        clock, process_table = ManualClock(), FixedProcessTable([])
        return cls(home, story_container(home, clock, process_table), clock, process_table, state)

    @property
    def state(self) -> StoryState:
        return StoryState(self.agent, self.user, self.helper)

    def close(self) -> None:
        self.container.get(Database).close()

    def run(self, line: str, actor: Actor | None = None, environment_id: int | None = None) -> LineOutcome:
        stream = io.StringIO()
        caller = Caller(actor or Actor.core(), environment_id)
        self.steps.append(f"command {caller.actor.id} {environment_id}: {line}")
        with self.repeated_work.request():
            code = self.container.get(Console).run(shlex.split(line), caller, stream)
        self.results.append(LineOutcome(line, code, stream.getvalue()))
        return self.results[-1]

    def run_requested(self, line: str, request: CallerRequest) -> LineOutcome:
        stream = io.StringIO()
        self.steps.append(f"request {line}: {json.dumps(asdict(request), sort_keys=True)}")
        with self.repeated_work.request():
            code = self.container.get(Console).requested_run(shlex.split(line), request, stream)
        self.results.append(LineOutcome(line, code, stream.getvalue()))
        return self.results[-1]

    def use_processes(self, *rows: ProcessRow) -> None:
        self.steps.append(f"process table {rows!r}")
        self.process_table.fixed_rows = list(rows)

    def row(self, model: type[M], row_id: int) -> M:
        return self.container.get(Queries).query(model).find(row_id)

    def refusals(self) -> tuple[RecordedRefusal, ...]:
        return self.container.get(RefusalLog).page(1, 1000).rows

    def advance(self, duration: timedelta) -> None:
        self.steps.append(f"advance {duration}")
        self.clock.advance(duration)

    def hook(self, session: str, sample: HookSample) -> HookReply:
        self.steps.append(f"hook {session}: {json.dumps(sample.body, sort_keys=True)}")
        milliseconds = int(self.clock.timestamp().value.timestamp() * 1000)
        firing = f"story-{uuid4().hex}" if sample.firing == SAMPLE_FIRING else sample.firing
        event = HookEvent.parsed(sample.with_fields(session=session, firing=firing, fired_at_ms=milliseconds).body)
        with self.repeated_work.request():
            return self.container.get(HookRoute).answer(event)

    @property
    def repeated_work(self) -> RepeatedWork:
        return cast(RepeatedWork, self.container.get(Database).tally)

    def run_listeners(self) -> None:
        self.steps.append("listeners")
        with self.repeated_work.request():
            self.container.get(CommitListenerRunner).run()

    def tick(self, session: str) -> HookReply:
        return self.hook(session, HookSamples.tick())

    def expect_hook_allowed(self, session: str, sample: HookSample, *expected_lines: str) -> None:
        reply = self.hook(session, sample)
        assert reply.refusal == "", f"the hook was refused: {reply.refusal}"
        missing = [line for line in expected_lines if not any(line in reply_line for reply_line in reply.lines)]
        assert not missing, f"the hook's lines {list(reply.lines)} hold none of {missing}"

    def expect_ordered_hook_lines(self, session: str, sample: HookSample, *texts: str) -> None:
        reply = self.hook(session, sample)
        places = [next((place for place, line in enumerate(reply.lines) if text in line), -1) for text in texts]
        assert -1 not in places and places == sorted(places), f"the hook's lines {list(reply.lines)} do not hold {list(texts)} in this order"

    def expect_hook_silent(self, session: str, sample: HookSample) -> None:
        reply = self.hook(session, sample)
        assert reply.refusal == "" and not reply.lines, f"the hook was answered: {reply}"

    def expect_absent_hook_line(self, session: str, sample: HookSample, line: str) -> None:
        reply = self.hook(session, sample)
        assert not any(line in reply_line for reply_line in reply.lines), f"the hook's lines {list(reply.lines)} hold {line!r}"

    def expect_hook_refusal(self, session: str, sample: HookSample, reason: str) -> None:
        reply = self.hook(session, sample)
        assert reason in reply.refusal, f"the hook's refusal {reply.refusal!r} does not say {reason!r}"

    def expect_success(self, line: str, *expected_lines: str, actor: Actor | None = None) -> None:
        outcome = self.run(line, actor)
        assert outcome.code == 0, f"{line} gave {outcome.code}: {outcome.output_text}"
        lines = self.with_touched_rows(outcome).splitlines()
        for expected_line in expected_lines:
            assert expected_line in lines, f"{line} printed no line {expected_line!r}:\n{outcome.output_text}"

    def with_touched_rows(self, outcome: LineOutcome) -> str:
        loaded_classes = (entry.model.loaded() for entry in self.container.get(Registry).models.values())
        models = {model.model_name: model for model in loaded_classes if issubclass(model, Model)}
        stream = io.StringIO()
        output = Output(self.container.get(Tables), False, stream)
        for match in TOUCHED_LINE.finditer(outcome.output_text):
            for model_name, row_id in (name.split(":") for name in match[1].split(", ")):
                for row in self.container.get(Queries).query(models[model_name]).filter(id=int(row_id)).all_rows() if model_name in models else ():
                    output.row(row)
        return outcome.output_text + stream.getvalue()

    def expect_ordered_lines(self, line: str, *texts: str, actor: Actor | None = None) -> None:
        outcome = self.run(line, actor)
        places = [outcome.output_text.find(text) for text in texts]
        assert outcome.code == 0 and -1 not in places and places == sorted(places), f"{line} did not name {texts} in order: {outcome.output_text}"

    def expect_text(self, line: str, *texts: str, actor: Actor | None = None) -> None:
        outcome = self.run(line, actor)
        assert outcome.code == 0, f"{line} gave {outcome.code}: {outcome.output_text}"
        output_text = self.with_touched_rows(outcome)
        missing = [text for text in texts if text not in output_text]
        assert not missing, f"{line} printed none of {missing}:\n{outcome.output_text}"

    def expect_no_text(self, line: str, *texts: str, actor: Actor | None = None) -> None:
        outcome = self.run(line, actor)
        matching = [text for text in texts if text in outcome.output_text]
        assert not matching, f"{line} printed {matching}:\n{outcome.output_text}"

    def expect_refusal(self, line: str, reason: str, actor: Actor | None = None) -> None:
        outcome = self.run(line, actor)
        assert outcome.code == 1, f"{line} was not refused: {outcome.code} {outcome.output_text}"
        assert reason in outcome.output_text, f"{line} was refused, but not for {reason!r}: {outcome.output_text}"

    def expect_usage_error(self, line: str, actor: Actor | None = None) -> None:
        outcome = self.run(line, actor)
        assert outcome.code == 2, f"{line} was no usage error: {outcome.code} {outcome.output_text}"

    def expect_absent(self, line: str, *absent_lines: str, actor: Actor | None = None) -> None:
        outcome = self.run(line, actor)
        assert outcome.code == 0, f"{line} gave {outcome.code}: {outcome.output_text}"
        for absent_line in absent_lines:
            assert absent_line not in outcome.output_text.splitlines(), f"{line} printed {absent_line!r}:\n{outcome.output_text}"

    def expect_requested_success(self, line: str, request: CallerRequest, *expected_lines: str) -> None:
        outcome = self.run_requested(line, request)
        assert outcome.code == 0, f"{line} gave {outcome.code}: {outcome.output_text}"
        lines = self.with_touched_rows(outcome).splitlines()
        for expected_line in expected_lines:
            assert expected_line in lines, f"{line} printed no line {expected_line!r}:\n{outcome.output_text}"

    def expect_requested_exit(self, line: str, request: CallerRequest, code: int, text: str) -> None:
        outcome = self.run_requested(line, request)
        assert outcome.code == code and text in outcome.output_text, f"{line} did not exit {code} naming {text!r}: {outcome.code} {outcome.output_text}"

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
        assert code == 0, f"module sync with {module} gave {code}: {output_text}"

    def expect_registered_window(self, name: str, text: str) -> None:
        windows = [window for window in Registry.read(self.container.get(Database)).windows if window.name == name]
        assert windows and text in windows[0].unavailable_reason, f"window {name} is registered as {windows}"

    def expect_registered_provider(self, name: str, module: str) -> None:
        providers = [provider for provider in Registry.read(self.container.get(Database)).providers if provider.name == name]
        assert [provider.module for provider in providers] == [module], f"agent program {name} is registered as {providers}"

    def expect_logged_event(self, name: str) -> None:
        names = [event.event for event in self.container.get(EventLog).events_past(0)]
        assert name in names, f"no {name} event among {names}"

    def synced_with(self, module: str) -> tuple[int, str]:
        modules = json.loads(FileAccess.shared().read(self.home.module_list))
        FileAccess.shared().write(self.home.module_list, json.dumps([*modules, module]))
        return self.synced()

    def synced(self) -> tuple[int, str]:
        stream = io.StringIO()
        code = self.container.get(ModuleSyncLine).run(list(SYNC_ARGV), stream)
        if code == 0:
            self.container.get(Database).close()
            self.container = story_container(self.home, self.clock, self.process_table)
        return code, stream.getvalue()

    def expect_rows(self, *checks: object, detail: str = "") -> None:
        assert all(checks), detail or f"a row check failed: {checks}"


def story_container(home: JournalHome, clock: ManualClock, process_table: "FixedProcessTable") -> Container:
    container = synced_container(home)
    container.bind(ScriptPolicy, ScriptPolicy(guards_run=True, commit_limit_ms=None))
    container.bind(Clock, clock)
    container.bind(ProcessTable, process_table)
    container.bind(ShellSandbox, StoryShellSandbox(home))
    container.bind(OverviewFirst, StoryOverviewFirst())
    container.bind(HelperPrograms, StoryHelperPrograms())
    container.bind(SkillRequirement, StorySkillRequirement())
    container.bind(MainAgentSkills, StoryMainAgentSkills())
    container.bind(LoginPath, StoryLoginPath(home))
    database = container.get(Database)
    database.tally = RepeatedWork(database)
    container.bind(TaskBriefRequirement, StoryTaskBriefRequirement())
    return container

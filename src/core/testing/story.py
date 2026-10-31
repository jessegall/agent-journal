import io
import json
import shlex
from uuid import uuid4
from typing import TypeVar
from datetime import timedelta
from core.base.actor import Actor
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
from core.base.journal_container import synced_container
from core.base.listener.commit_listener_runner import CommitListenerRunner
from core.base.journal_home import JournalHome
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.refusal_log import RefusalLog
from core.base.recorded_refusal import RecordedRefusal
from core.base.caller.caller import Caller
from core.testing.hook_sample import HookSample
from core.testing.hook_samples import SAMPLE_FIRING, HookSamples
from core.testing.manual_clock import ManualClock
from core.testing.story_state import StoryState
from core.testing.fixed_process_table import FixedProcessTable
from core.testing.line_outcome import LineOutcome


M = TypeVar("M", bound=Model)
class Story:
    """One story on its own copy of the template database, the public entry a plugin's stories use: it loads the
    modules named, runs command lines as text through the same console, container and registry as a real run,
    moves its clock by hand, reads rows and refusals, and checks what came back. It knows no model of the
    core."""

    def __init__(self, home: JournalHome, container: Container, clock: ManualClock, process_table: "FixedProcessTable", state: StoryState) -> None:
        self.home, self.container, self.clock, self.process_table = home, container, clock, process_table
        self.results: list[LineOutcome] = []
        self.agent, self.user, self.subagent = state.agent, state.user, state.subagent

    @classmethod
    def opened(cls, home: JournalHome, state: StoryState) -> "Story":
        clock, process_table = ManualClock(), FixedProcessTable([])
        return cls(home, story_container(home, clock, process_table), clock, process_table, state)

    @property
    def state(self) -> StoryState:
        return StoryState(self.agent, self.user, self.subagent)

    def close(self) -> None:
        self.container.get(Database).close()

    def run(self, line: str, actor: Actor | None = None, environment_id: int | None = None) -> LineOutcome:
        stream = io.StringIO()
        code = self.container.get(Console).run(shlex.split(line), Caller(actor or Actor.core(), environment_id), stream)
        self.results.append(LineOutcome(line, code, stream.getvalue()))
        return self.results[-1]

    def run_requested(self, line: str, request: CallerRequest) -> LineOutcome:
        stream = io.StringIO()
        code = self.container.get(Console).requested_run(shlex.split(line), request, stream)
        self.results.append(LineOutcome(line, code, stream.getvalue()))
        return self.results[-1]

    def use_processes(self, *rows: ProcessRow) -> None:
        self.process_table.fixed_rows = list(rows)

    def row(self, model: type[M], row_id: int) -> M:
        return self.container.get(Queries).query(model).find(row_id)

    def refusals(self) -> tuple[RecordedRefusal, ...]:
        return self.container.get(RefusalLog).page(1, 1000).rows

    def advance(self, duration: timedelta) -> None:
        self.clock.advance(duration)

    def hook(self, session: str, sample: HookSample) -> HookReply:
        milliseconds = int(self.clock.timestamp().value.timestamp() * 1000)
        firing = f"story-{uuid4().hex}" if sample.firing == SAMPLE_FIRING else sample.firing
        event = HookEvent.parsed(sample.with_fields(session=session, firing=firing, fired_at_ms=milliseconds).body)
        return self.container.get(HookRoute).answer(event)

    def run_listeners(self) -> None:
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
        for expected_line in expected_lines:
            assert expected_line in outcome.output_text.splitlines(), f"{line} printed no line {expected_line!r}:\n{outcome.output_text}"

    def expect_text(self, line: str, *texts: str, actor: Actor | None = None) -> None:
        outcome = self.run(line, actor)
        assert outcome.code == 0, f"{line} gave {outcome.code}: {outcome.output_text}"
        missing = [text for text in texts if text not in outcome.output_text]
        assert not missing, f"{line} printed none of {missing}:\n{outcome.output_text}"

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
        for expected_line in expected_lines:
            assert expected_line in outcome.output_text.splitlines(), f"{line} printed no line {expected_line!r}:\n{outcome.output_text}"

    def expect_requested_exit(self, line: str, request: CallerRequest, code: int, text: str) -> None:
        outcome = self.run_requested(line, request)
        assert outcome.code == code and text in outcome.output_text, f"{line} did not exit {code} naming {text!r}: {outcome.code} {outcome.output_text}"

    def new_row_id(self, line: str, actor: Actor | None = None) -> int:
        outcome = self.run(line, actor)
        assert outcome.code == 0, f"{line} gave {outcome.code}: {outcome.output_text}"
        return int(next(row for row in outcome.output_text.splitlines() if row.startswith("id: ")).removeprefix("id: "))

    def report_context_percent(self, session: str, percent: int) -> None:
        self.home.status_folder.mkdir(parents=True, exist_ok=True)
        (self.home.status_folder / f"{session}.json").write_text(json.dumps({"session_id": session, "context_window": {"used_percentage": percent}}))

    def error_log_text(self) -> str:
        return self.home.error_log.read_text() if self.home.error_log.exists() else ""

    def expect_sync_refusal(self, module: str, text: str) -> None:
        code, output_text = self.synced_with(module)
        assert code != 0 and text in output_text, f"module sync with {module} gave {code}: {output_text}"

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
        modules = json.loads(self.home.module_list.read_text())
        self.home.module_list.write_text(json.dumps([*modules, module]))
        return self.synced()

    def synced(self) -> tuple[int, str]:
        stream = io.StringIO()
        code = self.container.get(ModuleSyncLine).run(list(SYNC_ARGV), stream)
        if code == 0:
            self.container.get(Database).close()
            self.container = story_container(self.home, self.clock, self.process_table)
        return code, stream.getvalue()

    def expect_rows(self, *checks: bool) -> None:
        assert all(checks), f"a row check failed: {checks}"


def story_container(home: JournalHome, clock: ManualClock, process_table: "FixedProcessTable") -> Container:
    container = synced_container(home)
    container.bind(Clock, clock)
    container.bind(ProcessTable, process_table)
    return container

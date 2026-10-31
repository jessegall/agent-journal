import io
import shlex
from dataclasses import dataclass
from typing import TypeVar
from datetime import timedelta
from pathlib import Path

from core.base.actor import Actor
from core.base.cli.console import Console
from core.base.clock import Clock
from core.base.container import Container
from core.base.journal_container import synced_container
from core.base.journal_home import JournalHome
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.refusal_log import RecordedRefusal, RefusalLog
from core.base.subcommand.caller import Caller
from core.testing.manual_clock import ManualClock
from core.testing.template_databases import TemplateDatabases

M = TypeVar("M", bound=Model)


@dataclass(frozen=True)
class LineOutcome:
    """What one command line gave back: its exit code and what it printed."""

    line: str
    code: int
    output_text: str


class Story:
    """One story on its own copy of the template database, the public entry a plugin's stories use: it loads the
    modules named, runs command lines as text through the same console, container and registry as a real run,
    moves its clock by hand, reads rows and refusals, and checks what came back. It knows no noun of the core."""

    def __init__(self, home: JournalHome, container: Container, clock: ManualClock) -> None:
        self.home, self.container, self.clock = home, container, clock
        self.results: list[LineOutcome] = []
        self.agent = Actor.core()
        self.user = Actor.core()

    @classmethod
    def started(cls, templates: TemplateDatabases, folder: Path, modules: tuple[str, ...]) -> "Story":
        home = JournalHome(folder)
        templates.copied(modules, home)
        clock = ManualClock()
        container = synced_container(home)
        container.bind(Clock, clock)
        return cls(home, container, clock)

    def run(self, line: str, actor: Actor | None = None, environment_id: int | None = None) -> LineOutcome:
        stream = io.StringIO()
        code = self.container.get(Console).run(shlex.split(line), Caller(actor or Actor.core(), environment_id), stream)
        self.results.append(LineOutcome(line, code, stream.getvalue()))
        return self.results[-1]

    def row(self, model: type[M], row_id: int) -> M:
        return self.container.get(Queries).query(model).find(row_id)

    def refusals(self) -> tuple[RecordedRefusal, ...]:
        return self.container.get(RefusalLog).page(1, 1000).rows

    def advance(self, duration: timedelta) -> None:
        self.clock.advance(duration)

    def expect_success(self, line: str, *expected_lines: str, actor: Actor | None = None) -> None:
        outcome = self.run(line, actor)
        assert outcome.code == 0, f"{line} gave {outcome.code}: {outcome.output_text}"
        for expected_line in expected_lines:
            assert expected_line in outcome.output_text.splitlines(), f"{line} printed no line {expected_line!r}:\n{outcome.output_text}"

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

    def new_row_id(self, line: str, actor: Actor | None = None) -> int:
        outcome = self.run(line, actor)
        assert outcome.code == 0, f"{line} gave {outcome.code}: {outcome.output_text}"
        return int(next(row for row in outcome.output_text.splitlines() if row.startswith("id: ")).removeprefix("id: "))

    def error_log_text(self) -> str:
        return self.home.error_log.read_text() if self.home.error_log.exists() else ""

    def expect_rows(self, *checks: bool) -> None:
        assert all(checks), f"a row check failed: {checks}"

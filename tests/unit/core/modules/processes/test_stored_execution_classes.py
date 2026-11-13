import pytest

from engine.enums.command_category import CommandCategory
from engine.enums.execution_lane import ExecutionLane
from engine.enums.execution_priority import ExecutionPriority
from engine.enums.execution_source import ExecutionSource
from engine.enums.starter_type import StarterType
from engine.errors.refusal import Refusal
from engine.execution.builtin_classes import BUILTIN_CLASSES
from engine.execution.execution_class import ExecutionClass
from engine.execution.execution_classes import ExecutionClasses
from engine.execution.execution_starter import ExecutionStarter
from engine.execution.execution_subject import ExecutionSubject
from core.modules.processes.models.enums.process_setting import ProcessSetting
from core.modules.processes.models.execution_class_row import ExecutionClassRow
from core.modules.processes.support.stored_execution_classes import StoredExecutionClasses

WORKER = ExecutionStarter(StarterType.HELPER, agent_id=849, agent_role="worker")


class SampleSettings:
    """The process settings a test sets, the declared defaults for the rest."""

    def __init__(self, **values: int) -> None:
        self.values = values

    def integer(self, setting: ProcessSetting) -> int:
        return self.values.get(setting.name, setting.default)


class SampleRows:
    """Stored class rows a test hands the store, read as one query reads them."""

    def __init__(self, *rows: ExecutionClassRow) -> None:
        self.rows = rows

    def query(self, model: type) -> "SampleRows":
        return self

    def every_row(self, reason: str) -> tuple[ExecutionClassRow, ...]:
        return self.rows


def stored(*rows: ExecutionClassRow, **settings: int) -> StoredExecutionClasses:
    return StoredExecutionClasses(SampleRows(*rows), SampleSettings(**settings))  # type: ignore[arg-type]


def line(text: str, category: CommandCategory) -> ExecutionSubject:
    return ExecutionSubject(ExecutionSource.SHELL_LINE, WORKER, category=category, line=text)


def test_person_row_overrides_a_built_in_class():
    override = ExecutionClassRow(name="slow tests", lane=ExecutionLane.LONG, slot_cost=8, priority=ExecutionPriority.NORMAL, line_pattern="pytest", is_override=True)
    assert ExecutionClasses(stored(override)).match(line("pytest tests", CommandCategory.TEST_RUN)).name == "slow tests"


def test_person_pattern_row_matches_a_line():
    own = ExecutionClassRow(name="docs build", lane=ExecutionLane.LONG, slot_cost=2, priority=ExecutionPriority.BACKGROUND, line_pattern=r"^make docs")
    assert ExecutionClasses(stored(own)).match(line("make docs", CommandCategory.BUILD)).priority is ExecutionPriority.BACKGROUND


def test_lane_limits_follow_the_settings():
    limits = stored(LANE_CAPACITY_LONG=16, STARTER_CAP_PERCENT=25).lane_limits()
    assert (limits.capacity(ExecutionLane.LONG), limits.starter_cap(ExecutionLane.LONG)) == (16, 4)


def test_no_rows_gives_the_built_in_table():
    built_in = next(row.execution_class for row in BUILTIN_CLASSES if row.execution_class.name == "test, build or check")
    assert ExecutionClasses(stored()).match(line("pytest", CommandCategory.TEST_RUN)) == built_in


def test_row_with_cost_above_capacity_is_refused():
    with pytest.raises(Refusal):
        stored().validated(ExecutionClass("huge", ExecutionLane.LONG, 10, ExecutionPriority.AGENT))

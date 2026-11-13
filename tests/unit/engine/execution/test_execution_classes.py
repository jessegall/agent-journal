import pytest

from engine.enums.command_category import CommandCategory
from engine.enums.execution_lane import ExecutionLane
from engine.enums.execution_priority import ExecutionPriority
from engine.enums.execution_source import ExecutionSource
from engine.enums.starter_type import StarterType
from engine.errors.refusal import Refusal
from engine.execution.builtin_classes import BUILTIN_CLASSES
from engine.execution.default_lane_limits import DEFAULT_CAPACITIES
from engine.execution.execution_class import ExecutionClass
from engine.execution.execution_classes import ExecutionClasses
from engine.execution.execution_starter import ExecutionStarter
from engine.execution.execution_subject import ExecutionSubject

MAIN_AGENT = ExecutionStarter(StarterType.MAIN_AGENT, agent_id=1)
WORKER = ExecutionStarter(StarterType.HELPER, agent_id=849, agent_role="worker")
HELPER = ExecutionStarter(StarterType.HELPER, agent_id=850, agent_role="helper")


class SamplePersonClasses:
    """The person's own classes a test hands the matcher."""

    def __init__(self, *classes: ExecutionClass) -> None:
        self.own = classes

    def classes(self) -> tuple[ExecutionClass, ...]:
        return self.own


CLASSES = ExecutionClasses(SamplePersonClasses())


def line(starter: ExecutionStarter, category: CommandCategory, text: str = "ls") -> ExecutionSubject:
    return ExecutionSubject(ExecutionSource.SHELL_LINE, starter, category=category, line=text)


@pytest.mark.parametrize("category", list(CommandCategory))
def test_each_category_has_a_built_in_class(category: CommandCategory):
    assert CLASSES.match(line(WORKER, category)) is not None


def test_main_agent_short_line_is_immediate():
    assert CLASSES.match(line(MAIN_AGENT, CommandCategory.READ)).priority is ExecutionPriority.IMMEDIATE


def test_worker_short_line_is_agent():
    assert CLASSES.match(line(WORKER, CommandCategory.EDIT)).priority is ExecutionPriority.AGENT


def test_main_agent_test_run_is_agent_cost_four():
    test_class = CLASSES.match(line(MAIN_AGENT, CommandCategory.TEST_RUN))
    assert (test_class.lane, test_class.priority, test_class.slot_cost) == (ExecutionLane.LONG, ExecutionPriority.AGENT, 4)


def test_helper_test_run_is_agent():
    assert CLASSES.match(line(HELPER, CommandCategory.TEST_RUN)).priority is ExecutionPriority.AGENT


def test_background_job_costs_zero():
    assert CLASSES.match(line(WORKER, CommandCategory.BACKGROUND_JOB)).slot_cost == 0


def test_mixed_line_takes_longest_lane_and_highest_cost():
    mixed = CLASSES.for_line([line(WORKER, CommandCategory.READ), line(WORKER, CommandCategory.PACKAGE), line(WORKER, CommandCategory.TEST_RUN)])
    assert (mixed.lane, mixed.slot_cost) == (ExecutionLane.LONG, 4)


def test_person_pattern_class_wins():
    own = ExecutionClass("slow suite", ExecutionLane.LONG, 8, ExecutionPriority.NORMAL, line_pattern=r"^pytest tests/stories")
    assert ExecutionClasses(SamplePersonClasses(own)).match(line(WORKER, CommandCategory.TEST_RUN, "pytest tests/stories -x")) == own


def test_plugin_named_like_a_journal_kind_keeps_its_class():
    subject = ExecutionSubject(ExecutionSource.PLUGIN_PROGRAM, ExecutionStarter(StarterType.PLUGIN, plugin_name="sample"), plugin_name="sample", plugin_kind="merge")
    assert CLASSES.match(subject).name == "plugin program"


def test_cost_above_capacity_is_refused_with_the_text():
    too_dear = ExecutionClass("huge build", ExecutionLane.LONG, 10, ExecutionPriority.AGENT)
    with pytest.raises(Refusal) as refused:
        ExecutionClasses.validate(too_dear, 8)
    assert "costs 10 but the long lane holds 8: lower the cost or raise the capacity" in refused.value.text


@pytest.mark.parametrize("row", BUILTIN_CLASSES, ids=lambda row: row.execution_class.name)
def test_every_lane_cost_fits_default_capacity(row):
    ExecutionClasses.validate(row.execution_class, DEFAULT_CAPACITIES[row.execution_class.lane])

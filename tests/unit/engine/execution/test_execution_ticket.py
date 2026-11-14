import dataclasses

import pytest

from engine.enums.execution_lane import ExecutionLane
from engine.enums.execution_priority import ExecutionPriority
from engine.execution.classes.execution_class import ExecutionClass
from tests.unit.engine.execution.tickets import seconds_after_start, ticket

TEST_RUN = ExecutionClass("test run", ExecutionLane.LONG, 4, ExecutionPriority.AGENT)


def test_waited_child_takes_the_higher_priority():
    hook = ticket(ExecutionPriority.IMMEDIATE, ExecutionLane.INSTANT)
    child = hook.waited_child(TEST_RUN, "git status", seconds_after_start(1))
    assert (child.first_priority, child.priority) == (ExecutionPriority.IMMEDIATE, ExecutionPriority.IMMEDIATE)
    tick = ticket(ExecutionPriority.BACKGROUND, ExecutionLane.INSTANT)
    assert tick.waited_child(TEST_RUN, "pytest", seconds_after_start(1)).priority is ExecutionPriority.AGENT


def test_waited_child_keeps_parent():
    hook = ticket(ExecutionPriority.RESERVED, ExecutionLane.INSTANT)
    child = hook.waited_child(TEST_RUN, "pytest", seconds_after_start(2))
    assert child.parent is hook
    assert child.starter == hook.starter
    assert child.entered_at == child.raised_at == seconds_after_start(2)
    assert child.execution_class is TEST_RUN


def test_ticket_is_frozen():
    with pytest.raises(dataclasses.FrozenInstanceError):
        ticket(ExecutionPriority.NORMAL).priority = ExecutionPriority.AGENT

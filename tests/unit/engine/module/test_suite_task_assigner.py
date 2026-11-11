import pytest

from engine.module.driver_entries import DriverEntries
from engine.module.errors.module_error import ModuleError
from engine.module.suite import Suite
from engine.module.task_assigner import TaskAssigner


class PlainAssigner:
    """A class with the right methods that does not extend TaskAssigner."""

    def is_automatic(self) -> bool:
        return False


class EmptyHandsAssigner(TaskAssigner[object]):
    """A task assigner that hands out nothing."""

    def is_automatic(self) -> bool:
        return False

    def exceeds_context_limit(self, agent_id: int) -> bool:
        return False

    def allows_stop_with_tasks(self, agent_id: int) -> bool:
        return False

    def urgent(self, excluded_id: int | None = None) -> object | None:
        return None

    def following(self, agent_id: int, excluded_id: int | None = None) -> object | None:
        return None


class PlainSuite(Suite):
    """A suite whose task assigner follows no contract."""

    name = "plain"
    task_assigner = PlainAssigner  # type: ignore[assignment]


class EmptyHandsSuite(Suite):
    """A suite whose task assigner extends TaskAssigner."""

    name = "empty-hands"
    task_assigner = EmptyHandsAssigner


def test_a_suite_whose_task_assigner_does_not_extend_the_base_is_refused_at_sync():
    with pytest.raises(ModuleError, match="suite plain does not extend TaskAssigner"):
        DriverEntries.task_assigner_path(PlainSuite)


def test_a_suite_whose_task_assigner_extends_the_base_is_entered_by_its_path():
    assert DriverEntries.task_assigner_path(EmptyHandsSuite).endswith("EmptyHandsAssigner")

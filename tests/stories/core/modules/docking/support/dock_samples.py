from enum import StrEnum

from core.base.actor import Actor
from core.base.chat.dock_declaration import DockDeclaration
from core.base.command.bus import Bus
from core.base.module.module import Module
from core.modules.docking.commands.add_dock_item import AddDockItem
from core.modules.docking.models.dock_item import DockItem
from core.testing.story import Story

SAMPLE = "tests.stories.core.modules.docking.support.dock_samples:DockSampleModule"
TIMEOUT_SECONDS = 10


class SampleDockType(StrEnum):
    TASK = "docksample.task"
    UNKNOWN_TYPE = "docksample.ghost"


class DockSampleModule(Module):
    """A sample module the journal does not ship: tasks may be docked, two at most, and leave ten seconds
    after they end."""

    name = "docksample"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.docking", "journal.core.tasks"]
    docks = [DockDeclaration(SampleDockType.TASK, "task", "Task {row_id}", "task.js", most=2, leaves_after_seconds=TIMEOUT_SECONDS, reads=["task show"])]


def ended_task(story: Story, title: str) -> int:
    task_id = story.new_row_id(f'task make "{title}" --environment main', actor=story.user)
    story.run(f"task start {task_id}", actor=story.agent)
    story.run(f'task close {task_id} --outcome "done"', actor=story.agent)
    return task_id


def running_task(story: Story, title: str) -> int:
    task_id = story.new_row_id(f'task make "{title}" --environment main', actor=story.user)
    story.run(f"task start {task_id}", actor=story.agent)
    return task_id


def docked(story: Story, task_id: int, type: SampleDockType = SampleDockType.TASK) -> DockItem:
    return story.container.get(Bus).run(AddDockItem(1, type, "task", task_id), story.user)


def docked_state(story: Story, item: DockItem) -> str:
    return story.row(DockItem, item.id).state.value

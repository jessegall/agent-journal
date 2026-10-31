from dataclasses import dataclass

from core.base.database.database import Database
from core.base.registry.registry import Registry
from core.testing.story import Story


@dataclass(frozen=True)
class V4Appearance:
    """What version 4 showed for a kind of mark, read from main's mark catalogue (version-4.bak
    src/journal/features/*/feature.py card_families and src/web/src/domain/markIcon.js, thread.js): the
    family, its group and colouring, the mark's own icon, and the words a group of them is labelled with, if
    version 4 had them."""

    type: str
    v4_type: str
    family: str
    group: str
    colouring: str
    mark_icon: str
    group_label: str = ""


THOUGHT = V4Appearance("messages.thought", "thoughts", "messages.thoughts", "agent", "group", "summary")
FILED = V4Appearance("messages.filed", "filed", "messages.filed", "work", "group", "filed")
TASK = V4Appearance("tasks.task", "task_moves", "tasks.tasks", "work", "group", "task_start")
PLAN = V4Appearance("plans.plan", "plans", "plans.plans", "work", "group", "plan")
IMPASSE = V4Appearance("waits.impasse", "stuck", "waits.impasse", "agent", "group", "stuck")
SUBAGENT = V4Appearance("agents.subagent", "subagents", "agents.subagents", "agent", "group", "subagent", "{count} subagent updates")


def expect_declared_appearance(story: Story, appearance: V4Appearance) -> None:
    mark = next((entry for entry in Registry.read(story.container.get(Database)).marks if entry.type == appearance.type), None)
    assert mark is not None, f"no installed module declares the mark {appearance.type}"
    assert (mark.family, mark.group, mark.colouring, mark.mark_icon) == (appearance.family, appearance.group, appearance.colouring, appearance.mark_icon), f"{appearance.type} is declared as {mark}"
    assert not appearance.group_label or mark.group_label == appearance.group_label, f"{appearance.type} folds as {mark.group_label}"

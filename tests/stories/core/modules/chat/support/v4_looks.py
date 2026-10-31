from dataclasses import dataclass

from core.base.database.database import Database
from core.base.registry.registry import Registry
from core.testing.story import Story


@dataclass(frozen=True)
class V4Look:
    """What version 4 showed for a kind of mark, read from main's mark catalogue (version-4.bak
    src/journal/features/*/feature.py card_families and src/web/src/domain/markIcon.js, thread.js): the family, its group and
    colouring, the mark's own icon, and the words a group of them is labelled with, if version 4 had them."""

    type: str
    v4_kind: str
    family: str
    group: str
    colouring: str
    mark_icon: str
    group_words: str = ""


THOUGHT = V4Look("messages.thought", "thoughts", "messages.thoughts", "agent", "group", "summary")
FILED = V4Look("messages.filed", "filed", "messages.filed", "work", "group", "filed")
TASK = V4Look("tasks.task", "task_moves", "tasks.tasks", "work", "group", "task_start")
PLAN = V4Look("plans.plan", "plans", "plans.plans", "work", "group", "plan")
IMPASSE = V4Look("waits.impasse", "stuck", "waits.impasse", "agent", "group", "stuck")
SUBAGENT = V4Look("agents.subagent", "subagents", "agents.subagents", "agent", "group", "subagent", "{count} subagent updates")


def expect_declared_look(story: Story, look: V4Look) -> None:
    mark = next((entry for entry in Registry.read(story.container.get(Database)).marks if entry.type == look.type), None)
    assert mark is not None, f"no installed module declares the mark {look.type}"
    assert (mark.family, mark.group, mark.colouring, mark.mark_icon) == (look.family, look.group, look.colouring, look.mark_icon), f"{look.type} is declared as {mark}"
    assert not look.group_words or mark.group_label == look.group_words, f"{look.type} folds as {mark.group_label}"

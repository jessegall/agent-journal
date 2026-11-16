from dataclasses import dataclass

import pytest

from core.modules import DEFAULT_MODULES


@dataclass(frozen=True)
class Version4Look:
    """What version 4 showed for a kind of mark, read from its mark catalogue: the family, its group and
    colouring, the mark's own icon, and the words a group of them is labelled with, when version 4 had them.
    """

    type: str
    family: str
    group: str
    colouring: str
    mark_icon: str
    group_label: str = ""


LOOKS = (Version4Look("messages.thought", "messages.thoughts", "agent", "group", "summary"),
         Version4Look("messages.filed", "messages.filed", "work", "group", "filed"),
         Version4Look("tasks.task", "tasks.tasks", "work", "group", "task_start"),
         Version4Look("plans.plan", "plans.plans", "work", "group", "plan"),
         Version4Look("waits.impasse", "waits.impasse", "agent", "group", "stuck"),
         Version4Look("agents.subagent", "agents.helpers", "agent", "group", "subagent", "{count} helper updates"))


@pytest.mark.parametrize("look", LOOKS, ids=[look.type for look in LOOKS])
def test_each_mark_is_declared_as_version_4_showed_it(look):
    mark = next(mark for module in DEFAULT_MODULES for mark in module.mark_declarations() if mark.type.value == look.type)
    assert (mark.family.name, mark.family.group.value, mark.family.colouring.value, mark.mark_icon) == (look.family, look.group, look.colouring, look.mark_icon)
    assert not look.group_label or mark.group_label == look.group_label

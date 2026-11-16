from dataclasses import dataclass

import pytest

from core.modules import DEFAULT_MODULES


@dataclass(frozen=True)
class Version4Style:
    """What version 4 showed for a kind of mark, read from its mark catalogue: the family, its group and
    colouring, the mark's own icon, and the words a group of them is labelled with, when version 4 had them.
    """

    type: str
    family: str
    group: str
    colouring: str
    mark_icon: str
    group_label: str = ""


STYLES = (Version4Style("messages.thought", "messages.thoughts", "agent", "group", "summary"),
         Version4Style("messages.filed", "messages.filed", "work", "group", "filed"),
         Version4Style("tasks.task", "tasks.tasks", "work", "group", "task_start"),
         Version4Style("plans.plan", "plans.plans", "work", "group", "plan"),
         Version4Style("waits.impasse", "waits.impasse", "agent", "group", "stuck"),
         Version4Style("agents.subagent", "agents.helpers", "agent", "group", "subagent", "{count} helper updates"))


@pytest.mark.parametrize("style", STYLES, ids=[style.type for style in STYLES])
def test_version_4_mark_styles(style):
    mark = next(mark for module in DEFAULT_MODULES for mark in module.mark_declarations() if mark.type.value == style.type)
    assert (mark.family.name, mark.family.group.value, mark.family.colouring.value, mark.mark_icon) == (style.family, style.group, style.colouring, style.mark_icon)
    assert not style.group_label or mark.group_label == style.group_label

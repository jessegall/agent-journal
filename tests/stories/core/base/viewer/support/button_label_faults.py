from enum import StrEnum

from core.base.chat.mark_button import MarkButton
from core.base.chat.mark_declaration import MarkDeclaration
from core.base.chat.mark_family import MarkFamily
from core.base.chat.mark_group import MarkGroup
from core.base.module.module import Module
from core.base.viewer.button_declaration import ButtonDeclaration

PATH = "tests.stories.core.base.viewer.support.button_label_faults"
DEPENDENCIES = ["journal.core.tasks", "journal.core.plans", "journal.core.viewer"]


class MarkedType(StrEnum):
    NOTE = "marked.note"


class MarkedVariant(StrEnum):
    PLAIN = "plain"


def labelled(label: str) -> ButtonDeclaration:
    return ButtonDeclaration("labelled.act", ("row.plan",), label, "task start {row_id}", icon="check")


class LabelModule(Module):
    name = "labelled"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    buttons = [labelled("Complete the plan")]


class CloseModule(LabelModule):
    buttons = [labelled("Close the plan")]


class OpenModule(LabelModule):
    buttons = [labelled("Open the plan for review")]


class MarkButtonModule(Module):
    name = "marked"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    marks = [MarkDeclaration(type=MarkedType.NOTE, variants=MarkedVariant, family=MarkFamily("marked", "Marked", "check", MarkGroup.WORK), label="Notes", mark_icon="check",
                             buttons=[MarkButton("check", "Dismiss the note", "task start {row_id}")])]

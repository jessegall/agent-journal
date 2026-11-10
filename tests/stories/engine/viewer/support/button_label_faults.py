from enum import StrEnum

from engine.chat.mark_button import MarkButton
from engine.chat.mark_declaration import MarkDeclaration
from engine.chat.mark_family import MarkFamily
from engine.chat.mark_group import MarkGroup
from engine.module.module import Module
from engine.viewer.button_declaration import ButtonDeclaration

PATH = "tests.stories.engine.viewer.support.button_label_faults"
DEPENDENCIES = ["journal.core.tasks", "journal.core.plans", "journal.core.viewer"]


class TaggedType(StrEnum):
    NOTE = "marked.note"


class TaggedVariant(StrEnum):
    PLAIN = "plain"


def labelled(label: str) -> ButtonDeclaration:
    return ButtonDeclaration("labelled.act", tuple(["row.plan"]), label, "task start {row_id}", icon="check")


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
    marks = [MarkDeclaration(type=TaggedType.NOTE, variants=TaggedVariant, family=MarkFamily("marked", "Marked", "check", MarkGroup.WORK), label="Notes", mark_icon="check",
                             buttons=[MarkButton("check", "Dismiss the note", "task start {row_id}")])]

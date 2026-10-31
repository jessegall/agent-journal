from enum import StrEnum

from core.base.chat.dock_declaration import DockDeclaration
from core.base.chat.mark_button import MarkButton
from core.base.chat.mark_click import MarkClick
from core.base.chat.mark_declaration import MarkDeclaration
from core.base.chat.mark_family import MarkFamily
from core.base.chat.mark_group import MarkGroup
from core.base.module.module import Module

PATH = "tests.stories.core.base.chat.support.mark_faults"
DEPENDENCIES = ["journal.core.tasks", "journal.core.plans", "journal.core.viewer"]
FAMILY = MarkFamily("notes", "Notes", "words", MarkGroup.WORK)


class Variant(StrEnum):
    PLAIN = "plain"


class OtherVariant(StrEnum):
    OTHER = "other"


class NoVariant(StrEnum):
    pass


class Plain(StrEnum):
    NOTE = "good.note"


class Twice(StrEnum):
    FIRST = "twice.first"
    SECOND = "twice.second"


class Foreign(StrEnum):
    NOTE = "other.note"


def mark(type: StrEnum, **fields) -> MarkDeclaration:
    fields = {"variants": Variant, "family": FAMILY, "label": "Notes", "mark_icon": "words", **fields}
    return MarkDeclaration(type=type, **fields)


class GoodModule(Module):
    name = "good"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    marks = [mark(Plain.NOTE, buttons=[MarkButton("words", "Open", "task edit {row_id}")], body="note.js")]
    docks = [DockDeclaration(Plain.NOTE, "words", "{row_title}", "note.js", reads=["task list"])]


class DuplicateMarkModule(Module):
    name = "twice"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    marks = [mark(Twice.FIRST), mark(Twice.FIRST, variants=OtherVariant)]


class ForeignNameModule(Module):
    name = "foreign"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    marks = [mark(Foreign.NOTE)]


class NoVariantModule(Module):
    name = "good"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    marks = [mark(Plain.NOTE, variants=NoVariant)]


class SharedVariantModule(Module):
    name = "twice"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    marks = [mark(Twice.FIRST), mark(Twice.SECOND)]


class UnknownIconModule(Module):
    name = "good"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    marks = [mark(Plain.NOTE, mark_icon="rocket")]


class UnknownCommandModule(Module):
    name = "good"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    marks = [mark(Plain.NOTE, buttons=[MarkButton("words", "Fly", "task fly {row_id}")])]


class OtherPlaceholderModule(Module):
    name = "good"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    marks = [mark(Plain.NOTE, buttons=[MarkButton("words", "Open", "task edit {task_id}")])]


class MissingBodyModule(Module):
    name = "good"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    marks = [mark(Plain.NOTE, body="absent.js")]


class LonelyRowModule(Module):
    name = "good"
    requires_core = ">=5,<6"
    marks = [mark(Plain.NOTE, click=MarkClick.OPEN_ROW)]


class BadLabelModule(Module):
    name = "good"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    marks = [mark(Plain.NOTE, group_label="{family}: {total}")]


class EmptyDockModule(Module):
    name = "good"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    docks = [DockDeclaration(Plain.NOTE, "words", "Note", "note.js", most=0)]


class UnknownReadDockModule(Module):
    name = "good"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    docks = [DockDeclaration(Plain.NOTE, "words", "Note", "note.js", reads=["task fly"])]


class ForeignDockModule(Module):
    name = "foreign"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    docks = [DockDeclaration(Plain.NOTE, "words", "Note", "note.js")]

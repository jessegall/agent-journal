from enum import StrEnum

from engine.chat.dock_declaration import DockDeclaration
from engine.chat.mark_button import MarkButton
from engine.chat.mark_click import MarkClick
from engine.chat.mark_declaration import MarkDeclaration
from engine.chat.mark_family import MarkFamily
from engine.chat.mark_group import MarkGroup
from core.base.module.module import Module

PATH = "tests.stories.engine.chat.support.mark_faults"
DEPENDENCIES = ["journal.core.tasks", "journal.core.plans", "journal.core.viewer"]
FAMILY = MarkFamily("notes", "Notes", "words", MarkGroup.WORK)


class Variant(StrEnum):
    PLAIN = "plain"


class SecondVariant(StrEnum):
    SECOND = "other"


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
    marks = [mark(Plain.NOTE, buttons=[MarkButton("words", "Edit the task", "task edit {row_id}")], body="note.js")]
    docks = [DockDeclaration(Plain.NOTE, "words", "{row_title}", "note.js", reads=["task list"])]


class GrantingButtonModule(GoodModule):
    marks = [mark(Plain.NOTE, buttons=[MarkButton("words", "Trust", "window trust {row_id}")], body="note.js")]


def button_marks(runs: str) -> list[MarkDeclaration]:
    return [mark(Plain.NOTE, buttons=[MarkButton("words", "Press", runs)], body="note.js")]


class AgentTypeButtonModule(GoodModule):
    marks = button_marks("agent type {row_id}")
    docks = []


class PlanApproveButtonModule(GoodModule):
    marks = button_marks("plan approve {row_id}")
    docks = []


class ProgramTrustButtonModule(GoodModule):
    marks = button_marks("program trust {row_id}")
    docks = []


class PluginInstallButtonModule(GoodModule):
    marks = button_marks("plugin install {row_id}")
    docks = []


class UpdateInstallButtonModule(GoodModule):
    marks = button_marks("update install {row_id}")
    docks = []


class SecretAllowButtonModule(GoodModule):
    marks = button_marks("secret allow {row_id}")
    docks = []


class SecretFillButtonModule(GoodModule):
    marks = button_marks("secret fill {row_id}")
    docks = []


class PhonePairButtonModule(GoodModule):
    marks = button_marks("phone pair {row_id}")
    docks = []


class SharedLine(StrEnum):
    NOTE = "shared.note"


class SharedLineModule(Module):
    name = "shared"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    marks = [mark(SharedLine.NOTE, buttons=[MarkButton("words", "Edit the task", "task edit {row_id}")], body="note.js")]


class DuplicateMarkModule(Module):
    name = "twice"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    marks = [mark(Twice.FIRST), mark(Twice.FIRST, variants=SecondVariant)]


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


class SecondPlaceholderModule(Module):
    name = "good"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    marks = [mark(Plain.NOTE, buttons=[MarkButton("words", "Edit the task", "task edit {task_id}")])]


class MissingBodyModule(Module):
    name = "good"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    marks = [mark(Plain.NOTE, body="absent.js")]


class ModellessRowMarkModule(Module):
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


class Renamed(StrEnum):
    NOTE = "good.memo"


class ChangedModule(Module):
    name = "good"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    marks = [mark(Renamed.NOTE)]


class NewerKitModule(Module):
    name = "good"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    marks = [mark(Plain.NOTE, kit=">=2,<3")]
    docks = [DockDeclaration(Plain.NOTE, "words", "Note", "note.js", kit=">=2,<3")]

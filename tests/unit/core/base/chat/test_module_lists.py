from enum import StrEnum

from core.base.chat.dock_declaration import DockDeclaration
from core.base.chat.mark_declaration import MarkDeclaration
from core.base.chat.mark_family import MarkFamily
from core.base.chat.mark_group import MarkGroup
from core.base.module.module import Module


class SampleType(StrEnum):
    NOTE = "sample.note"


class SampleVariant(StrEnum):
    PLAIN = "plain"


MARK = MarkDeclaration(type=SampleType.NOTE, variants=SampleVariant, family=MarkFamily("sample", "Samples", "note", MarkGroup.WORK), label="Notes", mark_icon="note")
DOCK = DockDeclaration(type=SampleType.NOTE, icon="note", title="Note", body="note.js")


class Bare(Module):
    name = "bare"


class Declaring(Module):
    name = "declaring"
    marks = [MARK]
    docks = [DOCK]


def test_a_module_without_marks_or_docks_has_empty_lists():
    assert (tuple(Bare.marks), tuple(Bare.docks)) == ((), ())


def test_a_module_declares_marks_and_docks_the_same_way():
    assert (Declaring.marks, Declaring.docks) == ([MARK], [DOCK])

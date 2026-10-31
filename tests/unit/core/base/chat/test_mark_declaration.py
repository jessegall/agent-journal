import ast
from enum import StrEnum
from pathlib import Path

from core.base.chat.dock_declaration import DockDeclaration
from core.base.chat.mark_button import MarkButton
from core.base.chat.mark_colouring import MarkColouring
from core.base.chat.mark_declaration import MarkDeclaration
from core.base.chat.mark_family import MarkFamily
from core.base.chat.mark_group import MarkGroup


class SampleType(StrEnum):
    NOTE = "sample.note"


class SampleVariant(StrEnum):
    PLAIN = "plain"


FAMILY = MarkFamily("sample", "Samples", "note", MarkGroup.WORK)


def declare(**fields) -> MarkDeclaration:
    return MarkDeclaration(type=SampleType.NOTE, variants=SampleVariant, family=FAMILY, label="Notes", mark_icon="note", **fields)


def test_the_default_group_label_is_accepted():
    assert declare().problems() == []


def test_a_group_label_takes_the_family_the_type_and_the_count():
    assert declare(group_label="{family} {type} {count}").problems() == []


def test_a_group_label_with_another_field_is_refused():
    problems = declare(group_label="{family}: {total} updates").problems()
    assert len(problems) == 1 and "{total}" in problems[0]


def test_a_family_colours_by_its_group_unless_told_otherwise():
    assert FAMILY.colouring is MarkColouring.GROUP


def test_a_declaration_has_the_defaults_the_design_gives():
    mark = declare()
    assert (mark.shown, mark.main, mark.process, mark.body, tuple(mark.buttons)) == (True, True, False, "", ())


def test_a_dock_declaration_holds_one_item_and_never_leaves_by_default():
    dock = DockDeclaration(type=SampleType.NOTE, icon="note", title="{row_title}", body="note.js", buttons=(MarkButton("x", "Go", "note open {row_id}"),))
    assert (dock.most, dock.leaves_after_seconds, tuple(dock.reads)) == (1, 0, ())


def test_the_chat_base_imports_no_module():
    folder = Path(__file__).resolve().parents[5] / "src" / "core" / "base" / "chat"
    imported = [node.module for path in folder.glob("*.py") for node in ast.walk(ast.parse(path.read_text()))
                if isinstance(node, ast.ImportFrom) and node.module]
    assert [name for name in imported if not name.startswith(("core.base.chat", "collections", "dataclasses", "enum", "string"))] == []

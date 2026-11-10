from dataclasses import replace

import pytest

from core.base.module.button_check import ButtonCheck
from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.base.registry.button_window import ButtonWindow
from engine.subcommand.read_subcommand import ReadSubcommand
from engine.subcommand.subcommand import Subcommand
from core.base.viewer.button_declaration import ButtonDeclaration, ButtonMenuItem, Choice, ChoiceField, TemplateField, TextField
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_loading import WindowLoading
from tests.unit.engine.model.test_model import Item

BUTTON = ButtonDeclaration("review.run", tuple(["row.item"]), "Review", "note review {row_id}")
SHIPPED = frozenset({"journal.core.notes"})


class ReviewNote(Subcommand):
    cli_name = "note"
    name = "review"


class WorkerList(ReadSubcommand):
    cli_name = "worker"
    name = "list"


class NotesModule(Module):
    name = "journal.core.notes"
    models = [ModelDeclaration(Item)]
    subcommands = [ReviewNote, WorkerList]
    button_slots = ["notes.toolbar"]


class ReviewModule(Module):
    name = "acme.review"
    dependencies = [NotesModule.name]
    buttons = [BUTTON]


def problems(button=BUTTON, **fields):
    module = type("ReviewDeclarationModule", tuple([ReviewModule]), {"buttons": [button], **fields})
    return ButtonCheck().declared_problems([NotesModule, module], SHIPPED)


def test_a_valid_button_and_an_empty_icon_are_allowed():
    assert problems() == ()


@pytest.mark.parametrize("change,text", [
    ({"runs": "note missing {row_id}"}, "names no command"),
    ({"runs": "note review {missing}"}, "unknown field missing"),
    ({"runs": "note review {row_id}tail"}, "end of one word"),
    ({"runs": "note review {row_id}{row_id}"}, "end of one word"),
    ({"runs": "note review {row_id",}, "invalid blanks"),
    ({"runs": "note review {row id}"}, "invalid blanks"),
    ({"runs": 'note review "unclosed'}, "quoting"),
    ({"slots": tuple(["row.missing"])}, "unknown slot row.missing"),
    ({"name": "other.run"}, "does not start"),
    ({"primary": True}, "primary"),
    ({"icon": "unknown-icon"}, "icon unknown-icon"),
])
def test_each_invalid_button_declaration_is_refused(change, text):
    assert any(text in problem for problem in problems(replace(BUTTON, **change)))


def test_a_menu_item_must_name_a_command():
    button = replace(BUTTON, menu=tuple([ButtonMenuItem("Missing", "note missing {row_id}")]))
    assert any("names no command" in problem for problem in problems(button))


def test_a_slot_requires_a_dependency_on_its_owner():
    assert any("depends" in problem for problem in problems(dependencies=[]))


def test_a_module_can_use_its_own_slot_without_a_dependency():
    button = replace(BUTTON, slots=tuple(["review.toolbar"]))
    assert problems(button, dependencies=[], button_slots=["review.toolbar"]) == ()


def test_a_module_cannot_claim_another_modules_slot_to_avoid_its_dependency():
    assert any("offered by both" in problem for problem in problems(dependencies=[], button_slots=["row.item"]))


@pytest.mark.parametrize("runs", ["note review {message}", "note review --message-{message}", "note review --message=prefix{message}"])
def test_a_text_field_must_fill_a_whole_flag_value(runs):
    button = replace(BUTTON, runs=runs, fields=tuple([TextField("message", "Message")]))
    assert any("--flag=" in problem for problem in problems(button))


@pytest.mark.parametrize("field,text", [
    (ChoiceField("size", "Size", ()), "no choices"),
    (ChoiceField("size", "Size", (Choice("small", "Small"), Choice("small", "Again"))), "duplicate choice small"),
    (ChoiceField("size", "Size", tuple([Choice("small", "Small")]), "large"), "default large"),
    (TemplateField("size", "Template", "nothing", "critique"), "neither a model nor the first word"),
])
def test_each_invalid_field_is_refused(field, text):
    button = replace(BUTTON, runs="note review {row_id} --size={size}", fields=tuple([field]))
    assert any(text in problem for problem in problems(button))


def test_a_field_without_a_blank_is_refused():
    assert any("unused field size" in problem for problem in problems(replace(BUTTON, fields=tuple([TextField("size", "Size")]))))


@pytest.mark.parametrize("target", ["worker", "item"])
def test_a_model_or_command_word_is_a_valid_template_target(target):
    button = replace(BUTTON, runs="note review {row_id} --template={template}", fields=tuple([TemplateField("template", "Template", target, "critique")]))
    assert problems(button) == ()


def test_menu_fields_are_checked_as_well():
    menu = ButtonMenuItem("Message", "note review {message}", fields=tuple([TextField("message", "Message")]))
    assert any("--flag=" in problem for problem in problems(replace(BUTTON, menu=tuple([menu]))))


def test_a_shipped_button_can_be_primary():
    module = type("PrimaryNotesModule", tuple([NotesModule]), {"buttons": [replace(BUTTON, name="notes.run", primary=True)]})
    assert ButtonCheck().declared_problems([module], SHIPPED) == ()


def test_a_third_party_cannot_reuse_a_shipped_button_command():
    module = type("ButtonNotesModule", tuple([NotesModule]), {"buttons": [replace(BUTTON, name="notes.run")]})
    assert any("also runs" in problem for problem in ButtonCheck().declared_problems([module, ReviewModule], SHIPPED))


def test_a_third_party_cannot_reuse_a_shipped_window_command():
    window = WindowDeclaration(ButtonWindow.MARKS, "Chat", "", WindowLoading.COMPONENT, runs=["note review"])
    module = type("WindowNotesModule", tuple([NotesModule]), {"windows": [window]})
    assert any("windows run" in problem for problem in ButtonCheck().declared_problems([module, ReviewModule], SHIPPED))


def test_two_modules_cannot_share_a_button_command():
    peer_module = type("OtherReviewModule", tuple([ReviewModule]), {"name": "acme.other", "buttons": [replace(BUTTON, name="other.run")]})
    assert any("also runs" in problem for problem in ButtonCheck().declared_problems([NotesModule, ReviewModule, peer_module], SHIPPED))


@pytest.mark.parametrize("line", ["window allow", "window trust", "setting make", "setting edit", "setting delete", "viewer-layout save",
                                 "program trust", "plugin install", "update install", "secret allow", "secret fill", "phone pair"])
def test_a_third_party_cannot_run_a_person_only_command(line):
    assert any("only a person" in problem for problem in problems(replace(BUTTON, runs=line)))

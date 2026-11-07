from dataclasses import replace
from enum import StrEnum

from core.base.chat.mark_declaration import MarkDeclaration
from core.base.chat.mark_family import MarkFamily
from core.base.chat.mark_group import MarkGroup
from core.base.module.button_check import ButtonCheck
from core.base.module.mark_check import MarkCheck
from core.base.module.module import Module

FAMILY = MarkFamily("notes", "Notes", "words", MarkGroup.WORK)


class Variant(StrEnum):
    PLAIN = "plain"


def mark(value: str, family: MarkFamily = FAMILY) -> MarkDeclaration:
    return MarkDeclaration(type=StrEnum("Type", {"NOTE": value}).NOTE, variants=Variant, family=family, label="Notes", mark_icon="words")


def module(name: str, *marks: MarkDeclaration) -> type[Module]:
    return type("Sample", tuple([Module]), {"name": name, "requires_core": ">=5,<6", "marks": marks})


def problems(*modules: type[Module]) -> tuple[str, ...]:
    return MarkCheck(ButtonCheck()).problems(modules)


def test_a_valid_declaration_has_no_problems():
    assert problems(module("sample", mark("sample.note"))) == ()


def test_a_family_declared_by_two_modules_is_refused():
    assert problems(module("sample", mark("sample.note")), module("other", mark("other.note"))) == tuple(["the mark family notes is declared by sample and by other"])


def test_a_family_declared_twice_with_different_fields_is_refused():
    changed = replace(FAMILY, title="Others")
    assert "the mark family notes is declared twice by sample with different fields" in problems(module("sample", mark("sample.note"), mark("sample.second", changed)))


def test_a_family_declared_twice_the_same_way_is_accepted():
    assert [line for line in problems(module("sample", mark("sample.note"), mark("sample.second"))) if "family" in line] == []

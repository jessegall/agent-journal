from engine.module.module import Module
from engine.skill.skill_declaration import SkillDeclaration


class JournalShelves(SkillDeclaration):
    folder = "journal-shelves"
    description = "Stock the shelves; read it when a shelf is empty"
    keywords = ("shelf", "stock")
    types = ["main"]


class ShopModule(Module):
    name = "shop"
    skills = [JournalShelves, SkillDeclaration("journal-till", "Run the till")]


def test_a_skill_class_gives_the_declaration_the_inline_call_gave():
    assert JournalShelves.declared() == SkillDeclaration("journal-shelves", "Stock the shelves; read it when a shelf is empty", keywords=("shelf", "stock"), types=["main"])


def test_a_module_gives_the_declarations_of_its_skill_classes_beside_its_inline_ones():
    assert [skill.folder for skill in ShopModule.skill_declarations()] == ["journal-shelves", "journal-till"]

from engine.enums.setting_component import SettingComponent
from engine.enums.setting_type import SettingType
from engine.registry.setting_entry import SettingEntry
from engine.registry.setting_tree import SettingTree
from engine.setting.setting_group import SettingGroup
from engine.setting.setting_value import SettingValue


def entries(*values: SettingValue) -> dict[str, SettingEntry]:
    group = SettingGroup("g", "Group", "A group of settings.", children=values, screen="work", section="Taking on work")
    return {entry.key: entry for entry in SettingTree().entries("journal.test", [group])}


def test_a_declaration_with_no_component_resolves_to_the_default_of_its_kind():
    found = entries(SettingValue("auto", "Auto", "Whether it goes on.", SettingType.FLAG, default=True))
    assert found["journal.test.g.auto"].drawn_by() is SettingComponent.TOGGLE


def test_a_declared_component_and_place_reach_the_entry():
    found = entries(SettingValue("cap", "Cap", "A size.", SettingType.NUMBER, default=1, screen="advanced", section="Context size", component=SettingComponent.PER_TYPE_OVERRIDE))
    entry = found["journal.test.g.cap"]
    assert (entry.screen, entry.section, entry.drawn_by()) == ("advanced", "Context size", SettingComponent.PER_TYPE_OVERRIDE)
    assert found["journal.test.g"].screen == "work"


def test_a_component_that_cannot_draw_its_kind_is_a_problem_naming_the_key_and_the_allowed_components():
    value = SettingValue("auto", "Auto", "Whether it goes on.", SettingType.FLAG, default=True, component=SettingComponent.NUMBER)
    problem = next(iter(value.problems("journal.test.auto")))
    assert "journal.test.auto" in problem and "toggle" in problem


def test_an_old_stored_entry_without_the_new_fields_still_loads():
    stored = {"key": "k", "module": "m", "parent": None, "title": "T", "description": "D", "type": "flag", "default": True, "secret": False, "scope": "both",
              "choices": [], "toggleable": False, "enabled": True}
    entry = SettingEntry.restored(stored)
    assert (entry.screen, entry.section, entry.drawn_by()) == ("", "", SettingComponent.TOGGLE)

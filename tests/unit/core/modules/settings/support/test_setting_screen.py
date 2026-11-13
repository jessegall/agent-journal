from dataclasses import replace

from engine.registry.setting_entry import SettingEntry
from core.modules.settings.support.current_setting import CurrentSetting
from core.modules.settings.support.setting_screen import SettingScreen


def entry(key: str, screen: str, section: str, **fields) -> SettingEntry:
    return SettingEntry(key, "journal.test", None, key, f"The {key} setting.", "flag", True, False, "both", (), False, True, screen=screen, section=section, **fields)


class FakeCatalogue:
    def __init__(self, entries: tuple[SettingEntry, ...]) -> None:
        self.entries = entries

    def all(self) -> tuple[SettingEntry, ...]:
        return self.entries


class FakeReader:
    def __init__(self, values: dict[str, object]) -> None:
        self.values = values

    def current(self, key: str) -> CurrentSetting:
        return CurrentSetting(next(entry for entry in ENTRIES if entry.key == key), self.values.get(key, True), "default")


ENTRIES = (
    entry("a", "work", "Taking on work"),
    entry("b", "work", "Workers"),
    entry("c", "work", "Taking on work"),
    entry("d", "work", "Workers", required_settings=tuple(["b"])),
    entry("other", "tests", "Test commands"),
)


def screen(values: dict[str, object] | None = None, entries: tuple[SettingEntry, ...] = ENTRIES) -> SettingScreen:
    return SettingScreen(FakeCatalogue(entries), FakeReader(values or {}))


def test_nodes_are_grouped_by_section_in_the_order_the_sections_first_appear():
    assert [node.key for node in screen().read("work").nodes] == ["a", "c", "b", "d"]


def test_a_nested_setting_carries_the_keys_it_requires():
    nodes = {node.key: node for node in screen().read("work").nodes}
    assert nodes["d"].requires == tuple(["b"]) and nodes["a"].requires == ()


def test_a_setting_on_another_screen_is_absent():
    assert "other" not in [node.key for node in screen().read("work").nodes]


def test_the_revision_changes_when_a_value_changes_and_not_when_another_screen_changes():
    base = screen().read("work").revision
    assert screen({"a": False}).read("work").revision != base
    assert screen({"other": False}).read("work").revision == base


def test_an_unknown_screen_has_no_nodes():
    reading = screen().read("nowhere")
    assert reading.nodes == () and reading.screen == "nowhere"


def test_a_node_says_which_component_draws_it_and_that_a_person_alone_may_change_it():
    changed = tuple([replace(ENTRIES[0], person_set=True)])
    node = screen(entries=changed).read("work").nodes[0]
    assert (node.component, node.read_only) == ("toggle", True)

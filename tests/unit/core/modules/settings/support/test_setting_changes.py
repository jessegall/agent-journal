from types import SimpleNamespace

import pytest

from engine.errors.refusal import Refusal
from engine.registry.setting_entry import SettingEntry
from engine.setting.number_rule import NumberRule
from engine.setting.setting_rule_text import SettingRuleText
from core.modules.settings.commands.apply_setting_screen.apply_setting_screen import ApplySettingScreen
from core.modules.settings.commands.apply_setting_screen.apply_setting_screen_handler import ApplySettingScreenHandler
from core.modules.settings.support.setting_changes import SettingChanges
from core.modules.settings.support.screen_reading import ScreenReading
from core.modules.settings.support.screen_node import ScreenNode

CONTEXT = SimpleNamespace(environment_id=1)


def number(key: str) -> SettingEntry:
    return SettingEntry(key, "journal.test", None, key, "A number.", "number", 1, False, "both", (), False, True, rule=SettingRuleText.rule_text(NumberRule(0)))


class RecordingStore:
    def __init__(self) -> None:
        self.written: list[tuple[str, object]] = []

    def write(self, key: str, value: object, environment_id: int | None, context: object) -> None:
        self.written.append((key, value))


class FakeScreens:
    def __init__(self, revision: str = "r1") -> None:
        self.revision = revision

    def read(self, screen: str) -> ScreenReading:
        node = ScreenNode("a", "number", "number", "S", None, "A", "A.", 1, 1, "default", (), "", (), False)
        return ScreenReading(screen, self.revision, tuple([node]))


class FakeCatalogue:
    def value(self, key: str) -> SettingEntry:
        return number(key)


def handler(store: RecordingStore, revision: str = "r1") -> ApplySettingScreenHandler:
    return ApplySettingScreenHandler(FakeScreens(revision), FakeCatalogue(), SettingChanges(store))


def test_every_change_is_written_when_all_of_them_are_valid():
    store = RecordingStore()
    SettingChanges(store).apply([(number("a"), "2"), (number("b"), "3")], CONTEXT)
    assert store.written == [("a", 2), ("b", 3)]


def test_one_invalid_number_writes_none_and_names_its_key():
    store = RecordingStore()
    with pytest.raises(Refusal) as refusal:
        SettingChanges(store).apply([(number("a"), "2"), (number("b"), "-4")], CONTEXT)
    assert store.written == [] and "b" in refusal.value.text


def test_a_stale_revision_writes_nothing():
    store = RecordingStore()
    with pytest.raises(Refusal):
        handler(store, revision="r2").handle(ApplySettingScreen("work", "r1", tuple([("a", "2")])), CONTEXT)
    assert store.written == []


def test_a_setting_that_is_not_on_the_screen_writes_nothing():
    store = RecordingStore()
    with pytest.raises(Refusal):
        handler(store).handle(ApplySettingScreen("work", "r1", (("a", "2"), ("other", "3"))), CONTEXT)
    assert store.written == []


def test_a_valid_request_on_a_current_reading_writes_every_change():
    store = RecordingStore()
    handler(store).handle(ApplySettingScreen("work", "r1", tuple([("a", "5")])), CONTEXT)
    assert store.written == [("a", 5)]


def test_a_request_may_carry_a_further_screen_and_writes_the_changes_of_both_together():
    store = RecordingStore()
    handler(store).handle(ApplySettingScreen("work", "r1", tuple([("a", "5")]), tuple([("tests", "r1")])), CONTEXT)
    assert store.written == [("a", 5)]


def test_a_further_screen_read_at_another_revision_writes_nothing():
    store = RecordingStore()
    with pytest.raises(Refusal) as refusal:
        handler(store).handle(ApplySettingScreen("work", "r1", tuple([("a", "5")]), tuple([("tests", "r0")])), CONTEXT)
    assert store.written == [] and "tests" in refusal.value.text

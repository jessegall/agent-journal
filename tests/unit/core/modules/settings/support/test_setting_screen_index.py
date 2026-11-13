from engine.registry.setting_entry import SettingEntry
from core.modules.settings.support.setting_screen import SettingScreen


def entry(key: str, screen: str, section: str) -> SettingEntry:
    return SettingEntry(key, "journal.test", None, f"Title of {key}", f"The {key} setting.", "flag", True, False, "both", (), False, True, screen=screen, section=section)


class FakeCatalogue:
    def __init__(self, entries: tuple[SettingEntry, ...]) -> None:
        self.entries = entries

    def all(self) -> tuple[SettingEntry, ...]:
        return self.entries


ENTRIES = (
    entry("auto", "work", "Taking on work"),
    entry("cap", "advanced", "Context size"),
    entry("wait", "helper-type.merger", "Waiting"),
    entry("limit", "helper-type.read-only", "Every profile"),
    entry("hidden", "", ""),
)


def index() -> dict[str, object]:
    return {matched.key: matched for matched in SettingScreen(FakeCatalogue(ENTRIES), None).index()}


def test_a_setting_on_a_tab_shows_the_tab_and_its_section():
    assert index()["auto"].path == "Work > Taking on work" and index()["cap"].path == "Advanced > Context size"


def test_a_setting_on_a_type_screen_shows_its_type_in_the_path():
    assert index()["wait"].path == "Helpers > Merger" and index()["limit"].path == "Helpers > Read only"


def test_a_setting_with_no_screen_is_absent():
    assert "hidden" not in index()


def test_each_setting_is_listed_once_with_the_screen_and_section_that_open_to_it():
    matched = SettingScreen(FakeCatalogue(ENTRIES), None).index()
    assert [matched.key for matched in matched].count("auto") == 1 and (index()["wait"].screen, index()["wait"].section) == ("helper-type.merger", "Waiting")

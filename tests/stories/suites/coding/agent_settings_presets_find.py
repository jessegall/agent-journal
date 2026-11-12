import pytest

from tests.stories.suites.coding.support.main_controls_fixture import MainControlsActors, person_viewer
from tests.stories.suites.coding.support.settings_modal import AUTO, SENDS, Modal

NO_MATCH = "zebra"


class Presets:
    """The band, the page and Find a setting as their client plays them through the viewer routes: it reads the
    presets and the switches of the work settings, the index of every screened setting, and the screens."""

    def __init__(self, modal: Modal) -> None:
        self.modal = modal

    def work(self) -> dict[str, object]:
        return self.modal.window_keys("work")["work"]["value"]

    def presets(self) -> dict[str, dict[str, bool]]:
        return {preset["key"]: preset["values"] for preset in self.work()["presets"]}

    def form(self) -> dict[str, bool]:
        return {key: self.modal.value("work", key) for key in self.presets()["builder"]}

    def band(self) -> str:
        form = self.form()
        return next((key for key, values in self.presets().items() if values == form), "custom")

    def fill(self, name: str) -> None:
        self.modal.save({key: "on" if value else "off" for key, value in self.presets()[name].items()}, "work")

    def index(self) -> list[dict[str, object]]:
        return self.modal.window_keys("find")["find"]["value"]["rows"]

    def found(self, words: str) -> list[dict[str, object]]:
        wanted = words.lower().split()
        return [entry for entry in self.index() if all(word in f"{entry['title']} {entry['description']}".lower() for word in wanted)]


@pytest.fixture
def presets(new_story):
    story = new_story(fixture=MainControlsActors)
    with person_viewer(story) as viewer:
        yield Presets(Modal(viewer))


def test_the_band_says_the_preset_the_eight_switches_match_and_custom_for_any_other_mix(presets):
    assert presets.band() == "builder"
    presets.fill("orchestrator")
    assert presets.band() == "orchestrator"
    presets.modal.save({AUTO: "on"}, "work")
    assert presets.band() == "custom"
    presets.fill("builder")
    assert presets.band() == "builder"


def test_a_preset_is_the_eight_switches_and_nothing_else_and_saves_only_when_sent(presets):
    values = presets.presets()
    assert set(values) == {"builder", "orchestrator"} and all(len(entry) == 8 for entry in values.values())
    assert {switch["key"] for switch in presets.work()["switches"]} == set(values["builder"])
    before = presets.form()
    assert presets.form() == before
    presets.fill("orchestrator")
    assert presets.form() == values["orchestrator"]
    assert presets.work()["workflow"] == "orchestrator"


def test_the_page_has_a_line_and_the_values_of_each_preset_for_the_table_of_differences(presets):
    work = presets.work()
    assert [preset["name"] for preset in work["presets"]] == ["Builder", "Orchestrator"]
    assert all(preset["line"] for preset in work["presets"])
    differing = [key for key, value in presets.presets()["builder"].items() if value != presets.presets()["orchestrator"][key]]
    assert AUTO in differing and 0 < len(differing) < 8


def test_find_lists_a_merger_setting_with_its_path_and_the_screen_that_opens_it(presets):
    merger = [entry for entry in presets.index() if entry["path"] == "Helpers > Merger"]
    assert merger and all(entry["screen"] == "helper-type.merger" for entry in merger)
    assert merger[0]["key"] in presets.modal.nodes("helper-type.merger")


def test_find_with_a_word_that_matches_nothing_answers_an_empty_list(presets):
    assert presets.found(NO_MATCH) == []
    assert presets.found("merger")


def test_a_setting_hidden_by_an_off_switch_is_still_found_and_names_the_switch_that_shows_it(presets):
    presets.modal.save({SENDS: "off"}, "work")
    hidden = {key: node for name in ("work", "tests", "advanced") for key, node in presets.modal.nodes(name).items() if SENDS in node["requires"]}
    assert hidden and set(hidden) <= {entry["key"] for entry in presets.index()}
    assert all(node["requires"] == [SENDS] or SENDS in node["requires"] for node in hidden.values())

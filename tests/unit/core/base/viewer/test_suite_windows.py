from core.base.registry.registry import Registry
from core.base.registry.suite_entry import SuiteEntry
from core.base.registry.window_entry import WindowEntry
from core.base.viewer.layout_shape import LayoutShape, split, tabs
from core.base.viewer.suite_windows import SuiteWindows

HOME = tabs("notes.board")
ORCHESTRATOR_HOME = split("row", 0.5, tabs("notes.board"), tabs("notes.list"))


def window(name: str, unavailable_reason: str = "") -> WindowEntry:
    return WindowEntry(name, "notes", name, "board.html", "frame", "environment", (), (), (), (), False, unavailable_reason)


def suite(name: str, windows: tuple[str, ...], requires: tuple[str, ...] = (), layouts: dict[str, LayoutShape] | None = None) -> SuiteEntry:
    return SuiteEntry(name, "notes", requires, {}, False, (), windows, dict(layouts or {}))


REGISTRY = Registry("", {}, {}, {}, (), (),
                    suites=(suite("notes", ("notes.board", "notes.list"), layouts={"home": HOME, "home@notes.orchestrator": ORCHESTRATOR_HOME}),
                            suite("agency", tuple(["notes.archive"]), requires=tuple(["notes"]))),
                    windows=(window("notes.board"), window("notes.list"), window("notes.archive", "built for window kit >=2,<3; this viewer has kit 1")))


def test_a_suite_offers_its_own_windows_and_a_bundle_those_of_the_suites_it_requires():
    assert [entry.name for entry in SuiteWindows(REGISTRY).windows("notes")] == ["notes.board", "notes.list"]
    assert [entry.name for entry in SuiteWindows(REGISTRY).windows("agency")] == ["notes.archive", "notes.board", "notes.list"]


def test_an_unavailable_window_is_offered_with_its_reason():
    archive = SuiteWindows(REGISTRY).windows("agency")[0]
    assert archive.unavailable_reason == "built for window kit >=2,<3; this viewer has kit 1"


def test_a_layout_for_the_driver_wins_over_the_plain_page_and_a_bundle_falls_back_to_what_it_requires():
    layouts = SuiteWindows(REGISTRY)
    assert layouts.layout("notes", "home", "notes.orchestrator") == ORCHESTRATOR_HOME
    assert layouts.layout("notes", "home", "notes.builder") == HOME
    assert layouts.layout("agency", "home", "notes.builder") == HOME
    assert not layouts.has_layout("notes", "agent", "notes.builder")

from engine.module.suite import Suite
from engine.viewer.entrance import Entrance
from engine.viewer.layout_shape import tabs
from engine.viewer.preset_set import PresetSet
from engine.viewer.viewer_layout import ViewerLayout
from engine.viewer.viewer_preset import ViewerPreset
from suites.coding.coding_suite import CodingSuite
from suites.coding.entrances.admin_entrance import AdminEntrance


class ChatLayout(ViewerLayout):
    shape = tabs("messages.chat")


class TasksLayout(ViewerLayout):
    shape = tabs("tasks.tasks")


class TasksPreset(ViewerPreset):
    key, name, text, shape = "tasks", "Tasks", "The tasks alone", tabs("tasks.tasks")


class TasksPresets(PresetSet):
    presets = [TasksPreset]


class FirstEntrance(Entrance):
    key = "first"
    windows = ["messages.chat", "tasks.tasks"]
    layouts = {"home": ChatLayout}


class SecondEntrance(Entrance):
    key = "second"
    windows = ["tasks.tasks", "plans.plans"]
    layouts = {"home": TasksLayout, "phone": TasksLayout}
    presets = {"home": TasksPresets}


class TwoEntrancesSuite(Suite):
    name = "two"
    entrances = [FirstEntrance, SecondEntrance]


def test_the_coding_suite_holds_only_its_admin_entrance_with_the_parts_its_modules_add():
    assert {entrance.key for entrance in CodingSuite.entrances} == {AdminEntrance.key} and "windows" not in vars(CodingSuite) and "layouts" not in vars(CodingSuite)


class SecondFirstEntrance(Entrance):
    key = "first"
    windows = ["plans.plans", "messages.chat"]


class SharedKeySuite(Suite):
    name = "shared"
    entrances = [FirstEntrance, SecondFirstEntrance]


def test_entrances_that_share_a_key_are_one_way_in_with_the_windows_of_both():
    assert SharedKeySuite.entrance_windows() == {"first": ("messages.chat", "tasks.tasks", "plans.plans")}


def test_a_suite_offers_the_windows_of_its_entrances_once_each_in_order():
    assert TwoEntrancesSuite.offered_windows() == ("messages.chat", "tasks.tasks", "plans.plans")


def test_the_first_entrance_gives_a_page_its_default_layout_and_a_later_one_adds_pages():
    assert TwoEntrancesSuite.default_layouts() == {"home": ChatLayout.shape, "phone": TasksLayout.shape}


def test_the_presets_and_windows_of_each_entrance_are_kept_by_its_key():
    assert TwoEntrancesSuite.offered_presets() == {"home": (TasksPreset.layout_preset(),)}
    assert TwoEntrancesSuite.entrance_windows() == {"first": ("messages.chat", "tasks.tasks"), "second": ("tasks.tasks", "plans.plans")}

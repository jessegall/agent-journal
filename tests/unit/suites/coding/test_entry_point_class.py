from engine.module.suite import Suite
from engine.viewer.entry_point import EntryPoint
from engine.viewer.layout_shape import tabs
from engine.viewer.preset_set import PresetSet
from engine.viewer.viewer_layout import ViewerLayout
from engine.viewer.viewer_preset import ViewerPreset
from suites.coding.coding_suite import CodingSuite
from suites.coding.entry_points.admin_entry_point import AdminEntryPoint


class ChatLayout(ViewerLayout):
    shape = tabs("messages.chat")


class TasksLayout(ViewerLayout):
    shape = tabs("tasks.tasks")


class TasksPreset(ViewerPreset):
    key, name, text, shape = "tasks", "Tasks", "The tasks alone", tabs("tasks.tasks")


class TasksPresets(PresetSet):
    presets = [TasksPreset]


class FirstEntryPoint(EntryPoint):
    key = "first"
    windows = ["messages.chat", "tasks.tasks"]
    layouts = {"home": ChatLayout}


class SecondEntryPoint(EntryPoint):
    key = "second"
    windows = ["tasks.tasks", "plans.plans"]
    layouts = {"home": TasksLayout, "phone": TasksLayout}
    presets = {"home": TasksPresets}


class TwoEntryPointsSuite(Suite):
    name = "two"
    entry_points = [FirstEntryPoint, SecondEntryPoint]


def test_the_coding_suite_holds_only_its_admin_entry_point_with_the_parts_its_modules_add():
    assert {entry_point.key for entry_point in CodingSuite.entry_points} == {AdminEntryPoint.key} and "windows" not in vars(CodingSuite) and "layouts" not in vars(CodingSuite)


class SecondFirstEntryPoint(EntryPoint):
    key = "first"
    windows = ["plans.plans", "messages.chat"]


class SharedKeySuite(Suite):
    name = "shared"
    entry_points = [FirstEntryPoint, SecondFirstEntryPoint]


def test_entry_points_that_share_a_key_are_one_way_in_with_the_windows_of_both():
    assert SharedKeySuite.entry_point_windows() == {"first": ("messages.chat", "tasks.tasks", "plans.plans")}


def test_a_suite_offers_the_windows_of_its_entry_points_once_each_in_order():
    assert TwoEntryPointsSuite.offered_windows() == ("messages.chat", "tasks.tasks", "plans.plans")


def test_the_first_entry_point_gives_a_page_its_default_layout_and_a_later_one_adds_pages():
    assert TwoEntryPointsSuite.default_layouts() == {"home": ChatLayout.shape, "phone": TasksLayout.shape}


def test_the_presets_and_windows_of_each_entry_point_are_kept_by_its_key():
    assert TwoEntryPointsSuite.offered_presets() == {"home": (TasksPreset.layout_preset(),)}
    assert TwoEntryPointsSuite.entry_point_windows() == {"first": ("messages.chat", "tasks.tasks"), "second": ("tasks.tasks", "plans.plans")}

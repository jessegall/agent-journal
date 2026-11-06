from core.base.driver.suite import Suite
from core.base.module.module import Module
from core.base.viewer.button_declaration import ButtonDeclaration
from core.base.viewer.skeleton_part import SkeletonPart
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_loading import WindowLoading
from core.base.viewer.window_place import WindowPlace

MODULE_FILE = "tests.stories.core.modules.viewer.support.section_modules"
UNKNOWN_SLOT = f"{MODULE_FILE}:UnknownSlotModule"
UNDEPENDED_SLOT = f"{MODULE_FILE}:UndependedSlotModule"
SLOTLESS_MODULE = f"{MODULE_FILE}:NoSlotModule"
PANE_WITH_SLOTS = f"{MODULE_FILE}:PaneWithSlotsModule"
SECTION_SUITE_MODULE = f"{MODULE_FILE}:SuiteNamesASectionModule"
BUTTON_ON_AN_INSPECTOR_SLOT = f"{MODULE_FILE}:ButtonOnAnInspectorSlotModule"
GOOD_SECTION = f"{MODULE_FILE}:GoodSectionModule"


def section(name: str, *slots: str, place: WindowPlace = WindowPlace.SECTION) -> WindowDeclaration:
    return WindowDeclaration(name, "Sample section", "board.html", WindowLoading.FRAME, place=place, slots=slots, skeleton=tuple([SkeletonPart.line()]))


class UnknownSlotModule(Module):
    name = "wrong_slot"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.plans"]
    windows = [section("wrong_slot.notes", "inspector.plna")]


class UndependedSlotModule(Module):
    name = "not_depending"
    requires_core = ">=5,<6"
    windows = [section("not_depending.notes", "inspector.plan")]


class NoSlotModule(Module):
    name = "no_slot"
    requires_core = ">=5,<6"
    windows = [section("no_slot.notes")]


class PaneWithSlotsModule(Module):
    name = "pane_slots"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.plans"]
    windows = [section("pane_slots.notes", "inspector.plan", place=WindowPlace.PANE)]


class SectionSuite(Suite):
    name = "sections"
    windows = ["section_suite.notes"]


class SuiteNamesASectionModule(Module):
    name = "section_suite"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.plans"]
    suites = [SectionSuite]
    windows = [section("section_suite.notes", "inspector.plan")]


class ButtonOnAnInspectorSlotModule(Module):
    name = "inspector_button"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.plans"]
    buttons = [ButtonDeclaration("inspector_button.press", tuple(["inspector.plan"]), "Press", "plan show {row_id}")]


class GoodSectionModule(Module):
    name = "good_section"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.plans"]
    windows = [section("good_section.notes", "inspector.plan")]

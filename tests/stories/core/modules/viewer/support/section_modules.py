from engine.driver.suite import Suite
from engine.module.module import Module
from engine.viewer.button_declaration import ButtonDeclaration
from engine.viewer.skeleton_part import SkeletonPart
from engine.viewer.window_declaration import WindowDeclaration
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace

MODULE_FILE = "tests.stories.core.modules.viewer.support.section_modules"
UNKNOWN_SLOT = f"{MODULE_FILE}:UnknownSlotModule"
UNDEPENDED_SLOT = f"{MODULE_FILE}:UndependedSlotModule"
SLOTLESS_MODULE = f"{MODULE_FILE}:NoSlotModule"
PANE_WITH_SLOTS = f"{MODULE_FILE}:SlotsModulePane"
SECTION_SUITE_MODULE = f"{MODULE_FILE}:SuiteNamesSectionModule"
INSPECTOR_SLOT_BUTTON = f"{MODULE_FILE}:InspectorSlotModuleButton"
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


class SlotsModulePane(Module):
    name = "pane_slots"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.plans"]
    windows = [section("pane_slots.notes", "inspector.plan", place=WindowPlace.PANE)]


class SectionSuite(Suite):
    name = "sections"
    windows = ["section_suite.notes"]


class SuiteNamesSectionModule(Module):
    name = "section_suite"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.plans"]
    suites = [SectionSuite]
    windows = [section("section_suite.notes", "inspector.plan")]


class InspectorSlotModuleButton(Module):
    name = "inspector_button"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.plans"]
    buttons = [ButtonDeclaration("inspector_button.press", tuple(["inspector.plan"]), "Press", "plan show {row_id}")]


class GoodSectionModule(Module):
    name = "good_section"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.plans"]
    windows = [section("good_section.notes", "inspector.plan")]

from engine.module.module import Module
from engine.viewer.button_declaration import ButtonDeclaration
from engine.viewer.inspector_component import InspectorComponent
from engine.viewer.inspector_declaration import InspectorDeclaration
from engine.viewer.skeleton_part import SkeletonPart
from engine.viewer.window_declaration import WindowDeclaration
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from core.modules.reminders.models.reminder import Reminder

PATH = "tests.stories.engine.viewer.support.inspector_faults"
DEPENDENCIES = ["journal.core.reminders", "journal.core.plans", "journal.core.viewer"]


def window(name: str, place: WindowPlace) -> WindowDeclaration:
    slots = ["inspector.reminder"] if place is WindowPlace.SECTION else []
    return WindowDeclaration(name, "Board", "board.html", WindowLoading.FRAME, place=place, skeleton=[SkeletonPart.line()], slots=slots)


def action(label: str = "Start the reminder", icon: str = "start", **fields: object) -> ButtonDeclaration:
    return ButtonDeclaration("shown.start", (), label, "reminder delete {row_id}", icon=icon, **fields)


class FirstModule(Module):
    name = "first"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    inspectors = [InspectorDeclaration(Reminder)]


class SecondModule(FirstModule):
    name = "second"


class DisplayedModule(Module):
    name = "shown"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    windows = [window("shown.chain", WindowPlace.SECTION), window("shown.board", WindowPlace.PANE)]
    inspectors = [InspectorDeclaration(Reminder, components=[InspectorComponent("shown.chain")], actions=[action()])]


class ValidModule(DisplayedModule):
    inspectors = [InspectorDeclaration(Reminder, reads="reminder list", events=["reminder.*"], components=[InspectorComponent("shown.chain", tab="Chain")], actions=[action()])]


class PaneComponentModule(DisplayedModule):
    inspectors = [InspectorDeclaration(Reminder, components=[InspectorComponent("shown.board")])]


class UnrelatedWindowModule(Module):
    name = "stranger"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    windows = [window("stranger.chain", WindowPlace.SECTION)]


class ForeignComponentModule(DisplayedModule):
    name = "borrower"
    windows = []
    inspectors = [InspectorDeclaration(Reminder, components=[InspectorComponent("stranger.chain")])]


class UnknownReadModule(DisplayedModule):
    inspectors = [InspectorDeclaration(Reminder, reads="reminder fly")]


class UnknownEventModule(DisplayedModule):
    inspectors = [InspectorDeclaration(Reminder, events=["rocket.launch"])]


class SecondRowModule(DisplayedModule):
    inspectors = [InspectorDeclaration(Reminder, actions=[ButtonDeclaration("shown.start", tuple(["row.plan"]), "Start the reminder", "reminder delete {row_id}", icon="start")])]


class NoIconModule(DisplayedModule):
    inspectors = [InspectorDeclaration(Reminder, actions=[action(icon="")])]


class UnknownIconModule(DisplayedModule):
    inspectors = [InspectorDeclaration(Reminder, actions=[action(icon="rocket")])]


class PanelWordModule(DisplayedModule):
    inspectors = [InspectorDeclaration(Reminder, actions=[action(label="Close the reminder")])]

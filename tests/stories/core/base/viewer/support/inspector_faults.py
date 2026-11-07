from core.base.module.module import Module
from core.base.viewer.button_declaration import ButtonDeclaration
from core.base.viewer.inspector_component import InspectorComponent
from core.base.viewer.inspector_declaration import InspectorDeclaration
from core.base.viewer.skeleton_part import SkeletonPart
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_loading import WindowLoading
from core.base.viewer.window_place import WindowPlace
from core.modules.reminders.models.reminder import Reminder

PATH = "tests.stories.core.base.viewer.support.inspector_faults"
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


class ShownModule(Module):
    name = "shown"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    windows = [window("shown.chain", WindowPlace.SECTION), window("shown.board", WindowPlace.PANE)]
    inspectors = [InspectorDeclaration(Reminder, components=[InspectorComponent("shown.chain")], actions=[action()])]


class ValidModule(ShownModule):
    inspectors = [InspectorDeclaration(Reminder, reads="reminder list", events=["reminder.*"], components=[InspectorComponent("shown.chain", tab="Chain")], actions=[action()])]


class PaneComponentModule(ShownModule):
    inspectors = [InspectorDeclaration(Reminder, components=[InspectorComponent("shown.board")])]


class UnrelatedWindowModule(Module):
    name = "stranger"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    windows = [window("stranger.chain", WindowPlace.SECTION)]


class ForeignComponentModule(ShownModule):
    name = "borrower"
    windows = []
    inspectors = [InspectorDeclaration(Reminder, components=[InspectorComponent("stranger.chain")])]


class UnknownReadModule(ShownModule):
    inspectors = [InspectorDeclaration(Reminder, reads="reminder fly")]


class UnknownEventModule(ShownModule):
    inspectors = [InspectorDeclaration(Reminder, events=["rocket.launch"])]


class OtherRowModule(ShownModule):
    inspectors = [InspectorDeclaration(Reminder, actions=[ButtonDeclaration("shown.start", ("row.plan",), "Start the reminder", "reminder delete {row_id}", icon="start")])]


class NoIconModule(ShownModule):
    inspectors = [InspectorDeclaration(Reminder, actions=[action(icon="")])]


class UnknownIconModule(ShownModule):
    inspectors = [InspectorDeclaration(Reminder, actions=[action(icon="rocket")])]


class PanelWordModule(ShownModule):
    inspectors = [InspectorDeclaration(Reminder, actions=[action(label="Close the reminder")])]

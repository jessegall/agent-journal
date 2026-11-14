from engine.module.module import Module
from engine.viewer.inspector_component import InspectorComponent
from engine.viewer.inspector_declaration import InspectorDeclaration
from engine.enums.inspector_width import InspectorWidth
from core.modules.reminders.models.reminder import Reminder
from tests.stories.engine.viewer.support.inspector_faults import DEPENDENCIES, window
from engine.enums.window_place import WindowPlace

PATH = "tests.stories.engine.viewer.support.inspector_listing_modules"


class DeclaringModule(Module):
    name = "declaring"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    windows = [window("declaring.chain", WindowPlace.SECTION)]
    inspectors = [InspectorDeclaration(Reminder, label="Reminder {id}", description="{text}", width=InspectorWidth.LARGE, comments=True,
                                       components=[InspectorComponent("declaring.chain", tab="Chain")])]

from core.base.module.module import Module
from core.base.viewer.inspector_component import InspectorComponent
from core.base.viewer.inspector_declaration import InspectorDeclaration
from core.base.viewer.inspector_width import InspectorWidth
from core.modules.reminders.models.reminder import Reminder
from tests.stories.core.base.viewer.support.inspector_faults import DEPENDENCIES, window
from core.base.viewer.window_place import WindowPlace

PATH = "tests.stories.core.base.viewer.support.inspector_listing_modules"


class DeclaringModule(Module):
    name = "declaring"
    requires_core = ">=5,<6"
    dependencies = DEPENDENCIES
    windows = [window("declaring.chain", WindowPlace.SECTION)]
    inspectors = [InspectorDeclaration(Reminder, label="Reminder {id}", description="{text}", width=InspectorWidth.LARGE, comments=True,
                                       components=[InspectorComponent("declaring.chain", tab="Chain")])]

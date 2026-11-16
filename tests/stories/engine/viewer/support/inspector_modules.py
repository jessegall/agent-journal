from engine.module.module import Module
from engine.viewer.inspector_declaration import InspectorDeclaration
from core.modules.reminders.models.reminder import Reminder

PATH = "tests.stories.engine.viewer.support.inspector_modules"
DEPENDENCIES = ["journal.core.tasks", "journal.core.plans", "journal.core.viewer"]


class PlainModule(Module):
    name = "plain"
    requires_engine = ">=6,<7"
    dependencies = DEPENDENCIES


class InspectorModule(PlainModule):
    name = "inspected"
    inspectors = [InspectorDeclaration(Reminder)]

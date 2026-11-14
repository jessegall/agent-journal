from engine.module.module import Module
from engine.module.suite import Suite
from engine.viewer.entrance import Entrance
from suites.coding.entrances.admin_entrance import AdminEntrance


class ReviewEntrance(Entrance):
    """A made-up second way in that offers only the chat and the tasks."""

    key = "review"
    windows = ["messages.chat", "tasks.tasks"]


class FrontDeskModule(Module):
    name = "sample.front-desk"
    requires_engine = ">=5,<6"
    dependencies = ["journal.suites.coding"]


class FrontDeskSuite(Suite):
    """A made-up suite with the admin entrance of the coding suite and a second entrance beside it."""

    name = "front-desk"
    modules = [FrontDeskModule]
    requires = ["coding"]
    entrances = [AdminEntrance, ReviewEntrance]

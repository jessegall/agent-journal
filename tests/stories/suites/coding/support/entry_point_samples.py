from engine.module.module import Module
from engine.module.suite import Suite
from engine.viewer.entry_point import EntryPoint
from suites.coding.entry_points.admin_entry_point import AdminEntryPoint


class ReviewEntryPoint(EntryPoint):
    """A made-up second way in that offers only the chat and the tasks."""

    key = "review"
    windows = ["messages.chat", "tasks.tasks"]


class FrontDeskModule(Module):
    name = "sample.front-desk"
    requires_engine = ">=5,<6"
    dependencies = ["journal.suites.coding"]


class FrontDeskSuite(Suite):
    """A made-up suite with the admin entry point of the coding suite and a second entry point beside it."""

    name = "front-desk"
    modules = [FrontDeskModule]
    requires = ["coding"]
    entry_points = [AdminEntryPoint, ReviewEntryPoint]

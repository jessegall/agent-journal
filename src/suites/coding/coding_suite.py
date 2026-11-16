from engine.module.suite import Suite
from suites.coding.support.next_task import NextTask
from suites.coding.support.coding_settings_sections import CODING_SETTINGS_SECTIONS
from suites.coding.coding_module import CodingModule
from suites.coding.modules.checks.checks_module import ChecksModule
from suites.coding.modules.workers.workers_module import WorkersModule
from suites.coding.support.coding_suite_name import CODING_SUITE_NAME
from suites.coding.entry_points.admin_entry_point import AdminEntryPoint
from suites.coding.modules.workers.entry_points.workers_admin_entry_point import WorkersAdminEntryPoint
from suites.coding.modules.checks.entry_points.checks_admin_entry_point import ChecksAdminEntryPoint


class CodingSuite(Suite):
    """Building software: the main agent works from its work controls and starts workers and the merger,
    while helpers read for it; the viewer shows its chat,
    tasks, plans, agents, questions and their activity and file edits, a phone layout, and version 4's
    layout presets."""

    name = CODING_SUITE_NAME
    modules = [CodingModule, WorkersModule, ChecksModule]
    task_assigner = NextTask
    entry_points = [AdminEntryPoint, WorkersAdminEntryPoint, ChecksAdminEntryPoint]
    settings_sections = CODING_SETTINGS_SECTIONS

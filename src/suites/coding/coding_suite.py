from engine.module.suite import Suite
from suites.coding.default_states.main_where_you_stand import MainWhereYouStand
from suites.coding.modules.workers.default_states.worker_log_due_default import WorkerLogDueDefault
from suites.coding.support.next_task import NextTask
from suites.coding.coding_module import CodingModule
from suites.coding.modules.checks.checks_module import ChecksModule
from suites.coding.modules.workers.workers_module import WorkersModule
from suites.coding.support.coding_suite_name import CODING_SUITE_NAME
from suites.coding.entrances.admin_entrance import AdminEntrance
from suites.coding.modules.workers.entrances.workers_admin_entrance import WorkersAdminEntrance
from suites.coding.modules.checks.entrances.checks_admin_entrance import ChecksAdminEntrance


class CodingSuite(Suite):
    """Building software: the main agent works from its work controls and starts workers and the merger,
    while helpers read for it; the viewer shows its chat,
    tasks, plans, agents, questions and their activity and file edits, a phone layout, and version 4's
    layout presets; the main agent and every worker carry a default state of their own."""

    name = CODING_SUITE_NAME
    modules = [CodingModule, WorkersModule, ChecksModule]
    task_assigner = NextTask
    entrances = [AdminEntrance, WorkersAdminEntrance, ChecksAdminEntrance]
    default_states = [MainWhereYouStand, WorkerLogDueDefault]

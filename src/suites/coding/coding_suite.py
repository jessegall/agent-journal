from engine.module.suite import Suite
from engine.module.default_state import DefaultState
from engine.enums.agent_kind import AgentKind
from engine.enums.agent_role import AgentRole
from core.modules.tasks.states.where_you_stand import WhereYouStand
from suites.coding.modules.workers.states.worker_log_due import WorkerLogDue
from suites.coding.modules.workers.types.worker import Worker
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
    default_states = [DefaultState(WhereYouStand, AgentKind.ROLE, AgentRole.MAIN), DefaultState(WorkerLogDue, AgentKind.HELPER_TYPE, Worker.key)]

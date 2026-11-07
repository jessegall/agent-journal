from core.base.change.created import Created
from core.base.command.context import Context
from core.base.guard.guard import Guard
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.settings.bindings.support.setting_values import SettingValues
from suites.coding.modules.workers.support.worker_settings import WORKERS_START_HELPERS
from suites.coding.support.coding_agent_role import CodingAgentRole as AgentRole


class WorkerHelperGuard(Guard[Created[Agent]]):
    """A worker starts no helper while workers may not use ordinary helpers."""

    name = "workers.worker-starts-no-helper"

    def __init__(self, queries: Queries, settings: SettingValues) -> None:
        self.queries, self.settings = queries, settings

    def check(self, event: Created[Agent], context: Context) -> None:
        if event.row.role == AgentRole.HELPER and not self.settings.flag(WORKERS_START_HELPERS) and self.queries.query(Agent).filter(id=context.actor.id, role=AgentRole.WORKER).exists():
            raise Refusal("a worker starts no helper here", "a person turns on journal.suites.coding.workers.workers-start-helpers")

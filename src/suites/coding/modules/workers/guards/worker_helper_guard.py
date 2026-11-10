from core.base.change.created import Created
from engine.command.context import Context
from engine.guard.guard import Guard
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.settings.bindings.support.setting_values import SettingValues
from suites.coding.modules.workers.support.worker_settings import WORKERS_START_HELPERS
from suites.coding.support.coding_helper_role import CodingHelperRole


class WorkerHelperGuard(Guard[Created[Agent]]):
    """A worker starts no read-only helper while workers may not use read-only helpers."""

    name = "workers.worker-starts-no-helper"

    def __init__(self, queries: Queries, settings: SettingValues) -> None:
        self.queries, self.settings = queries, settings

    def check(self, event: Created[Agent], context: Context) -> None:
        if event.row.role == CodingHelperRole.HELPER and not self.settings.flag(WORKERS_START_HELPERS) and self.queries.query(Agent).filter(id=context.actor.id, role=CodingHelperRole.WORKER).exists():
            raise Refusal("a worker starts no read-only helper here", "a person turns on journal.suites.coding.workers.workers-start-read-only-helpers")

import json

from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.modules.drivers.support.nudger import Nudger
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.modules.settings.models.setting import Setting
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_nudges import WORKER_LIMIT_RAISED
from suites.coding.modules.workers.support.worker_settings import DEFAULT_WORKER_COUNT, WORKER_LIMIT
from core.base.change.changed import Changed
from core.base.change.deleted import Deleted
from core.base.command.context import Context


class WorkerCountRaisedListener(SaveListener[Changed[Setting]]):
    """When the worker limit goes up, the main agent of each environment it holds for gets a line naming the new
    limit, how many workers run and how many open tasks are not delegated, so it hands out more."""

    name = "workers.limit-raised"
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, nudger: Nudger, worktrees: WorktreeQuery, settings: SettingValues) -> None:
        self.queries, self.nudger, self.worktrees, self.settings = queries, nudger, worktrees, settings

    def handle(self, event: Changed[Setting], context: Context) -> None:
        if isinstance(event, Deleted):
            return
        setting = event.row
        if setting.key != WORKER_LIMIT:
            return
        limit = int(json.loads(setting.value))
        if limit <= self.previous_limit(event.old_row, setting):
            return
        for agent in self.main_agents(setting):
            self.nudger.send(agent.id, WORKER_LIMIT_RAISED, self.name, context, limit=limit, workers=len(self.worktrees.environment_worktrees()), count=self.undelegated(agent.environment_id))

    # The limit the row replaces: its own old value, else what an environment's row falls back to, the project's.
    def previous_limit(self, old: Model | None, setting: Setting) -> int:
        if old is not None:
            return int(json.loads(old.value))
        if setting.environment_id is None:
            return DEFAULT_WORKER_COUNT
        return self.settings.number(WORKER_LIMIT, None)

    def main_agents(self, setting: Setting) -> tuple[Agent, ...]:
        if setting.environment_id is None:
            return MainAgentFinder.all_running(self.queries)
        return MainAgentFinder.rows(self.queries)

    def undelegated(self, environment_id: int) -> int:
        return self.queries.query(Task).filter(state=TaskState.OPEN).matching(IsNull("delegated_to")).count()

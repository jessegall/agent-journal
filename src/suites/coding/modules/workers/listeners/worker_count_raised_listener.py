import json

from engine.listener.save_listener import SaveListener
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from engine.scope.actor_scope import ActorScope
from engine.scope.environment_scope import EnvironmentScope
from engine.scope.scopes import Scopes
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from engine.driver.nudger import Nudger
from engine.setting.setting_values import SettingValues
from core.modules.settings.models.setting import Setting
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_nudges import WORKER_LIMIT_RAISED
from suites.coding.modules.workers.support.worker_settings import DEFAULT_WORKER_COUNT, WORKER_RUN_LIMIT
from engine.event.changed import Changed
from engine.event.deleted import Deleted
from engine.command.context import Context


class WorkerCountRaisedListener(SaveListener[Changed[Setting]]):
    """When the worker limit goes up, the main agent of each environment it holds for gets a line naming the new
    limit, how many workers run and how many open tasks are not delegated, so it hands out more."""

    name = "workers.limit-raised"
    disabled_scopes = [ActorScope, EnvironmentScope]

    def __init__(self, queries: Queries, nudger: Nudger, worktrees: WorktreeQuery, settings: SettingValues, scopes: Scopes) -> None:
        self.queries, self.nudger, self.worktrees, self.settings, self.scopes = queries, nudger, worktrees, settings, scopes

    def handle(self, event: Changed[Setting], context: Context) -> None:
        if isinstance(event, Deleted):
            return
        setting = event.row
        if setting.key != WORKER_RUN_LIMIT:
            return
        limit = int(json.loads(setting.value))
        if limit <= self.previous_limit(event.old_row, setting):
            return
        for agent in self.main_agents(setting):
            with self.scopes.opened(None, agent.environment_id):
                self.nudger.send(agent.id, WORKER_LIMIT_RAISED, self.name, context, limit=limit, workers=len(self.worktrees.open_worktrees()), count=self.undelegated())

    # The limit the row replaces: its own old value, else what an environment's row falls back to, the project's.
    def previous_limit(self, old: Setting | None, setting: Setting) -> int:
        if old is not None:
            return int(json.loads(old.value))
        if setting.environment_id is None:
            return DEFAULT_WORKER_COUNT
        return self.settings.project.number(WORKER_RUN_LIMIT)

    def main_agents(self, setting: Setting) -> tuple[Agent, ...]:
        return tuple(agent for agent in MainAgentFinder.all_running(self.queries) if setting.environment_id in (None, agent.environment_id))

    def undelegated(self) -> int:
        return self.queries.query(Task).filter(state=TaskState.OPEN).matching(IsNull("delegated_to")).count()

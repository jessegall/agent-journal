import json

from core.base.agent_role import AgentRole
from core.base.change.change import Change
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.drivers.support.nudger import Nudger
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.modules.settings.models.setting import Setting
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_nudges import WORKER_LIMIT_RAISED
from suites.coding.modules.workers.support.worker_settings import DEFAULT_WORKER_COUNT, WORKER_LIMIT


class WorkerLimitListener(SaveListener):
    """When the worker limit goes up, the main agent of each environment it holds for gets a line naming the new
    limit, how many workers run and how many open tasks are not delegated, so it hands out more."""

    name = "workers.limit-raised"
    event = "setting.*"
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, nudger: Nudger, worktrees: WorktreeQuery, settings: SettingValues) -> None:
        self.queries, self.nudger, self.worktrees, self.settings = queries, nudger, worktrees, settings

    def handle(self, change: Change[Model]) -> None:
        setting = change.new_row
        if not isinstance(setting, Setting) or setting.key != WORKER_LIMIT:
            return
        limit = int(json.loads(setting.value))
        if limit <= self.previous_limit(change.old_row, setting):
            return
        for agent in self.main_agents(setting):
            self.nudger.send(agent.id, WORKER_LIMIT_RAISED, self.name, change.context, limit=limit, workers=len(self.worktrees.environment_worktrees(agent.environment_id)), count=self.undelegated(agent.environment_id))

    def previous_limit(self, old: Model | None, setting: Setting) -> int:
        """The limit the row replaces: its own old value, else what an environment's row falls back to, the project's."""
        if isinstance(old, Setting):
            return int(json.loads(old.value))
        if setting.environment_id is None:
            return DEFAULT_WORKER_COUNT
        return self.settings.number(WORKER_LIMIT, None)

    def main_agents(self, setting: Setting) -> tuple[Agent, ...]:
        agents = self.queries.query(Agent).filter(role=AgentRole.MAIN).matching(IsNull("ended_at"))
        if setting.environment_id is not None:
            agents = agents.filter(environment_id=setting.environment_id)
        return tuple(agents.all_rows())

    def undelegated(self, environment_id: int) -> int:
        return self.queries.query(Task).filter(environment_id=environment_id, state=TaskState.OPEN).matching(IsNull("delegated_to")).count()

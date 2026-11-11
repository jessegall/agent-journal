from engine.enums.agent_role import AgentRole
from engine.listener.rows.event_rows import EventRows
from core.modules.agents.models.agent import Agent
from core.modules.processes.support.run_waits import RunWaits
from engine.setting.setting_values import SettingValues
from suites.coding.modules.workers.support.worker_settings import WORKER_RUN_WAIT


class WorkerRunWaits(RunWaits):
    """Every agent but a main agent waits the workers' setting for its test or build."""

    def __init__(self, rows: EventRows, settings: SettingValues) -> None:
        self.rows, self.settings = rows, settings

    def seconds(self, agent_id: int) -> int | None:
        if self.rows.required(Agent, agent_id).role == AgentRole.MAIN:
            return None
        return int(self.settings.number(WORKER_RUN_WAIT))

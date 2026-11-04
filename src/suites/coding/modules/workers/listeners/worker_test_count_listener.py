from suites.coding.support.coding_agent_role import CodingAgentRole as AgentRole
from core.base.change.change import Change
from core.base.command.bus import Bus
from core.base.driver.command_category import CommandCategory
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.drivers.support.nudger import Nudger
from core.modules.processes.commands.stop_process.stop_process import StopProcess
from core.modules.processes.models.enums.process_state import RUNNING_STATES
from core.modules.processes.models.output import Output
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.settings.bindings.support.setting_values import SettingValues
from suites.coding.modules.workers.support.worker_settings import WORKER_TEST_LIMIT
from suites.coding.modules.workers.support.test_limit_nudges import TEST_LIMIT_STOP, WORKER_TEST_LIMIT_SOURCE


class WorkerTestCountListener(SaveListener):
    """Stops a worker's own test run when its reader counts more tests than allowed."""

    name = WORKER_TEST_LIMIT_SOURCE
    event = "output.*"
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, settings: SettingValues, bus: Bus, nudger: Nudger) -> None:
        self.queries, self.settings, self.bus, self.nudger = queries, settings, bus, nudger

    def handle(self, change: Change[Model]) -> None:
        output = change.new_row
        if not isinstance(output, Output) or not output.test_count:
            return
        if isinstance(change.old_row, Output) and change.old_row.test_count == output.test_count:
            return
        process = self.queries.query(Process).find(output.process_id)
        if process.state not in RUNNING_STATES or process.creator_id != process.agent_id:
            return
        agent = self.queries.query(Agent).find(process.agent_id)
        limit = self.settings.number(WORKER_TEST_LIMIT, process.environment_id)
        if agent.role != AgentRole.WORKER or not 0 < limit < output.test_count:
            return
        parts = self.queries.query(ProcessPart).filter(process_id=process.id, category=CommandCategory.TEST_RUN)
        if output.reader_position:
            parts = parts.filter(position=output.reader_position)
        if not parts.exists():
            return
        self.nudger.send(process.agent_id, TEST_LIMIT_STOP, self.name, change.context, output=process.id, count=output.test_count, limit=limit)
        self.bus.dispatch(StopProcess(process.id), change.context)

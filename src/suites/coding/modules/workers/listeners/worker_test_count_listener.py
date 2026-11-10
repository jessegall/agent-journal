from suites.coding.support.coding_helper_role import CodingHelperRole
from engine.command.bus import Bus
from engine.driver.command_category import CommandCategory
from engine.listener.save_listener import SaveListener
from engine.listener.event_rows import EventRows
from engine.query.queries import Queries
from engine.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.drivers.support.nudger import Nudger
from core.modules.processes.commands.stop_process.stop_process import StopProcess
from core.modules.processes.models.enums.process_state import RUNNING_STATES
from core.modules.processes.models.output import Output
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from engine.setting.setting_values import SettingValues
from suites.coding.support.coding_settings import WORKER_TEST_LIMIT
from suites.coding.modules.workers.support.test_limit_nudges import TEST_LIMIT_STOP, WORKER_TEST_LIMIT_SOURCE
from engine.change.changed import Changed
from engine.change.deleted import Deleted
from engine.command.context import Context


class WorkerTestCountListener(SaveListener[Changed[Output]]):
    """Stops a worker's own test run when its reader counts more tests than allowed."""

    name = WORKER_TEST_LIMIT_SOURCE
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, settings: SettingValues, bus: Bus, nudger: Nudger, rows: EventRows) -> None:
        self.queries, self.settings, self.bus, self.nudger = queries, settings, bus, nudger
        self.rows = rows

    def handle(self, event: Changed[Output], context: Context) -> None:
        if isinstance(event, Deleted):
            return
        output = event.row
        if not output.test_count:
            return
        if event.old_row is not None and event.old_row.test_count == output.test_count:
            return
        process = self.rows.required(Process, output.process_id)
        if process.state not in RUNNING_STATES or process.creator_id != process.session_agent_id:
            return
        agent = self.rows.required(Agent, process.session_agent_id)
        limit = self.settings.number(WORKER_TEST_LIMIT)
        if agent.role != CodingHelperRole.WORKER or not 0 < limit < output.test_count:
            return
        parts = self.queries.query(ProcessPart).filter(process_id=process.id, category=CommandCategory.TEST_RUN)
        if output.reader_position:
            parts = parts.filter(position=output.reader_position)
        if not parts.exists():
            return
        self.nudger.send(process.session_agent_id, TEST_LIMIT_STOP, self.name, context, output=process.id, count=output.test_count, limit=limit)
        self.bus.dispatch(StopProcess(process.id), context)

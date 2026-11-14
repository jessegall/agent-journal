from core.modules.processes.support.execution_status import ExecutionStatus
from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.cli.agent_number import AgentNumber
from engine.row.page import Page
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from engine.query.query import Query
from engine.errors.refusal import Refusal
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.drivers.support.suite_choice import SuiteChoice
from core.modules.environments.models.environment import Environment
from core.modules.processes.models.enums.process_setting import ProcessSetting
from core.modules.processes.models.process_queue_row import ProcessQueueRow
from core.modules.processes.models.enums.queue_section import QueueSection
from core.modules.processes.support.active_queue_runs import ActiveQueueRuns
from core.modules.processes.support.process_queue_page import ProcessQueuePage
from core.modules.processes.support.process_settings import ProcessSettings
from core.modules.processes.support.queue_inspector_json import QueueInspectorJson
from core.modules.processes.support.run_queue_halt import RunQueueHalt
from engine.setting.setting_values import SettingValues
from core.modules.settings.support.setting_catalogue import SettingCatalogue

QUEUE_REASON = "the queue shows every run that has not ended and every queued run"

MAX_PAGE_SIZE = 100
RECENT_RUNS = 20


class ListRunQueueSubcommand(ReadSubcommand[ProcessQueuePage]):
    """Reads the short and long lanes, what runs and waits in each and the waits of the last hour, with the queue
    controls and ordered inspector lists the queue page reads; with an agent, only that agent's runs, and with a
    class or a starter, only the lines of that class or starter. JSON: the inspector fields, page, size, total, rows,
    and lanes, the lines as text."""

    cli_name = "queue"
    name = "list"
    environment_refusal = "the process queue needs an environment"

    def __init__(self, queries: Queries, settings: ProcessSettings, halt: RunQueueHalt, suites: SuiteChoice, catalogue: SettingCatalogue, values: SettingValues, queue_runs: ActiveQueueRuns,
                 status: ExecutionStatus) -> None:
        self.queries, self.settings, self.halt, self.queue_runs, self.status = queries, settings, halt, queue_runs, status
        self.suites, self.catalogue, self.values = suites, catalogue, values

    def suite_limits(self) -> list[dict[str, object]]:
        entries = (self.catalogue.value(key) for key in self.suites.agent_policy().queue_limit_settings)
        return [{"key": entry.key, "title": entry.title, "description": entry.description, "value": self.values.value(entry.key)} for entry in entries]

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--limit", type=int, default=50)
        parser.add_argument("--page", type=int, default=1)
        parser.add_argument("--recent", type=int, default=RECENT_RUNS)
        parser.add_argument("--class", dest="class_name", default="", help="only the runs and waits of this class")
        parser.add_argument("--starter", default="", help="only the runs and waits of this starter, such as main agent or worker 3")
        parser.add_argument("--agent", type=AgentNumber, default=0)

    def read(self, arguments: Namespace, caller: Caller) -> ProcessQueuePage:
        environment_id = self.queries.database.scope_environment_id
        if environment_id is None:
            raise Refusal(self.environment_refusal)
        query = self.agent_rows(self.queries.query(ProcessQueueRow), arguments.agent)
        active = tuple(query.matching(IsNull("ended_at")).every_row(QUEUE_REASON))
        running = [row.inspector_json() for row in active if row.section is QueueSection.RUNNING]
        waiting = [row.inspector_json() for row in active if row.section is QueueSection.WAITING]
        recent = [row.inspector_json() for row in self.recent_rows(query, max(1, arguments.recent))]
        inspector: QueueInspectorJson = {
            "environment_id": environment_id,
            "environment_name": self.queries.query(Environment).find(environment_id).name,
            "parallel_limit": self.settings.integer(ProcessSetting.RUN_BATCH_SIZE),
            "limit_setting": ProcessSetting.RUN_BATCH_SIZE.key, "suite_limits": self.suite_limits(),
            "used_slots": sum(bool(row["uses_slot"]) for row in running), "waiting_count": len(waiting),
            "halted": self.halt.is_halted, "halt_state": "halted" if self.halt.is_halted else "running", "halt_reason": self.halt.reason, "halt_cause": self.halt.halt_type,
            "running": running, "waiting": waiting, "recent": recent, "recent_total": query.filter(section=QueueSection.RECENT).count()}
        queue_runs = tuple(self.queue_runs.query().every_row(QUEUE_REASON))
        number, size = max(1, arguments.page), min(MAX_PAGE_SIZE, max(1, arguments.limit))
        return ProcessQueuePage(Page(queue_runs[(number - 1) * size:number * size], number, size, len(queue_runs)), inspector, self.lane_lines(arguments.class_name, arguments.starter))

    # a filter keeps the lane headings and the lines of runs and waits whose class or starter it names
    def lane_lines(self, class_name: str, starter: str) -> tuple[str, ...]:
        wanted = [text for text in (f"({class_name}, " if class_name else "", f", {starter}" if starter else "") if text]
        return tuple(line for line in self.status.lines() if not line.startswith("  ") or all(text in line for text in wanted))

    @staticmethod
    def agent_rows(query: Query[ProcessQueueRow], agent_id: int) -> Query[ProcessQueueRow]:
        if not agent_id:
            return query
        return query.filter(session_agent_id=agent_id)

    def recent_rows(self, query: Query[ProcessQueueRow], count: int) -> list[ProcessQueueRow]:
        return query.filter(section=QueueSection.RECENT).descending("ended_at", "id").take(count)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, ProcessQueuePage):
            halted = [f"the queue is halted: {value.inspector['halt_reason']}"] if value.inspector["halted"] else []
            output.write("\n".join([*halted, *value.lanes]), value.json())

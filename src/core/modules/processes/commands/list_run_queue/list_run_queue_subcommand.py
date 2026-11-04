from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.page import Page
from core.base.query.conditions.among import Among
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.query.query import Query
from core.base.refusal import Refusal
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.environments.models.environment import Environment
from core.modules.processes.models.support.process_setting import ProcessSetting
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_queue_row import ProcessQueueRow
from core.modules.processes.models.enums.queue_section import QueueSection
from core.modules.processes.support.process_queue_page import ProcessQueuePage
from core.modules.processes.support.process_settings import ProcessSettings
from core.modules.processes.support.queue_inspector_json import QueueInspectorJson
from core.modules.processes.support.run_queue_halt import RunQueueHalt

MAX_PAGE_SIZE = 100
RECENT_RUNS = 10


class ListRunQueueSubcommand(ReadSubcommand[ProcessQueuePage]):
    """Reads queue controls and ordered inspector lists, with a page of active queued commands for the CLI."""

    cli_name = "queue"
    name = "list"

    def __init__(self, queries: Queries, settings: ProcessSettings, halt: RunQueueHalt) -> None:
        self.queries, self.settings, self.halt = queries, settings, halt

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--environment-id", type=int)
        parser.add_argument("--limit", type=int, default=50)
        parser.add_argument("--page", type=int, default=1)

    def read(self, arguments: Namespace, caller: Caller) -> ProcessQueuePage:
        environment_id = arguments.environment_id if arguments.environment_id is not None else caller.environment_id
        if environment_id is None:
            raise Refusal("the process queue needs an environment", "queue list --environment-id <number>")
        main_spots = self.settings.flag(ProcessSetting.MAIN_RUNS_USE_SLOTS, environment_id)
        query = self.queries.query(ProcessQueueRow).filter(environment_id=environment_id)
        active = tuple(query.matching(IsNull("ended_at")).oldest().all_rows())
        running = [row.inspector_json(main_spots) for row in active if row.section is QueueSection.RUNNING]
        waiting = [row.inspector_json(main_spots) for row in active if row.section is QueueSection.WAITING]
        recent = [row.inspector_json(main_spots) for row in self.recent_rows(query, environment_id)]
        inspector: QueueInspectorJson = {
            "environment_id": environment_id,
            "environment_name": self.queries.query(Environment).find(environment_id).name,
            "parallel_limit": self.settings.integer(ProcessSetting.RUN_BATCH_SIZE, environment_id),
            "limit_setting": ProcessSetting.RUN_BATCH_SIZE.key,
            "count_main_runs": main_spots, "main_spots_setting": ProcessSetting.MAIN_RUNS_USE_SLOTS.key,
            "used_slots": sum(bool(row["uses_slot"]) for row in running), "waiting_count": len(waiting),
            "halted": self.halt.is_halted, "halt_reason": self.halt.reason,
            "running": running, "waiting": waiting, "recent": recent}
        queue_runs = tuple(row for row in active if row.is_queue_run)
        number, size = max(1, arguments.page), min(MAX_PAGE_SIZE, max(1, arguments.limit))
        return ProcessQueuePage(Page(queue_runs[(number - 1) * size:number * size], number, size, len(queue_runs)), inspector)

    def recent_rows(self, query: Query[ProcessQueueRow], environment_id: int) -> list[ProcessQueueRow]:
        ended = self.queries.query(Process).filter(environment_id=environment_id).descending("ended_at", "id").limited(RECENT_RUNS)
        return query.matching(Among("id", tuple(process.id for process in ended))).filter(section=QueueSection.RECENT).descending("ended_at", "id").limited(RECENT_RUNS)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, ProcessQueuePage):
            output.write("\n".join(f"{process.id}  {process.agent_id}  {process.category.value}  {process.line}" for process in value.page.rows) or "No command waits or runs in this process queue.", value.json())

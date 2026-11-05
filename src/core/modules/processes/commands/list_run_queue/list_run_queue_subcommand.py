from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.page import Page
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.query.query import Query
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.drivers.support.suite_choice import SuiteChoice
from core.modules.environments.models.environment import Environment
from core.modules.processes.models.support.process_setting import ProcessSetting
from core.modules.processes.models.process_queue_row import ProcessQueueRow
from core.modules.processes.models.enums.queue_section import QueueSection
from core.modules.processes.support.process_queue_page import ProcessQueuePage
from core.modules.processes.support.process_settings import ProcessSettings
from core.modules.processes.support.queue_inspector_json import QueueInspectorJson
from core.modules.processes.support.run_queue_halt import RunQueueHalt
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.modules.settings.support.setting_catalogue import SettingCatalogue

MAX_PAGE_SIZE = 100
RECENT_RUNS = 20


class ListRunQueueSubcommand(ReadSubcommand[ProcessQueuePage]):
    """Reads queue controls and ordered inspector lists, with a page of active queued commands for the CLI."""

    cli_name = "queue"
    name = "list"
    environment_refusal = "the process queue needs an environment"

    def __init__(self, queries: Queries, settings: ProcessSettings, halt: RunQueueHalt, suites: SuiteChoice, catalogue: SettingCatalogue, values: SettingValues) -> None:
        self.queries, self.settings, self.halt = queries, settings, halt
        self.suites, self.catalogue, self.values = suites, catalogue, values

    def suite_limits(self, environment_id: int) -> list[dict[str, object]]:
        entries = (self.catalogue.value(key) for key in self.suites.agent_policy(environment_id).queue_limit_settings)
        return [{"key": entry.key, "title": entry.title, "description": entry.description, "value": self.values.value(entry.key, environment_id)} for entry in entries]

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--limit", type=int, default=50)
        parser.add_argument("--page", type=int, default=1)
        parser.add_argument("--recent", type=int, default=RECENT_RUNS)

    def read(self, arguments: Namespace, caller: Caller) -> ProcessQueuePage:
        environment_id = caller.environment_id
        main_spots = self.settings.flag(ProcessSetting.MAIN_RUNS_USE_SLOTS, environment_id)
        query = self.queries.query(ProcessQueueRow)
        active = tuple(query.matching(IsNull("ended_at")).oldest().all_rows())
        running = [row.inspector_json(main_spots) for row in active if row.section is QueueSection.RUNNING]
        waiting = [row.inspector_json(main_spots) for row in active if row.section is QueueSection.WAITING]
        recent = [row.inspector_json(main_spots) for row in self.recent_rows(query, max(1, arguments.recent))]
        inspector: QueueInspectorJson = {
            "environment_id": environment_id,
            "environment_name": self.queries.query(Environment).find(environment_id).name,
            "parallel_limit": self.settings.integer(ProcessSetting.RUN_BATCH_SIZE, environment_id),
            "limit_setting": ProcessSetting.RUN_BATCH_SIZE.key, "suite_limits": self.suite_limits(environment_id),
            "count_main_runs": main_spots, "main_spots_setting": ProcessSetting.MAIN_RUNS_USE_SLOTS.key,
            "used_slots": sum(bool(row["uses_slot"]) for row in running), "waiting_count": len(waiting),
            "halted": self.halt.is_halted, "halt_reason": self.halt.reason,
            "running": running, "waiting": waiting, "recent": recent, "recent_total": query.filter(section=QueueSection.RECENT).page(1, 1).total}
        queue_runs = tuple(row for row in active if row.is_queue_run)
        number, size = max(1, arguments.page), min(MAX_PAGE_SIZE, max(1, arguments.limit))
        return ProcessQueuePage(Page(queue_runs[(number - 1) * size:number * size], number, size, len(queue_runs)), inspector)

    def recent_rows(self, query: Query[ProcessQueueRow], count: int) -> list[ProcessQueueRow]:
        return query.filter(section=QueueSection.RECENT).descending("ended_at", "id").limited(count)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, ProcessQueuePage):
            output.write("\n".join(f"{process.id}  {process.agent_id}  {process.category.value}  {process.line}" for process in value.page.rows) or "No command waits or runs in this process queue.", value.json())

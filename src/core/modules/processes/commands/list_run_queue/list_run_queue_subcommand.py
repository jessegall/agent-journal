from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.refusal import Refusal
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.processes.models.support.process_setting import ProcessSetting
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.process_queue_page import ProcessQueuePage
from core.modules.processes.support.process_settings import ProcessSettings
from core.modules.processes.support.queue_run_workers import QueueRunWorkers

MAX_PAGE_SIZE = 100


class ListRunQueueSubcommand(ReadSubcommand[ProcessQueuePage]):
    """Lists a page of waiting and running commands admitted through an environment's process queue."""

    cli_name = "queue"
    name = "list"

    def __init__(self, processes: ProcessQuery, workers: QueueRunWorkers, settings: ProcessSettings) -> None:
        self.processes, self.workers, self.settings = processes, workers, settings

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--environment-id", type=int)
        parser.add_argument("--limit", type=int, default=50)
        parser.add_argument("--page", type=int, default=1)

    def read(self, arguments: Namespace, caller: Caller) -> ProcessQueuePage:
        environment_id = arguments.environment_id if arguments.environment_id is not None else caller.environment_id
        if environment_id is None:
            raise Refusal("the process queue needs an environment", "queue list --environment-id <number>")
        page = self.processes.environment(environment_id).running().filter(is_queue_run=True).oldest().page(max(1, arguments.page), min(MAX_PAGE_SIZE, max(1, arguments.limit)))
        return ProcessQueuePage(page, self.workers.read(page), environment_id,
                                self.settings.integer(ProcessSetting.RUN_BATCH_SIZE, environment_id))

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, ProcessQueuePage):
            output.write("\n".join(f"{process.id}  {process.agent_id}  {process.category.value}  {process.line}" for process in value.page.rows) or "No command waits or runs in this process queue.", value.json())

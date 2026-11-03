from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.processes.models.process_queue_row import ProcessQueueRow
from core.modules.processes.models.enums.queue_section import QueueSection
from core.modules.processes.models.support.process_setting import ProcessSetting
from core.modules.processes.support.process_settings import ProcessSettings
from core.modules.processes.support.run_queue_halt import RunQueueHalt
from core.modules.processes.support.queue_inspector_json import QueueInspectorJson


class InspectRunQueueSubcommand(ReadSubcommand[QueueInspectorJson]):
    """Reads the queue's controls, counts and ordered command lists in one response."""

    cli_name = "queue"
    name = "inspect"

    def __init__(self, queries: Queries, settings: ProcessSettings, halt: RunQueueHalt) -> None:
        self.queries, self.settings, self.halt = queries, settings, halt

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--environment-id", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> QueueInspectorJson:
        environment_id = arguments.environment_id if arguments.environment_id is not None else caller.environment_id
        if environment_id is None:
            raise Refusal("the process queue needs an environment", "queue inspect --environment-id <number>")
        main_spots = self.settings.flag(ProcessSetting.MAIN_RUNS_USE_SLOTS, environment_id)
        query = self.queries.query(ProcessQueueRow).filter(environment_id=environment_id)
        running = [row.inspector_json(main_spots) for row in query.filter(section=QueueSection.RUNNING).oldest().all_rows()]
        waiting = [row.inspector_json(main_spots) for row in query.filter(section=QueueSection.WAITING).oldest().all_rows()]
        recent = [row.inspector_json(main_spots) for row in query.filter(section=QueueSection.RECENT).descending("ended_at", "id").limited(10)]
        return {"environment_id": environment_id,
                "parallel_limit": self.settings.integer(ProcessSetting.RUN_BATCH_SIZE, environment_id),
                "limit_setting": ProcessSetting.RUN_BATCH_SIZE.key,
                "count_main_runs": main_spots, "main_spots_setting": ProcessSetting.MAIN_RUNS_USE_SLOTS.key,
                "used_slots": sum(bool(row["uses_slot"]) for row in running), "waiting_count": len(waiting),
                "halted": self.halt.is_halted, "halt_reason": self.halt.reason,
                "running": running, "waiting": waiting, "recent": recent}

    def write_output(self, value: object, output: Output) -> None:
        output.write("Process queue", value)

import re
from argparse import ArgumentParser, Namespace

from suites.coding.models.enums.coding_helper_role import CodingHelperRole
from engine.caller.caller import Caller
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.messages.commands.record_parent_report.record_parent_report import RecordParentReport
from core.modules.agents.models.agent import Agent
from core.modules.messages.models.message import Message
from engine.setting.setting_values import SettingValues
from suites.coding.modules.workers.commands.send_merger_input.send_merger_input import SendMergerInput
from suites.coding.modules.workers.support.worker_settings import MERGER_ENABLED


PROGRESS_PATTERN = re.compile(r"\b(tests? (queued|passed|running)|nothing left|stopping|handed in|delivered|no more tasks?|moving on)\b", re.IGNORECASE)
PROGRESS_LOG = "where it stands"


class SendWorkerReportSubcommand(Subcommand[RecordParentReport | SendMergerInput, Message]):
    """Sends a worker's report to its main agent while the worker continues its task."""

    cli_name = "worker"
    name = "report"
    outward = True

    def __init__(self, queries: Queries, settings: SettingValues) -> None:
        self.queries, self.settings = queries, settings

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("text")

    def command(self, arguments: Namespace, caller: Caller) -> RecordParentReport | SendMergerInput:
        worker = self.queries.query(Agent).filter(id=caller.actor.id, role=CodingHelperRole.WORKER).first()
        if worker is None:
            raise Refusal("only a worker reports to its main agent", "journal message send writes a main agent's message")
        if PROGRESS_PATTERN.search(arguments.text):
            raise Refusal("a report is for what the main agent must act on; this is progress", f'journal task log <n> "{PROGRESS_LOG}"')
        if worker.parent_id is None:
            raise Refusal("the worker has no main agent", f"journal agent show {worker.number}")
        if self.settings.flag(MERGER_ENABLED):
            return SendMergerInput(worker.id, arguments.text)
        return RecordParentReport(worker.id, worker.parent_id, arguments.text)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Message):
            output.row(value)

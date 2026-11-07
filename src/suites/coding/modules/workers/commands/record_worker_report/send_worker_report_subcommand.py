from argparse import ArgumentParser, Namespace

from suites.coding.support.coding_agent_role import CodingAgentRole as AgentRole
from core.base.caller.caller import Caller
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.messages.commands.record_parent_report.record_parent_report import RecordParentReport
from core.modules.agents.models.agent import Agent
from core.modules.messages.models.message import Message
from core.modules.settings.bindings.support.setting_values import SettingValues
from suites.coding.modules.workers.commands.merger.merger_commands import ReportToMerger
from suites.coding.modules.workers.support.worker_settings import MERGER_ENABLED


class SendWorkerReportSubcommand(Subcommand[RecordParentReport, Message]):
    """Sends a worker's report to its main agent while the worker continues its task."""

    cli_name = "worker"
    name = "report"
    outward = True

    def __init__(self, queries: Queries, settings: SettingValues) -> None:
        self.queries, self.settings = queries, settings

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("text")

    def command(self, arguments: Namespace, caller: Caller) -> RecordParentReport | ReportToMerger:
        worker = self.queries.query(Agent).filter(id=caller.actor.id, role=AgentRole.WORKER).first()
        if worker is None:
            raise Refusal("only a worker reports to its main agent", "journal message send writes a main agent's message")
        if worker.parent_id is None:
            raise Refusal("the worker has no main agent", f"journal agent show {worker.id}")
        if self.settings.flag(MERGER_ENABLED):
            return ReportToMerger(worker.id, arguments.text)
        return RecordParentReport(worker.id, worker.parent_id, arguments.text)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Message):
            output.row(value)

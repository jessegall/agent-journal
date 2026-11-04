from argparse import ArgumentParser, Namespace

from suites.coding.support.coding_agent_role import CodingAgentRole as AgentRole
from core.base.caller.caller import Caller
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.agents.models.agent import Agent
from core.modules.messages.models.message import Message
from suites.coding.modules.workers.commands.record_worker_report.record_worker_report import RecordWorkerReport


class RecordWorkerReportSubcommand(Subcommand[RecordWorkerReport, Message]):
    """Sends a worker's report to its main agent while the worker continues its task."""

    cli_name = "worker"
    name = "report"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("text")

    def command(self, arguments: Namespace, caller: Caller) -> RecordWorkerReport:
        workers = self.queries.query(Agent).filter(id=caller.actor.id, role=AgentRole.WORKER).page(1, 1).rows
        if not workers:
            raise Refusal("only a worker reports to its main agent", "journal message send writes a main agent's message")
        worker = workers[0]
        if worker.parent_id is None:
            raise Refusal("the worker has no main agent", f"journal agent show {worker.id}")
        return RecordWorkerReport(worker.id, worker.environment_id, worker.parent_id, arguments.text)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Message):
            output.row(value)

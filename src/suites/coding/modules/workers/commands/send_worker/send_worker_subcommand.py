from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.journal_home import LAUNCHER_SOCKET, JournalHome
from core.modules.agents.support.agent_rows import AgentRows
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.drivers.models.agent_line import AgentLine
from suites.coding.modules.workers.commands.send_worker.send_worker import SendWorker


class SendWorkerSubcommand(Subcommand[SendWorker, AgentLine]):
    """`journal worker send <n> "<job>"`: a worker that reported takes its next job, with its memory of the
    last."""

    cli_name = "worker"
    name = "send"

    def __init__(self, home: JournalHome, agents: AgentRows) -> None:
        self.home, self.agents = home, agents

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("worker_id", type=int)
        parser.add_argument("job")

    def command(self, arguments: Namespace, caller: Caller) -> SendWorker:
        return SendWorker(arguments.worker_id, arguments.job)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, AgentLine):
            needs_launcher = self.agents.find(value.session_agent_id).ended_at is not None and not self.home.socket(LAUNCHER_SOCKET).exists()
            output.line(f"worker {value.session_agent_id} has the job waiting; an ended worker needs the launcher to start again" if needs_launcher else f"worker {value.session_agent_id} takes the job")

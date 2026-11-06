from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.journal_home import LAUNCHER_SOCKET, JournalHome
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.drivers.models.agent_line import AgentLine
from suites.coding.modules.workers.commands.send_worker.send_worker import SendWorker


class SendWorkerSubcommand(Subcommand[SendWorker, AgentLine]):
    """`journal worker send <n> ["<job>"] [--task <task> ...]`: a worker that reported takes its next job or
    tasks, with its memory of the last, and the answer says whether it runs, is started again or cannot be
    told."""

    cli_name = "worker"
    name = "send"
    outward = True

    def __init__(self, home: JournalHome, agents: AgentRows) -> None:
        self.home, self.agents = home, agents

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("worker_id", type=int)
        parser.add_argument("job", nargs="?", default="")
        parser.add_argument("--task", type=int, nargs="+", default=[], help="tasks the worker takes next")
        parser.add_argument("--library-link", action="append", default=[], help="a folder of the environment to link into a new worktree")
        parser.add_argument("--library-copy", action="append", default=[], help="a folder of the environment to copy into a new worktree")

    def command(self, arguments: Namespace, caller: Caller) -> SendWorker:
        return SendWorker(arguments.worker_id, arguments.job, tuple(arguments.task), tuple(arguments.library_link), tuple(arguments.library_copy))

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, AgentLine):
            output.line(self.answer(self.agents.find(value.session_agent_id)))

    def answer(self, worker: Agent) -> str:
        if worker.ended_at is None:
            return f"worker {worker.id} takes the job" if worker.pid is not None else f"worker {worker.id} takes the job at its next hook; its process is not recorded, so the journal cannot say whether it runs: journal worker status {worker.id}"
        if worker.paused_at is not None:
            return f"worker {worker.id} is paused: the job waits until it is resumed"
        if not self.home.socket(LAUNCHER_SOCKET).exists():
            return f"worker {worker.id} is not running and has the job waiting; an ended worker needs the launcher to start again"
        return f"worker {worker.id} was not running: the job waits until it starts, and you are told if it does not"

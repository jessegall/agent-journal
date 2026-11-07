from core.base.command.command import Command
from suites.coding.modules.workers.support.worker_command_request import WorkerCommandRequest
from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.cli.write_flags import WriteFlags
from core.base.scope.scopes import Scopes
from core.base.journal_home import LAUNCHER_SOCKET, JournalHome
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.drivers.models.agent_line import AgentLine
from suites.coding.modules.workers.commands.send_worker.send_worker import SendWorker
from suites.coding.modules.workers.support.kept_worker_tasks import KeptWorkerTasks
from suites.coding.modules.workers.support.worker_route_policy import WorkerRoutePolicy
from suites.coding.modules.workers.support.worker_route_request import WorkerRouteRequest


class SendWorkerSubcommand(Subcommand[Command[object], AgentLine]):
    """`journal worker send <n> ["<job>"] [--task <task> ...]`: a worker that reported takes its next job or
    tasks, with its memory of the last, and the answer says whether it runs, is started again or cannot be
    told."""

    cli_name = "worker"
    name = "send"
    outward = True

    def __init__(self, home: JournalHome, agents: AgentRows, requests: WorkerCommandRequest,
                 tasks: KeptWorkerTasks, policy: WorkerRoutePolicy, flags: WriteFlags, scopes: Scopes) -> None:
        self.requests = requests
        self.home, self.agents = home, agents
        self.tasks, self.policy, self.flags, self.scopes = tasks, policy, flags, scopes

    def arguments(self, parser: ArgumentParser) -> None:
        WorkerCommandRequest.arguments(parser)
        parser.add_argument("worker_id", type=int)
        parser.add_argument("job", nargs="?", default="")
        parser.add_argument("--task", type=int, nargs="+", default=[], help="tasks the worker takes next")
        parser.add_argument("--library-link", action="append", default=[], help="a folder of the environment to link into a new worktree")
        parser.add_argument("--library-copy", action="append", default=[], help="a folder of the environment to copy into a new worktree")

    def command(self, arguments: Namespace, caller: Caller) -> Command[object]:
        command = SendWorker(arguments.worker_id, arguments.job, tuple(arguments.task), tuple(arguments.library_link), tuple(arguments.library_copy))
        if arguments.task:
            with self.scopes.opened(caller.read_actor_id, caller.environment_id):
                worker = self.agents.find(arguments.worker_id)
                self.policy.check_tasks(self.tasks.check_tasks(tuple(arguments.task)),
                                        WorkerRouteRequest(worker.program, caller.actor.type, self.flags.skipped_guards(arguments)))
        argv = ["worker", "send", str(arguments.worker_id), arguments.job]
        if arguments.task:
            argv.extend(("--task", *(str(task) for task in arguments.task)))
        for link in arguments.library_link:
            argv.extend(("--library-link", link))
        for copy in arguments.library_copy:
            argv.extend(("--library-copy", copy))
        return self.requests.command(command, arguments.worker_id, argv, arguments, caller)

    def write_output(self, value: object, output: Output) -> None:
        if WorkerCommandRequest.write_output(value, output):
            return
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

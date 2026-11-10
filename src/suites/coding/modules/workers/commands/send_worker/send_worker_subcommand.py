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
from engine.enums.actor_type import ActorType
from engine.errors.refusal import Refusal
from core.modules.drivers.models.agent_line import AgentLine
from suites.coding.modules.workers.commands.send_worker.send_worker import SendWorker
from suites.coding.modules.workers.support.kept_worker_tasks import KeptWorkerTasks
from suites.coding.modules.workers.support.worker_route_policy import WorkerRoutePolicy
from suites.coding.modules.workers.support.worker_route_request import WorkerRouteRequest
from suites.coding.modules.workers.support.test_command_entry import TEST_COMMAND_EXAMPLE, TestCommandEntry
from suites.coding.modules.workers.support.plan_worker_tasks import PlanWorkerTasks
from suites.coding.modules.workers.support.worker_test_names import WorkerTestNames


class SendWorkerSubcommand(Subcommand[Command[object], AgentLine]):
    """`journal worker send <n> ["<job>"] [--task <task> ...]`: a worker that reported takes its next job or
    tasks, with its memory of the last, and the answer says whether it runs, is started again or cannot be
    told."""

    cli_name = "worker"
    name = "send"
    outward = True

    def __init__(self, home: JournalHome, agents: AgentRows, requests: WorkerCommandRequest,
                 tasks: KeptWorkerTasks, policy: WorkerRoutePolicy, flags: WriteFlags, scopes: Scopes, plan_tasks: PlanWorkerTasks, test_names: WorkerTestNames) -> None:
        self.test_names = test_names
        self.requests = requests
        self.home, self.agents = home, agents
        self.tasks, self.policy, self.flags, self.scopes = tasks, policy, flags, scopes
        self.plan_tasks = plan_tasks

    def arguments(self, parser: ArgumentParser) -> None:
        WorkerCommandRequest.arguments(parser)
        parser.add_argument("worker_id", type=int)
        parser.add_argument("job", nargs="?", default="")
        parser.add_argument("--job", dest="job_flag", default="", help="the job, written as a flag so a button can fill it")
        parser.add_argument("--task", type=int, nargs="+", default=[], help="tasks the worker takes next")
        parser.add_argument("--plan", type=int, default=None, help="hand the worker a plan in phase order")
        parser.add_argument("--phase", type=int, default=None, help="with --plan, only this phase")
        parser.add_argument("--no-sandbox", action="store_true", help="the worker runs its shell lines outside the sandbox")
        parser.add_argument("--library-link", action="append", default=[], help="a folder of the environment to link into a new worktree")
        parser.add_argument("--library-copy", action="append", default=[], help="a folder of the environment to copy into a new worktree")
        parser.add_argument("--test-command", action="append", default=[], metavar="NAME=COMMAND", help="a test command the worker may run, added to those it has")

    def command(self, arguments: Namespace, caller: Caller) -> Command[object]:
        if arguments.phase is not None and arguments.plan is None:
            raise Refusal("--phase needs --plan", "add --plan <plan>")
        if arguments.plan is not None and arguments.task:
            raise Refusal("a send takes tasks or a plan, not both", "drop the task numbers or drop --plan")
        commands = TestCommandEntry.parsed(arguments.test_command)
        with self.scopes.opened(caller.read_actor_id, caller.environment_id):
            task_ids = self.plan_tasks.task_ids(arguments.plan, arguments.phase) if arguments.plan is not None else tuple(arguments.task)
            if task_ids:
                self.check_test_commands(arguments.worker_id, commands, caller)
                worker = self.agents.find(arguments.worker_id)
                self.policy.check_tasks(self.tasks.check_tasks(task_ids, caller.actor.id),
                                        WorkerRouteRequest(worker.program, caller.actor.type, self.flags.skipped_guards(arguments)))
        job = arguments.job or arguments.job_flag
        command = SendWorker(arguments.worker_id, job, task_ids, tuple(arguments.library_link), tuple(arguments.library_copy), not arguments.no_sandbox, commands)
        argv = ["worker", "send", str(arguments.worker_id), job]
        if arguments.plan is not None:
            argv.extend(("--plan", str(arguments.plan)))
            if arguments.phase is not None:
                argv.extend(("--phase", str(arguments.phase)))
        elif arguments.task:
            argv.extend(("--task", *(str(task) for task in arguments.task)))
        if arguments.no_sandbox:
            argv.append("--no-sandbox")
        for link in arguments.library_link:
            argv.extend(("--library-link", link))
        for copy in arguments.library_copy:
            argv.extend(("--library-copy", copy))
        for value in arguments.test_command:
            argv.extend(("--test-command", value))
        return self.requests.command(command, arguments.worker_id, argv, arguments, caller)

    def check_test_commands(self, worker_id: int, commands: tuple[TestCommandEntry, ...], caller: Caller) -> None:
        if not commands and caller.actor.type is ActorType.AGENT and not self.test_names.rows(worker_id):
            raise Refusal(f"worker {worker_id} has no test command for new work", TEST_COMMAND_EXAMPLE)

    def write_output(self, value: object, output: Output) -> None:
        if WorkerCommandRequest.write_output(value, output):
            return
        if isinstance(value, AgentLine):
            output.line(self.answer(self.agents.find(value.session_agent_id)))

    def answer(self, worker: Agent) -> str:
        if worker.paused_at is not None:
            return f"worker {worker.id} is paused: the job waits until journal agent resume {worker.id}"
        if worker.ended_at is None:
            return f"worker {worker.id} takes the job" if worker.pid is not None else f"worker {worker.id} takes the job at its next hook; its process is not recorded, so the journal cannot say whether it runs: journal worker status {worker.id}"
        if not self.home.socket(LAUNCHER_SOCKET).exists():
            return f"worker {worker.id} is not running and has the job waiting; an ended worker needs the launcher to start again"
        return f"worker {worker.id} was not running: the job waits until it starts, and you are told if it does not"

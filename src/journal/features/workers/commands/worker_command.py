from argparse import Namespace

from journal.console.command import Command
from journal.console.where import Where
from journal.engine.machine import Machine
from journal.features.workers.states.awaiting import Awaiting
from journal.features.workers.worker_reports import WorkerReports
from journal.features.workers.worker_runner import WorkerRunner
from journal.models.worker import Worker
from journal.repositories.environments import Environments
from journal.repositories.messages import Messages
from journal.repositories.workers import Workers


class WorkerCommand(Command):
    noun = "worker"

    def __init__(self, workers: Workers, messages: Messages, environments: Environments, machine: Machine, runner: WorkerRunner, reports: WorkerReports) -> None:
        self.workers, self.messages, self.environments, self.machine = workers, messages, environments, machine
        self.runner, self.reports = runner, reports

    def arguments(self, verbs) -> None:
        dispatch = self.verb(verbs, "dispatch", "send a worker to write one bounded job")
        dispatch.add_argument("name")
        dispatch.add_argument("brief")
        dispatch.add_argument("--provider", default="claude")
        dispatch.add_argument("--model", required=True)
        dispatch.add_argument("--worktree", action="store_true", help="in a worktree of its own, for code")
        report = self.verb(verbs, "report", "the worker reports back")
        report.add_argument("n", type=int)
        report.add_argument("text")
        self.verb(verbs, "wait", "wait until these workers have reported").add_argument("on", type=int, nargs="+")
        self.verb(verbs, "stop", "end a worker").add_argument("n", type=int)
        self.verb(verbs, "list", "every worker out")

    def dispatch(self, args: Namespace, where: Where) -> int:
        environment = self.environments.named(where.environment).id
        worker = Worker(environment_id=environment, name=args.name, brief=args.brief, provider=args.provider, model=args.model, worktree=args.worktree, dispatched_by=where.session)
        worker = self.workers.save(worker, where.actor)
        self.runner.start(worker, where.actor)
        print(f"worker {worker.id} {worker.name} dispatched on {worker.provider} {worker.model}; it reports in the chat when it ends")
        return 0

    def report(self, args: Namespace, where: Where) -> int:
        worker = self.workers.find(args.n)
        message = self.reports.file(worker, args.text, where.actor, where.session)
        print(f"worker {worker.id} reported in message {message.id}")
        return 0

    def wait(self, args: Namespace, where: Where) -> int:
        environment = self.environments.named(where.environment).id
        agent = self.machine.agent(where.session, environment)
        current = self.machine.states.named(agent.state, agent.data)
        self.machine.move(where.session, environment, Awaiting.leaving(current, workers=tuple(args.on)))
        print(f"awaiting workers {', '.join(str(n) for n in args.on)}")
        return 0

    def stop(self, args: Namespace, where: Where) -> int:
        self.runner.stop(args.n)
        self.workers.save(self.workers.find(args.n).stopped(), where.actor)
        print(f"worker {args.n} stopped")
        return 0

    def list(self, args: Namespace, where: Where) -> int:
        for worker in self.workers.in_(self.environments.named(where.environment).id):
            print(f"{worker.id:>4}  {worker.state:<10} {worker.name}: {worker.brief}")
        return 0

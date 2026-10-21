from datetime import datetime, timezone
from argparse import Namespace

from journal.repositories.setting_rows import SettingRows
from journal.features.workers.support.worker_branch import WorkerBranch
from journal.support.worktree_failure import WorktreeFailure
from journal.console.command import Command
from journal.support.caller import Caller
from journal.features.profiles.support.profile_files import ProfileFiles
from journal.features.workers.support.worker_reports import WorkerReports
from journal.features.workers.support.worker_runner import WorkerRunner
from journal.models.worker import Worker
from journal.providers.providers import Providers
from journal.repositories.agents import Agents
from journal.support.rejection import Rejection
from journal.repositories.messages import Messages
from journal.repositories.scope import Scope
from journal.repositories.workers import Workers
from journal.features.workers.support.worker_actions import WorkerActions

class WorkerCommand(Command):
    noun = "worker"

    def __init__(self, workers: Workers, messages: Messages, runner: WorkerRunner, reports: WorkerReports, scope: Scope, profiles: ProfileFiles, providers: Providers, agents: Agents, branch: WorkerBranch, settings: SettingRows, actions: WorkerActions) -> None:
        self.workers, self.messages, self.providers, self.agents = workers, messages, providers, agents
        self.branch, self.settings, self.actions = branch, settings, actions
        self.runner, self.reports, self.scope, self.profiles = runner, reports, scope, profiles

    def arguments(self, verbs) -> None:
        dispatch = self.verb(verbs, "dispatch", "send a worker to write one bounded job")
        dispatch.add_argument("name")
        dispatch.add_argument("brief")
        dispatch.add_argument("--provider", choices=("claude", "codex"), help="the program the worker runs; the dispatching agent's own when not named")
        dispatch.add_argument("--profile", required=True, help="the worker profile it works by: senior, on Opus, for a job that needs judgement; medior, on Sonnet, for one whose shape is settled")
        dispatch.add_argument("--model", help="a model other than the profile's")
        dispatch.add_argument("--worktree", action="store_true", help="in a worktree of its own, for code")
        dispatch.add_argument("--fresh", action="store_true", help="a fresh worker even though one back already worked on the same files")
        dispatch.add_argument("--task", type=int, help="the task it works on, which its plan then leaves to it")
        report = self.verb(verbs, "report", "the worker reports back")
        report.add_argument("n", type=int)
        report.add_argument("text")
        line = self.verb(verbs, "send", "give a worker that reported or was stopped its next job, in its last session with its memory of the last")
        line.add_argument("n", type=int)
        line.add_argument("brief")
        line.add_argument("--task", type=int, help="the task this job works on, which its plan then leaves to it")
        notify = self.verb(verbs, "notify", "give a running worker a message in its live session")
        notify.add_argument("n", type=int)
        notify.add_argument("text")
        self.verb(verbs, "wait", "wait until these workers have reported").add_argument("on", type=int, nargs="+")
        for verb, help in (("stop", "end a worker"), ("complete", "a worker's report acted on: merged, used or set aside, so it is no longer named")):
            retire = self.verb(verbs, verb, help)
            retire.add_argument("n", type=int)
            retire.add_argument("--why", default="", help="why the worker cannot be reused for the next job")
        self.verb(verbs, "list", "every worker out")
        self.verb(verbs, "peers", "for a worker: the other workers of the agent that dispatched it, out or idle, and what each is on")

    def provider_default(self, caller: Caller) -> str:
        return self.agents.session_agent(caller.session).provider if caller.session else self.providers.default().name

    def dispatch(self, args: Namespace, caller: Caller) -> int:
        if self.profiles.kind(args.profile) != "worker":
            raise Rejection(f"{args.profile} is no worker profile: name one with --profile, senior for a job that needs judgement or medior for one whose shape is settled; a subagent profile only reads, so send it with the Agent tool")
        from journal.features.workers.feature import Workers as Feature
        output = [w for w in self.workers.scoped() if w.is_running()]
        maximum = int(self.settings.option(Feature.WORKER_LIMIT))
        if maximum and len(output) >= maximum:
            raise Rejection(Feature.WORKER_OVERFLOW.create(out=len(output)).rendered())
        provider = args.provider or self.provider_default(caller)
        worker = Worker(name=args.name, brief=args.brief, provider=provider, model=args.model or self.model(args.profile, provider), profile=args.profile, worktree=args.worktree, dispatcher=caller.session)
        worker = self.workers.save(worker, caller.actor)
        try:
            self.runner.workplace(worker)
        except WorktreeFailure as failed:
            self.workers.delete(worker, caller.actor)
            raise Rejection(f"worker {worker.name} was not dispatched: {failed}") from failed
        if args.task:
            self.workers.assign(worker, args.task, caller.actor)
        self.runner.start(worker, caller.actor)
        self.workers.save(worker.dispatched(datetime.now(timezone.utc).timestamp()), caller.actor)
        print(f"worker {worker.id} {worker.name} dispatched on {worker.provider} {worker.model}; it reports in the chat when it ends")
        return 0

    def model(self, profile: str, provider: str) -> str:
        shown = self.profiles.read(profile)
        return shown[self.providers.lookup(provider).profile_model]

    def report(self, args: Namespace, caller: Caller) -> int:
        worker = self.workers.find(args.n)
        message = self.reports.file(worker.with_(session=caller.session or worker.session, touched_paths=self.branch.touched(worker)), args.text, caller.actor)
        print(f"worker {worker.id} reported in message {message.id}")
        return 0

    def send(self, args: Namespace, caller: Caller) -> int:
        worker = self.actions.peer_send(args.n, args.brief, caller.worker, caller.actor) if caller.worker else self.actions.send(args.n, args.brief, caller.session, caller.actor)
        if args.task:
            self.workers.assign(worker, args.task, caller.actor)
        print(f"worker {worker.id} {worker.name} told; it reports in the chat when it ends")
        return 0

    def notify(self, args: Namespace, caller: Caller) -> int:
        worker = self.actions.peer_notify(args.n, args.text, caller.worker, caller.actor) if caller.worker else self.actions.notify(args.n, args.text, caller.actor)
        print(f"worker {worker.id} {worker.name} has the message in its session")
        return 0

    def wait(self, args: Namespace, caller: Caller) -> int:
        print(f"awaiting workers {', '.join(str(n) for n in args.on)}: you are told as each reports, and when the last is back")
        return 0

    def stop(self, args: Namespace, caller: Caller) -> int:
        self.actions.stop(args.n, args.why, caller.actor)
        print(f"worker {args.n} stopped" + (f": {args.why}" if args.why else ""))
        return 0

    def complete(self, args: Namespace, caller: Caller) -> int:
        worker, dropped = self.actions.complete(args.n, args.why, caller.actor)
        print(f"worker {worker.id}'s report is acted on" + (f": {args.why}" if args.why else "") + (f"; {dropped}" if dropped else ""))
        return 0

    def peers(self, args: Namespace, caller: Caller) -> int:
        if not caller.worker:
            raise Rejection("only a worker has peers: `journal worker list` lists the workers you dispatched")
        me = self.workers.find(caller.worker)
        peers = [w for w in self.workers.scoped() if w.dispatcher == me.dispatcher and w.id != me.id and (w.is_running() or w.is_idle())]
        for worker in peers:
            print(f"{worker.id:>4}  {'out' if worker.is_running() else 'idle':<5} {worker.name}: {worker.brief}")
        print(f"`journal worker notify <n> \"<text>\"` tells one that is out, `journal worker send <n> \"<job>\"` gives one that is idle a job" if peers else "no other worker of the agent that dispatched you is out or idle")
        return 0

    def list(self, args: Namespace, caller: Caller) -> int:
        workers = self.workers.scoped()
        for worker in workers:
            print(f"{worker.id:>4}  {worker.state:<10} {worker.name}: {worker.brief}")
            if not worker.is_running():
                print(f"{'':>16}files: {worker.files_line()}")
        output = [str(worker.id) for worker in workers if worker.is_running()]
        if output:
            print(f"`journal worker wait {' '.join(output)}` waits for a report; listing again does not bring it sooner")
        return 0

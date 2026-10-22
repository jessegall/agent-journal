from datetime import datetime, timezone
from journal.providers.support.profile_kind import ProfileKind
from journal.chat.cards import Cards
from argparse import Namespace

from journal.repositories.setting_rows import SettingRows
from journal.features.workers.support.worker_branch import WorkerBranch
from journal.support.worktree_failure import WorktreeFailure
from journal.console.command import WORKER_KINDS, Command
from journal.support.caller import Caller
from journal.features.profiles.support.profile_files import ProfileFiles
from journal.features.workers.support.worker_reports import WorkerReports
from journal.features.workers.support.worker_runner import WorkerRunner
from journal.models.worker import Worker
from journal.providers.providers import Providers
from journal.support.rejection import Rejection
from journal.repositories.messages import Messages
from journal.repositories.scope import Scope
from journal.repositories.subagents import Subagents
from journal.models.support.ref import Ref
from journal.models.task import Task
from journal.models.task_state import TaskState
from journal.repositories.agents import Agents
from journal.repositories.tasks import Tasks
from journal.repositories.workers import Workers
from journal.features.workers.support.worker_actions import WorkerActions

EMPTY_BRIEF_REFUSAL = "task {n} has no brief: a worker's job is its task's brief, so write it first with journal task brief {n} \"<what is done when>\""
ASSIGNMENT_REFUSALS = {
    TaskState.FINISHED: "task {n} is {state}: a worker is started only on an open task or one you hold",
    TaskState.CANCELLED: "task {n} is {state}: a worker is started only on an open task or one you hold",
    TaskState.BLOCKED: "task {n} is {state}: unblock it before a worker takes it",
    TaskState.STARTED: "task {n} is started in another's hands: a worker is started only on an open task or one you hold",
    TaskState.SUSPENDED: "task {n} is {state} in another's hands: a worker is started only on an open task or one you hold",
}

class WorkerCommand(Command):
    noun = "worker"
    callers = {"peers": WORKER_KINDS, "notify": WORKER_KINDS, "send": WORKER_KINDS, "report": WORKER_KINDS}

    def __init__(self, workers: Workers, messages: Messages, runner: WorkerRunner, reports: WorkerReports, scope: Scope, profiles: ProfileFiles, providers: Providers, branch: WorkerBranch, settings: SettingRows, actions: WorkerActions, subagents: Subagents, tasks: Tasks, agents: Agents) -> None:
        self.tasks, self.agents = tasks, agents
        self.workers, self.messages, self.providers = workers, messages, providers
        self.branch, self.settings, self.actions, self.subagents = branch, settings, actions, subagents
        self.runner, self.reports, self.scope, self.profiles = runner, reports, scope, profiles

    def arguments(self, verbs) -> None:
        dispatch = self.verb(verbs, "dispatch", "send a worker to write one bounded job")
        dispatch.add_argument("name")
        dispatch.add_argument("brief", nargs="?", default="", help="what the worker is told beside its task's brief")
        dispatch.add_argument("--provider", choices=("claude", "codex"), help="the program the worker runs; the dispatching agent's own when not named")
        dispatch.add_argument("--profile", required=True, help="the worker profile it works by: senior, on Opus, for a job that needs judgement; medior, on Sonnet, for one whose shape is settled")
        dispatch.add_argument("--model", help="a model other than the profile's")
        dispatch.add_argument("--worktree", action="store_true", help="in a worktree of its own, for code")
        dispatch.add_argument("--fresh", action="store_true", help="a fresh worker even though one back already worked on the same files")
        dispatch.add_argument("--task", type=int, required=True, help="the task it works on: an open one with a brief, or the one you hold; it is the worker's alone until merged or released")
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
        self.verb(verbs, "list", "every worker, and the subagents this agent started")
        self.verb(verbs, "peers", "for a worker: the other workers of the agent that dispatched it, out or idle, and what each is on")

    def provider_default(self, caller: Caller) -> str:
        return self.providers.default().name if caller.provider is None else caller.provider

    def dispatch(self, args: Namespace, caller: Caller) -> int:
        if self.profiles.kind(args.profile) != ProfileKind.WORKER:
            raise Rejection(f"{args.profile} is no worker profile: name one with --profile, senior for a job that needs judgement or medior for one whose shape is settled; a subagent profile only reads, so send it with the Agent tool")
        from journal.features.workers.feature import Workers as Feature
        output = [w for w in self.workers.scoped() if w.is_running()]
        maximum = self.settings.integer(Feature.WORKER_LIMIT)
        if maximum and len(output) >= maximum:
            raise Rejection(Feature.WORKER_OVERFLOW.create(out=len(output)).rendered())
        task = self.assignment(args.task, caller)
        provider = args.provider or self.provider_default(caller)
        moment = datetime.now(timezone.utc).timestamp()
        worker = Worker(name=args.name, brief="\n\n".join(part for part in (task.brief, args.brief) if part), provider=provider, model=args.model or self.model(args.profile, provider), profile=args.profile, worktree=args.worktree, dispatcher=caller.session)
        worker = self.workers.save(worker.contacted(moment), caller.actor)
        try:
            self.runner.workplace(worker)
        except WorktreeFailure as failed:
            self.workers.delete(worker, caller.actor)
            raise Rejection(f"worker {worker.name} was not dispatched: {failed}") from failed
        self.tasks.handover(task, Ref.build(worker), caller.actor)
        self.runner.start(worker, caller.actor)
        self.workers.save(self.workers.find(worker.row_id).dispatched(moment), caller.actor)
        print(f"worker {worker.id} {worker.name} dispatched on {worker.provider} {worker.model}; it reports in the chat when it ends")
        return 0

    def assignment(self, n: int, caller: Caller) -> Task:
        task = self.tasks.find(n)
        if self.is_holder(task, caller) or (task.state == TaskState.OPEN and task.brief.strip()):
            return task
        raise Rejection(ASSIGNMENT_REFUSALS.get(task.state, EMPTY_BRIEF_REFUSAL).format(n=n, state=task.state))

    def is_holder(self, task: Task, caller: Caller) -> bool:
        agents = [] if caller.session is None else self.agents.global_matching(session=caller.session)
        return bool(agents) and self.tasks.holder(task) == Ref.build(agents[0])

    def model(self, profile: str, provider: str) -> str:
        return self.providers.lookup(provider).profile_model(self.profiles.read(profile))

    def report(self, args: Namespace, caller: Caller) -> int:
        if caller.worker_number is not None and caller.worker_number != args.n:
            raise Rejection(f"worker {args.n} is not you: a worker reports for itself, worker {caller.worker_number}")
        worker = self.workers.find(args.n)
        message = self.reports.file(worker.with_(session=worker.session if caller.session is None else caller.session, touched_paths=self.branch.touched(worker)), args.text, caller.actor)
        print(f"worker {worker.id} reported in message {message.id}")
        return 0

    def send(self, args: Namespace, caller: Caller) -> int:
        holdings = self.tasks.holder_task_ids(Ref(Worker.table(), args.n))
        if args.task and holdings and args.task not in holdings:
            raise Rejection(f"worker {args.n} holds task {holdings[0]} until its work is merged or released: send it the next job on that task, or release it first")
        worker = self.actions.peer_send(args.n, args.brief, caller.worker_number, caller.actor) if caller.worker_number is not None else self.actions.send(args.n, args.brief, caller.session, caller.actor)
        if args.task:
            self.tasks.handover(self.tasks.find(args.task), Ref.build(worker), caller.actor)
        print(f"worker {worker.id} {worker.name} told; it reports in the chat when it ends")
        return 0

    def notify(self, args: Namespace, caller: Caller) -> int:
        worker = self.actions.peer_notify(args.n, args.text, caller.worker_number, caller.actor) if caller.worker_number is not None else self.actions.notify(args.n, args.text, caller.actor)
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
        if caller.worker_number is None:
            raise Rejection("only a worker has peers: `journal worker list` lists the workers you dispatched")
        sender = self.workers.find(caller.worker_number)
        peers = [w for w in self.workers.scoped() if w.dispatcher == sender.dispatcher and w.id != sender.id and (w.is_running() or w.is_idle())]
        for worker in peers:
            print(f"{worker.id:>4}  {'out' if worker.is_running() else 'idle':<5} {worker.name}: {worker.brief}")
        print(f"`journal worker notify <n> \"<text>\"` tells one that is out, `journal worker send <n> \"<job>\"` gives one that is idle a job" if peers else "no other worker of the agent that dispatched you is out or idle")
        return 0

    def list(self, args: Namespace, caller: Caller) -> int:
        workers = self.workers.scoped()
        for worker in workers:
            print(f"{worker.id:>4}  {worker.state:<10} {worker.name}: {Cards.shortened(worker.brief)}")
            if not worker.is_running():
                print(f"{'':>16}files: {worker.files_line()}")
        output = [str(worker.id) for worker in workers if worker.is_running()]
        if output:
            print(f"`journal worker wait {' '.join(output)}` waits for a report; listing again does not bring it sooner")
        self.print_subagents(caller.session)
        return 0

    def print_subagents(self, session: str | None) -> None:
        subagents = [] if session is None else self.subagents.session_subagents(session)
        if subagents:
            print("subagents this agent started:")
        for subagent in subagents:
            print(f"{subagent.id:>4}  {subagent.state:<10} {subagent.agent_type}: {subagent.task}")
            if subagent.is_idle():
                print(f"{'':>16}session: {subagent.session}")
        if any(subagent.is_idle() for subagent in subagents):
            print("an idle subagent takes its next job by SendMessage to its session; `journal subagent retire <n>` lets one go")

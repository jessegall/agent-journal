from datetime import datetime, timezone
from argparse import Namespace

from journal.repositories.setting_rows import SettingRows
from journal.features.workers.support.worker_branch import WorkerBranch
from journal.support.worktree_failure import WorktreeFailure
from journal.console.command import Command
from journal.support.caller import Caller
from journal.features.profiles.support.profile_files import ProfileFiles
from journal.features.workers.support.worker_reports import WorkerReports
from journal.features.workers.support.path_mentions import PathMentions
from journal.features.workers.support.worker_runner import WorkerRunner
from journal.models.worker import Worker
from journal.providers.providers import Providers
from journal.repositories.agents import Agents
from journal.support.rejection import Rejection
from journal.models.worker_state import WorkerState
from journal.repositories.messages import Messages
from journal.repositories.scope import Scope
from journal.repositories.workers import Workers
from journal.providers.support.session_inbox import SessionInbox

NOTIFY_REFUSALS = {
    WorkerState.REPORTED: "worker {n}, {name}, has reported and runs no more: give it the job with `journal worker send {n} \"<job>\"`",
    WorkerState.STOPPED: "worker {n}, {name}, was stopped: `journal worker send {n} \"<job>\"` revives it in its last session with the job",
}
ENDED = "worker {n}, {name}, has ended and its report is being filed: wait for it, then give it the job with `journal worker send {n} \"<job>\"`"
NO_INBOX = "worker {n}, {name}, runs {provider}, which takes no message while it runs: wait for its report, then give it the job with `journal worker send {n} \"<job>\"`"

class WorkerCommand(Command):
    noun = "worker"

    def __init__(self, workers: Workers, messages: Messages, runner: WorkerRunner, reports: WorkerReports, scope: Scope, profiles: ProfileFiles, providers: Providers, agents: Agents, branch: WorkerBranch, settings: SettingRows, inbox: SessionInbox) -> None:
        self.workers, self.messages, self.providers, self.agents = workers, messages, providers, agents
        self.branch, self.settings, self.inbox = branch, settings, inbox
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
        line = self.verb(verbs, "send", "give a worker that reported its next job, with its memory of the last")
        line.add_argument("n", type=int)
        line.add_argument("brief")
        line.add_argument("--task", type=int, help="the task this job works on, which its plan then leaves to it")
        notify = self.verb(verbs, "notify", "give a running worker a message in its live session")
        notify.add_argument("n", type=int)
        notify.add_argument("text")
        self.verb(verbs, "wait", "wait until these workers have reported").add_argument("on", type=int, nargs="+")
        self.verb(verbs, "stop", "end a worker").add_argument("n", type=int)
        self.verb(verbs, "complete", "a worker's report acted on: merged, used or set aside, so it is no longer named").add_argument("n", type=int)
        self.verb(verbs, "list", "every worker out")

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
        knowing = [] if args.fresh else self.related_workers(args.brief)
        if knowing:
            raise Rejection(f"worker {knowing[0].id}, {knowing[0].name}, already worked on the files this job names: give it the job with `journal worker send {knowing[0].id} \"<job>\"`, or add --fresh if it truly needs a new one")
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
        message = self.reports.file(worker.with_(session=caller.session or worker.session), args.text, caller.actor)
        print(f"worker {worker.id} reported in message {message.id}")
        return 0

    def related_workers(self, brief: str) -> list[Worker]:
        matched = PathMentions.build(brief)
        return [w for w in reversed(self.workers.scoped()) if matched and w.state != WorkerState.DISPATCHED and w.resume and matched & PathMentions.build(w.brief)]

    def send(self, args: Namespace, caller: Caller) -> int:
        with self.runner.lock(args.n):
            worker = self.sent(self.workers.find(args.n), args, caller)
        print(f"worker {worker.id} {worker.name} told; it reports in the chat when it ends")
        return 0

    def sent(self, worker: Worker, args: Namespace, caller: Caller) -> Worker:
        if worker.state == WorkerState.DISPATCHED:
            raise Rejection(f"worker {worker.id}, {worker.name}, is still out: tell it with `journal worker notify {worker.id} \"<text>\"`, or wait for its report and send it the job then")
        if not worker.resume:
            raise Rejection(f"worker {worker.id}, {worker.name}, left no session to resume: dispatch it again")
        if self.providers.lookup(worker.provider).transcript(self.runner.place(worker), worker.resume) is None:
            raise Rejection(f"worker {worker.id}, {worker.name}: the conversation of its session {worker.resume} is gone, so it cannot go on with its memory; dispatch it again")
        worker = self.workers.save(worker.instructed(args.brief).with_(dispatcher=caller.session), caller.actor)
        if args.task:
            self.workers.assign(worker, args.task, caller.actor)
        self.runner.start(worker, caller.actor)
        return self.workers.save(worker.dispatched(datetime.now(timezone.utc).timestamp()), caller.actor)

    def notify(self, args: Namespace, caller: Caller) -> int:
        with self.runner.lock(args.n):
            worker = self.workers.find(args.n)
            refusal = self.notify_refusal(worker)
            if refusal:
                raise Rejection(refusal.format(n=worker.id, name=worker.name, provider=worker.provider.capitalize()))
            self.inbox.deliver(worker.pid, worker.resume, "the agent that dispatched you", args.text)
        print(f"worker {worker.id} {worker.name} has the message in its session")
        return 0

    def notify_refusal(self, worker: Worker) -> str:
        if worker.state in NOTIFY_REFUSALS:
            return NOTIFY_REFUSALS[worker.state]
        if not self.runner.is_running(worker.pid):
            return ENDED
        return "" if self.providers.lookup(worker.provider).session_inbox else NO_INBOX

    def wait(self, args: Namespace, caller: Caller) -> int:
        print(f"awaiting workers {', '.join(str(n) for n in args.on)}: you are told as each reports, and when the last is back")
        return 0

    def stop(self, args: Namespace, caller: Caller) -> int:
        self.runner.stop(args.n)
        self.workers.save(self.workers.find(args.n).stopped(datetime.now(timezone.utc).timestamp()), caller.actor)
        print(f"worker {args.n} stopped")
        return 0

    def complete(self, args: Namespace, caller: Caller) -> int:
        worker = self.workers.save(self.workers.find(args.n).finished(), caller.actor)
        dropped = self.branch.dropped(worker)
        print(f"worker {worker.id}'s report is acted on" + (f"; {dropped}" if dropped else ""))
        return 0

    def list(self, args: Namespace, caller: Caller) -> int:
        workers = self.workers.scoped()
        for worker in workers:
            print(f"{worker.id:>4}  {worker.state:<10} {worker.name}: {worker.brief}")
        output = [str(worker.id) for worker in workers if worker.is_running()]
        if output:
            print(f"`journal worker wait {' '.join(output)}` waits for a report; listing again does not bring it sooner")
        return 0

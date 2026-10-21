from datetime import datetime, timezone
from argparse import Namespace

from journal.repositories.setting_rows import SettingRows
from journal.features.workers.support.worker_branch import WorkerBranch
from journal.support.worktree_failure import WorktreeFailure
from journal.console.command import Command
from journal.support.caller import Caller
from journal.support.profile_files import ProfileFiles
from journal.features.workers.support.worker_reports import WorkerReports
from journal.features.workers.support.path_mentions import PathMentions
from journal.features.workers.support.worker_runner import WorkerRunner
from journal.models.worker import Worker
from journal.providers.providers import Providers
from journal.repositories.agents import Agents
from journal.support.rejection import Rejection
from journal.models.worker_state import WorkerState
from journal.repositories.messages import Messages
from journal.support.scope import Scope
from journal.repositories.workers import Workers


class WorkerCommand(Command):
    noun = "worker"

    def __init__(self, workers: Workers, messages: Messages, runner: WorkerRunner, reports: WorkerReports, scope: Scope, profiles: ProfileFiles, providers: Providers, agents: Agents, branch: WorkerBranch, settings: SettingRows) -> None:
        self.workers, self.messages, self.providers, self.agents = workers, messages, providers, agents
        self.branch, self.settings = branch, settings
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
        say = self.verb(verbs, "say", "give a worker that reported its next job, with its memory of the last")
        say.add_argument("n", type=int)
        say.add_argument("brief")
        say.add_argument("--task", type=int, help="the task this job works on, which its plan then leaves to it")
        self.verb(verbs, "wait", "wait until these workers have reported").add_argument("on", type=int, nargs="+")
        self.verb(verbs, "stop", "end a worker").add_argument("n", type=int)
        self.verb(verbs, "done", "a worker's report acted on: merged, used or set aside, so it is no longer named").add_argument("n", type=int)
        self.verb(verbs, "list", "every worker out")

    def own_provider(self, caller: Caller) -> str:
        return self.agents.session_agent(caller.session).provider if caller.session else "claude"

    def dispatch(self, args: Namespace, caller: Caller) -> int:
        if self.profiles.kind(args.profile) != "worker":
            raise Rejection(f"{args.profile} is no worker profile: name one with --profile, senior for a job that needs judgement or medior for one whose shape is settled; a subagent profile only reads, so send it with the Agent tool")
        from journal.features.workers.feature import Workers as Feature
        out = [w for w in self.workers.scoped() if w.is_running()]
        most = int(self.settings.option(Feature.WORKER_LIMIT))
        if most and len(out) >= most:
            raise Rejection(Feature.WORKER_OVERFLOW.create(out=len(out)).rendered())
        knowing = [] if args.fresh else self.knowing(args.brief)
        if knowing:
            raise Rejection(f"worker {knowing[0].id}, {knowing[0].name}, already worked on the files this job names: give it the job with `journal worker say {knowing[0].id} \"<job>\"`, or add --fresh if it truly needs a new one")
        provider = args.provider or self.own_provider(caller)
        worker = Worker(name=args.name, brief=args.brief, provider=provider, model=args.model or self.model_of(args.profile, provider), profile=args.profile, worktree=args.worktree, dispatched_by=caller.session)
        worker = self.workers.save(worker, caller.actor)
        try:
            self.runner.workplace(worker)
        except WorktreeFailure as failed:
            self.workers.delete(worker, caller.actor)
            raise Rejection(f"worker {worker.name} was not dispatched: {failed}") from failed
        if args.task:
            self.workers.put_on(worker, args.task, caller.actor)
        self.runner.start(worker, caller.actor)
        self.workers.save(worker.dispatched(datetime.now(timezone.utc).timestamp()), caller.actor)
        print(f"worker {worker.id} {worker.name} dispatched on {worker.provider} {worker.model}; it reports in the chat when it ends")
        return 0

    def model_of(self, profile: str, provider: str) -> str:
        shown = self.profiles.read(profile)
        return shown["codex_model"] if provider == "codex" else shown["model"]

    def report(self, args: Namespace, caller: Caller) -> int:
        worker = self.workers.find(args.n)
        message = self.reports.file(worker, args.text, caller.actor, caller.session)
        print(f"worker {worker.id} reported in message {message.id}")
        return 0

    def knowing(self, brief: str) -> list[Worker]:
        named = PathMentions.of(brief)
        return [w for w in reversed(self.workers.scoped()) if named and w.state != WorkerState.DISPATCHED and w.resume and named & PathMentions.of(w.brief)]

    def say(self, args: Namespace, caller: Caller) -> int:
        worker = self.workers.find(args.n)
        if worker.state == WorkerState.DISPATCHED:
            raise Rejection(f"worker {worker.id}, {worker.name}, is still out: wait for its report, then say")
        if not worker.resume:
            raise Rejection(f"worker {worker.id}, {worker.name}, left no session to resume: dispatch it again")
        if self.providers.lookup(worker.provider).transcript(self.runner.place(worker), worker.resume) is None:
            raise Rejection(f"worker {worker.id}, {worker.name}: the conversation of its session {worker.resume} is gone, so it cannot go on with its memory; dispatch it again")
        worker = self.workers.save(worker.told(args.brief).with_(dispatched_by=caller.session), caller.actor)
        if args.task:
            self.workers.put_on(worker, args.task, caller.actor)
        self.runner.start(worker, caller.actor)
        self.workers.save(worker.dispatched(datetime.now(timezone.utc).timestamp()), caller.actor)
        print(f"worker {worker.id} {worker.name} told; it reports in the chat when it ends")
        return 0

    def wait(self, args: Namespace, caller: Caller) -> int:
        print(f"awaiting workers {', '.join(str(n) for n in args.on)}: you are told as each reports, and when the last is back")
        return 0

    def stop(self, args: Namespace, caller: Caller) -> int:
        self.runner.stop(args.n)
        self.workers.save(self.workers.find(args.n).stopped(datetime.now(timezone.utc).timestamp()), caller.actor)
        print(f"worker {args.n} stopped")
        return 0

    def done(self, args: Namespace, caller: Caller) -> int:
        worker = self.workers.save(self.workers.find(args.n).finished(), caller.actor)
        dropped = self.branch.dropped(worker)
        print(f"worker {worker.id}'s report is acted on" + (f"; {dropped}" if dropped else ""))
        return 0

    def list(self, args: Namespace, caller: Caller) -> int:
        workers = self.workers.scoped()
        for worker in workers:
            print(f"{worker.id:>4}  {worker.state:<10} {worker.name}: {worker.brief}")
        out = [str(worker.id) for worker in workers if worker.is_running()]
        if out:
            print(f"`journal worker wait {' '.join(out)}` waits for a report; listing again does not bring it sooner")
        return 0

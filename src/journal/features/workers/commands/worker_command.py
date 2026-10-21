from datetime import datetime, timezone
from argparse import Namespace

from journal.repositories.setting_rows import SettingRows
from journal.features.workers.support.worker_branch import WorkerBranch
from journal.support.worktree_not_made import WorktreeNotMade
from journal.console.command import Command
from journal.support.where import Where
from journal.support.profile_files import ProfileFiles
from journal.features.workers.support.worker_reports import WorkerReports
from journal.features.workers.support.named_paths import NamedPaths
from journal.features.workers.support.worker_runner import WorkerRunner
from journal.models.worker import Worker
from journal.providers.providers import Providers
from journal.repositories.agents import Agents
from journal.support.refused import Refused
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

    def own_provider(self, where: Where) -> str:
        return self.agents.for_session(where.session).provider if where.session else "claude"

    def dispatch(self, args: Namespace, where: Where) -> int:
        if self.profiles.kind_of(args.profile) != "worker":
            raise Refused(f"{args.profile} is no worker profile: name one with --profile, senior for a job that needs judgement or medior for one whose shape is settled; a subagent profile only reads, so send it with the Agent tool")
        from journal.features.workers.feature import Workers as Feature
        out = [w for w in self.workers.in_() if w.is_out()]
        most = int(self.settings.option(Feature.MOST_OUT))
        if most and len(out) >= most:
            raise Refused(Feature.TOO_MANY_WORKERS.create(out=len(out)).rendered())
        knowing = [] if args.fresh else self.knowing(args.brief)
        if knowing:
            raise Refused(f"worker {knowing[0].id}, {knowing[0].name}, already worked on the files this job names: give it the job with `journal worker say {knowing[0].id} \"<job>\"`, or add --fresh if it truly needs a new one")
        provider = args.provider or self.own_provider(where)
        worker = Worker(name=args.name, brief=args.brief, provider=provider, model=args.model or self.model_of(args.profile, provider), profile=args.profile, worktree=args.worktree, dispatched_by=where.session)
        worker = self.workers.save(worker, where.actor)
        try:
            self.runner.workplace(worker)
        except WorktreeNotMade as failed:
            self.workers.delete(worker, where.actor)
            raise Refused(f"worker {worker.name} was not dispatched: {failed}") from failed
        if args.task:
            self.workers.put_on(worker, args.task, where.actor)
        self.runner.start(worker, where.actor)
        self.workers.save(worker.dispatched(datetime.now(timezone.utc).timestamp()), where.actor)
        print(f"worker {worker.id} {worker.name} dispatched on {worker.provider} {worker.model}; it reports in the chat when it ends")
        return 0

    def model_of(self, profile: str, provider: str) -> str:
        shown = self.profiles.read(profile)
        return shown["codex_model"] if provider == "codex" else shown["model"]

    def report(self, args: Namespace, where: Where) -> int:
        worker = self.workers.find(args.n)
        message = self.reports.file(worker, args.text, where.actor, where.session)
        print(f"worker {worker.id} reported in message {message.id}")
        return 0

    def knowing(self, brief: str) -> list[Worker]:
        """The workers back from a job that named the same files as this one, the latest first."""
        named = NamedPaths.of(brief)
        return [w for w in reversed(self.workers.in_()) if named and w.state != WorkerState.DISPATCHED and w.resume and named & NamedPaths.of(w.brief)]

    def say(self, args: Namespace, where: Where) -> int:
        """The same worker sent on its next job: related work goes back to the one that knows it, never to a fresh dispatch."""
        worker = self.workers.find(args.n)
        if worker.state == WorkerState.DISPATCHED:
            raise Refused(f"worker {worker.id}, {worker.name}, is still out: wait for its report, then say")
        if not worker.resume:
            raise Refused(f"worker {worker.id}, {worker.name}, left no session to resume: dispatch it again")
        if self.providers.named(worker.provider).transcript(self.runner.place(worker), worker.resume) is None:
            raise Refused(f"worker {worker.id}, {worker.name}: the conversation of its session {worker.resume} is gone, so it cannot go on with its memory; dispatch it again")
        worker = self.workers.save(worker.told(args.brief).with_(dispatched_by=where.session), where.actor)
        if args.task:
            self.workers.put_on(worker, args.task, where.actor)
        self.runner.start(worker, where.actor)
        self.workers.save(worker.dispatched(datetime.now(timezone.utc).timestamp()), where.actor)
        print(f"worker {worker.id} {worker.name} told; it reports in the chat when it ends")
        return 0

    def wait(self, args: Namespace, where: Where) -> int:
        print(f"awaiting workers {', '.join(str(n) for n in args.on)}: you are told as each reports, and when the last is back")
        return 0

    def stop(self, args: Namespace, where: Where) -> int:
        self.runner.stop(args.n)
        self.workers.save(self.workers.find(args.n).stopped(datetime.now(timezone.utc).timestamp()), where.actor)
        print(f"worker {args.n} stopped")
        return 0

    def done(self, args: Namespace, where: Where) -> int:
        worker = self.workers.save(self.workers.find(args.n).done(), where.actor)
        dropped = self.branch.dropped(worker)
        print(f"worker {worker.id}'s report is acted on" + (f"; {dropped}" if dropped else ""))
        return 0

    def list(self, args: Namespace, where: Where) -> int:
        workers = self.workers.in_()
        for worker in workers:
            print(f"{worker.id:>4}  {worker.state:<10} {worker.name}: {worker.brief}")
        out = [str(worker.id) for worker in workers if worker.is_out()]
        if out:
            print(f"`journal worker wait {' '.join(out)}` waits for a report; listing again does not bring it sooner")
        return 0

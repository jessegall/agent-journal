from journal.features.git.support.start_rule import StartRule
from journal.chat.card_detail import CardDetail
from argparse import Namespace

from journal.repositories.setting_rows import SettingRows
from journal.features.tasks.active_task import ActiveTask
from journal.features.workers.support.merge_checks import MergeChecks
from journal.features.workers.support.worker_branch import WorkerBranch
from journal.console.command import Command
from journal.support.caller import Caller
from journal.features.workers.support.worker_reports import WorkerReports
from journal.features.workers.support.worker_runner import WorkerRunner
from journal.models.worker import Worker
from journal.providers.providers import Providers
from journal.support.rejection import Rejection
from journal.features.workers.support.merge_steps import MergeSteps
from journal.features.workers.support.worker_rebase import WorkerRebase
from journal.repositories.messages import Messages
from journal.repositories.scope import Scope
from journal.repositories.subagents import Subagents
from journal.models.support.ref import Ref
from journal.models.task import Task
from journal.models.task_state import TaskState
from journal.repositories.agents import Agents
from journal.repositories.tasks import Tasks
from journal.repositories.plans import Plans
from journal.features.workers.support.plan_delegation import PlanDelegation
from journal.repositories.workers import Workers
from journal.features.workers.support.worker_actions import WorkerActions
from journal.features.workers.support.worker_dispatch import WorkerDispatch
from journal.engine.command_events import CommandEvents
from journal.features.tasks.support.wait_targets import WaitTargets
from journal.features.workers.support.worker_libraries import WorkerLibraries
from journal.features.workers.workers_nudges import WorkersNudges
from journal.features.workers.support.work_mode import WorkMode
from journal.features.workers.workers_options import WorkersOptions
from journal.support.time_source import TimeSource

DELEGATED_REFUSAL = "task {n} is delegated to a worker already: send that worker the next job, or release it first"
EMPTY_BRIEF_REFUSAL = "task {n} has no brief: a worker's job is its task's brief, so write it first with journal task brief {n} \"<what is done when>\""
ASSIGNMENT_REFUSALS = {
    TaskState.COMPLETED: "task {n} is {state}: a worker is started only on an open task or one you hold",
    TaskState.CANCELLED: "task {n} is {state}: a worker is started only on an open task or one you hold",
    TaskState.BLOCKED: "task {n} is {state}: unblock it before a worker takes it",
    TaskState.STARTED: "task {n} is started in another's hands: a worker is started only on an open task or one you hold",
}

EMPTY_CHANGES = ("", "none", "nothing", "no files", "n/a", "-", "read only", "read-only", "nothing, it only reads")


# the most workers `journal worker list` reads and shows, the newest
LISTED_WORKERS = 30


class WorkerCommand(Command):
    """A worker's dispatch, its queue, its checks and merge, and its list; every worker reports once no task of its queue is left."""

    noun = "worker"
    uncut_verbs = frozenset({"merge", "check", "wait"})
    background_verbs = frozenset({"merge", "send"})

    def __init__(self, workers: Workers, messages: Messages, runner: WorkerRunner, reports: WorkerReports, scope: Scope, providers: Providers, branch: WorkerBranch, settings: SettingRows, actions: WorkerActions, subagents: Subagents, tasks: Tasks, agents: Agents, events: CommandEvents, libraries: WorkerLibraries, plans: Plans, starts: StartRule, sending: WorkerDispatch, checks: MergeChecks, taking: ActiveTask, targets: WaitTargets, rebases: WorkerRebase, work_mode: WorkMode, time_source: TimeSource, delegation: PlanDelegation) -> None:
        self.time_source, self.delegation = time_source, delegation
        self.targets, self.rebases = targets, rebases
        self.sending, self.checks, self.taking = sending, checks, taking
        self.tasks, self.agents, self.events, self.libraries, self.plans, self.starts = tasks, agents, events, libraries, plans, starts
        self.workers, self.messages, self.providers = workers, messages, providers
        self.branch, self.settings, self.actions, self.subagents, self.work_mode = branch, settings, actions, subagents, work_mode
        self.runner, self.reports, self.scope = runner, reports, scope

    def arguments(self, verbs) -> None:
        dispatch = self.verb(verbs, "dispatch", "send a worker to write one bounded job")
        dispatch.add_argument("name")
        dispatch.add_argument("brief", nargs="?", default="", help="what the worker is sent beside its task's brief")
        dispatch.add_argument("--provider", choices=("claude", "codex"), help="the program the worker runs; the dispatching agent's own when not named")
        dispatch.add_argument("--changes", required=True, help="the files, folders or document the worker changes; a job that only reads, searches or reviews goes to a subagent, never a worker")
        dispatch.add_argument("--tests", default="", help="the test template that sets how the worker tests when the setting is Run the tests it wrote: Scoped tests by default, Full suite, or one of the project's own; with Hand the tests over the worker runs none, and with Test budget it tests only through journal tests turn")
        dispatch.add_argument("--profile", required=True, help="the worker profile it works by: senior, on Opus, for a job that needs judgement; medior, on Sonnet, for one whose shape is settled")
        dispatch.add_argument("--model", help="a model other than the profile's")
        dispatch.add_argument("--worktree", action="store_true", help="in a worktree of its own, for code; then name its library folders with --libraries or --copies, or say --no-libraries")
        dispatch.add_argument("--libraries", default="", help="library folders the worktree links to the main checkout's, comma separated, such as node_modules,.venv")
        dispatch.add_argument("--copies", default="", help="library folders the worktree gets copies of its own of, comma separated, such as vendor for composer, whose autoloader would load the main checkout's classes through a link")
        dispatch.add_argument("--no-libraries", action="store_true", help="a worktree with no library folders, for a job that changes the libraries themselves")
        dispatch.add_argument("--fresh", action="store_true", help="a fresh worker even though one back already worked on the same files")
        work = dispatch.add_mutually_exclusive_group(required=True)
        work.add_argument("--task", type=int, help="the task it works on: an open one with a brief, or the one you hold; it is the worker's alone until merged or released")
        work.add_argument("--plan", type=int, help="a whole plan it works through: its open tasks go to it one after another in the plan's order, and it tests the way the plan sets")
        dispatch.add_argument("--phase", type=int, default=0, help="with --plan, only this phase of it, numbered from 1")
        release = self.verb(verbs, "release", "let a worker go whose run ended without clocking out, which frees its task")
        release.add_argument("n", type=int)
        release.add_argument("--drop", action="store_true", help="also open again the tasks of its queue it completed and that wait for the merge; their commits stay on its branch")
        merge = self.verb(verbs, "merge", "take in a clocked-out worker's checked work, which closes its task; every merge waits its turn in the journal's merge queue")
        merge.add_argument("n", type=int, nargs="?")
        merge.add_argument("--all", action="store_true", help="take in every worker of yours whose work waits with every point checked, one after another")
        check = self.verb(verbs, "check", "check one proof of a clocked-out worker, or send it back short")
        check.add_argument("n", type=int)
        check.add_argument("point", type=int)
        check.add_argument("--short", help="what is missing; the worker is sent it in its last session")
        check.add_argument("--task", type=int, default=0, help="a task of its queue it completed before the one it is on, which waits for the same merge; the one it is on when not named")
        report = self.verb(verbs, "report", "the worker reports back")
        report.add_argument("n", type=int)
        report.add_argument("text")
        line = self.verb(verbs, "send", "give a worker that reported or was stopped its next job, in its last session with its memory of the last")
        line.add_argument("n", type=int)
        line.add_argument("brief")
        line.add_argument("--task", type=int, help="the task this job works on, which its plan then leaves to it")
        line.add_argument("--model", help="the model it runs the job on from now, in the same session and worktree")
        line.add_argument("--profile", help="the worker profile it works by from now, and its model unless --model sets one")
        queue = self.verb(verbs, "queue", "hand a worker open tasks to take next, in order, a started or paused one in your own hands let go to it: each is delegated to it at once, and the next is sent to it when its work is merged")
        queue.add_argument("n", type=int)
        queue.add_argument("tasks", type=int, nargs="+")
        queue.add_argument("--first", action="store_true", help="put the tasks at the head of the queue, in the order listed, taking one from another worker's queue if it is there, so the first is the next one sent")
        rebase = self.verb(verbs, "rebase", "have the journal rebase workers' worktrees onto the project's branch: one on a task at its next clock-out, any other at once")
        rebase.add_argument("workers", type=int, nargs="*", help="the workers to rebase; all of yours with a worktree when none are named")
        rebase.add_argument("--force", action="store_true", help="rebase a running worker at once: the journal pauses its writes, stashes its changes, rebases and takes them back")
        self.verb(verbs, "drain", "give back every task waiting in a worker's queue, open again, in one mark; the task it works on stays its").add_argument("n", type=int)
        notify = self.verb(verbs, "notify", "give a running worker a message in its live session")
        notify.add_argument("n", type=int)
        notify.add_argument("text")
        wait = self.verb(verbs, "wait", "wait until these workers have reported")
        wait.add_argument("on", type=int, nargs="+")
        wait.add_argument("--output", type=int, action="append", default=[], metavar="N", help="a command's output the same wait also ends on, such as a test run; more than one waits for all")
        for verb, help in (("stop", "end a worker"), ("complete", "a worker's report acted on: merged, used or set aside, so it is no longer named")):
            retire = self.verb(verbs, verb, help)
            retire.add_argument("n", type=int)
            retire.add_argument("--why", default="", help="why the worker cannot be reused for the next job")
        discard = self.verb(verbs, "discard", "retire a worker and throw its unmerged commits away, on purpose")
        discard.add_argument("n", type=int)
        discard.add_argument("--why", required=True, help="why its work is thrown away instead of merged")
        self.verb(verbs, "list", "every worker, and the subagents this agent started")
        self.verb(verbs, "open", "the workers still to act on: out, clocked out with work to check, or ended without clocking out, and the subagents still running")
        self.verb(verbs, "peers", "for a worker: the other workers of the agent that dispatched it, out or idle, and what each is on")

    def provider_default(self, caller: Caller) -> str:
        return self.providers.default().name if caller.provider is None else caller.provider

    def testing_brief(self, args: Namespace, planned: list[Task]) -> str:
        plan_testing = self.delegation.testing_brief(args.plan) if planned else ""
        return plan_testing or self.sending.testing_brief()

    def plan_line(self, args: Namespace, planned: list[Task]) -> str:
        if not planned:
            return ""
        return f"You work {self.delegation.scope_name(args.plan, args.phase)}: tasks {', '.join(str(task.row_id) for task in planned)}, in this order; each next one comes to you when you clock out of the one before."

    def dispatch(self, args: Namespace, caller: Caller) -> int:
        self.sending.worker_profile(args.profile)
        output = self.workers.busy_workers()
        maximum = self.settings.integer(WorkersOptions.WORKER_LIMIT)
        if maximum and len(output) >= maximum:
            waiting = self.workers.checkable_workers()
            raise Rejection((WorkersNudges.PLACES_FULL.create(n=min(waiting, key=lambda worker: worker.silence.timeout.start).id) if waiting else WorkersNudges.WORKER_OVERFLOW.create(out=len(output))).rendered())
        planned = self.delegation.tasks(args.plan, args.phase) if args.plan else []
        task = self.assignment(planned[0].row_id if planned else args.task, caller)
        provider = args.provider or self.provider_default(caller)
        moment = self.time_source.moment().timestamp()
        if args.changes.strip().lower() in EMPTY_CHANGES:
            raise Rejection("a worker writes: name what it changes with --changes; a job that only reads goes to a subagent")
        links, copies = self.library_names(args)
        testing = self.testing_brief(args, planned)
        worker = Worker(name=args.name, brief="\n\n".join(part for part in (task.brief, args.brief, self.plan_line(args, planned), f"You change: {args.changes}", f"How you test: {testing}") if part), provider=provider, model=self.allowed_model(provider, args.profile, args.model or self.sending.model(args.profile, provider)), profile=args.profile, worktree=args.worktree, library_links=links, library_copies=copies, dispatcher=caller.session)
        worker = self.workers.save(worker.contacted(moment), caller.actor)
        for queued_task in planned[1:]:
            self.tasks.queued(queued_task, Ref.build(worker), caller.actor)
        if planned:
            self.delegation.delegate(args.plan, moment, caller.actor)
        return self.launched(worker, task, caller)


    def launched(self, worker: Worker, task: Task, caller: Caller) -> int:
        self.sending.sent(worker, task, caller.actor)
        print(f"worker {worker.id} {worker.name} dispatched on {worker.provider} {worker.model}; it reports in the chat when it ends")
        return 0

    def library_names(self, args: Namespace) -> tuple[tuple[str, ...], tuple[str, ...]]:
        links = tuple(name.strip().rstrip("/") for name in args.libraries.split(",") if name.strip())
        copies = tuple(name.strip().rstrip("/") for name in args.copies.split(",") if name.strip())
        if not args.worktree and (links or copies or args.no_libraries):
            raise Rejection("library folders are for a worker with a worktree: add --worktree, or leave them out")
        if args.worktree and not (links or copies or args.no_libraries):
            raise Rejection("name the worktree's libraries: --libraries node_modules,.venv, --copies vendor, or --no-libraries")
        if args.no_libraries and (links or copies):
            raise Rejection("--no-libraries means none, so name no folders beside it")
        refusal = self.libraries.refusal((*links, *copies))
        if refusal:
            raise Rejection(refusal)
        return links, copies

    def assignment(self, n: int, caller: Caller) -> Task:
        task = self.tasks.find(n)
        for plan in self.plans.unapproved(task):
            plan.task_startable(task.id)
        if self.is_holder(task, caller) or task.is_assignable():
            return task
        if task.delegated and not task.state.is_closed():
            raise Rejection(DELEGATED_REFUSAL.format(n=n))
        raise Rejection(ASSIGNMENT_REFUSALS.get(task.state, EMPTY_BRIEF_REFUSAL).format(n=n, state=task.state))

    def is_holder(self, task: Task, caller: Caller) -> bool:
        agents = [] if caller.session is None else self.agents.global_matching(session=caller.session)
        return bool(agents) and self.tasks.holder(task) == Ref.build(agents[0])

    def allowed_model(self, provider: str, profile: str, model: str) -> str:
        moved, note = self.sending.allowed_model(provider, profile, model)
        if note:
            print(note)
        return moved

    def staffing(self, args: Namespace) -> tuple[str, str | None]:
        worker = self.workers.find(args.n)
        if args.profile is None:
            return (self.allowed_model(worker.provider, worker.profile, args.model) if args.model else worker.model), worker.profile
        self.sending.worker_profile(args.profile)
        return self.allowed_model(worker.provider, args.profile, args.model or self.sending.model(args.profile, worker.provider)), args.profile

    def report(self, args: Namespace, caller: Caller) -> int:
        worker = self.workers.find(args.n)
        message = self.reports.file(worker.with_(session=worker.session if caller.session is None else caller.session, touched_paths=self.branch.touched(worker)), args.text, caller.actor)
        print(f"worker {worker.id} reported in message {message.id}")
        return 0

    def send(self, args: Namespace, caller: Caller) -> int:
        if args.task:
            self.refused_in_review(self.workers.find(args.n))
        holdings = self.actions.task_holdings(args.n, args.task)
        if not args.task and not holdings:
            raise Rejection(f"worker {args.n} has no task: `journal worker send {args.n} --task <task> '<job>'`")
        worker = self.actions.resend(args.n, args.brief, *self.staffing(args), caller.session, caller.actor, self.tasks.find(args.task) if args.task else None)
        print(f"worker {worker.id} {worker.name} told, on {worker.model}; it reports in the chat when it ends")
        return 0

    @staticmethod
    def refused_in_review(worker: Worker) -> None:
        if worker.is_delivered():
            raise Rejection(f"worker {worker.id} waits for its check and merge: journal worker check {worker.id} <point>, then journal worker merge {worker.id}, or send the job to another worker")

    def check(self, args: Namespace, caller: Caller) -> int:
        if args.short:
            task = self.actions.short_check(args.n, args.point, args.short, caller.actor, args.task)
            print(f"point {args.point} of task {task.id} sent back short to worker {args.n}")
            return 0
        task = self.actions.check(args.n, args.point, caller.actor, args.task)
        print(f"point {args.point} of task {task.id} checked")
        return 0

    def merge(self, args: Namespace, caller: Caller) -> int:
        if args.all:
            return self.merge_all(caller)
        if args.n is None:
            raise Rejection("name the worker to merge, or --all for every worker whose work is checked")
        return self.merge_one(args.n, caller)

    def merge_all(self, caller: Caller) -> int:
        waiting = self.workers.delivered_workers(caller.session)
        if not waiting:
            raise Rejection("no worker of yours has clocked-out work waiting to merge")
        for worker in waiting:
            print(f"== worker {worker.id}, {worker.name}")
            print(self.actions.unchecked_line(worker) or self.merge_outcome(worker.id, caller))
        return 0

    def merge_outcome(self, n: int, caller: Caller) -> str:
        try:
            self.merge_one(n, caller)
            return f"worker {n} merged"
        except Rejection as refused:
            return str(refused)

    def merge_one(self, n: int, caller: Caller) -> int:
        outcome = self.actions.merge(n, caller.actor, MergeSteps(lambda line: print(line)))
        print(f"task {outcome.task.id} done: {outcome.task.outcome}")
        print(outcome.worktree or "it had no worktree")
        if outcome.finished:
            print(f"closed with it, from its queue: {', '.join(f'task {task.id}' for task in outcome.finished)}")
        if outcome.next_task:
            print(outcome.next_task)
        if self.work_mode.delegates_work():
            print(f"run the whole suite now: it has not passed since the merges of {self.checks.check().workers_line()}")
        return 0

    def queue(self, args: Namespace, caller: Caller) -> int:
        worker = self.workers.find(args.n)
        self.refused_in_review(worker)
        for n in reversed(args.tasks) if args.first else args.tasks:
            self.tasks.drop_holder(self.tasks.find(n), self.taking.holder(caller), caller.actor)
            (self.tasks.queued_first if args.first else self.tasks.queued)(self.tasks.find(n), Ref.build(worker), caller.actor)
        print(f"worker {worker.id} {worker.name} queue: {', '.join(f'task {task.id}' for task in self.tasks.queue(Ref.build(worker)))}, each delegated to it; it reports once no task is left")
        if not worker.is_running() and self.tasks.holder_task(Ref.build(worker)) is None:
            print(self.actions.next_job(worker.id, caller.actor))
        return 0

    def rebase(self, args: Namespace, caller: Caller) -> int:
        workers = [self.workers.find(n) for n in args.workers] or self.workers.rebase_candidates(caller.session)
        if not workers:
            raise Rejection("no worker of yours has a worktree to rebase")
        for worker in workers:
            print(self.rebases.immediate_rebase(worker, caller.actor) if args.force else self.rebases.rebase(worker, caller.actor))
        return 0

    def drain(self, args: Namespace, caller: Caller) -> int:
        worker = self.workers.find(args.n)
        waiting = self.tasks.queue(Ref.build(worker))
        self.tasks.unqueued(Ref.build(worker), caller.actor)
        if waiting:
            self.workers.save(worker.queue_drained([task.id for task in waiting], self.time_source.seconds()), caller.actor)
        print(f"worker {worker.id} {worker.name}: {', '.join(f'task {task.id}' for task in waiting)} given back, open again" if waiting else f"worker {worker.id} {worker.name} had nothing queued")
        return 0

    def release(self, args: Namespace, caller: Caller) -> int:
        worker = self.actions.release_dropping(args.n, caller.actor) if args.drop else self.actions.release(args.n, caller.actor)
        print(f"worker {worker.id} {worker.name} released; its task is free again")
        return 0

    def notify(self, args: Namespace, caller: Caller) -> int:
        worker = self.actions.notify(args.n, args.text, caller.actor)
        print(f"worker {worker.id} {worker.name} has the message in its session")
        return 0

    def wait(self, args: Namespace, caller: Caller) -> int:
        workers = [self.workers.find(n) for n in args.on]
        for worker in workers:
            if not worker.is_pending():
                print(self.state_line(worker))
        crew = [worker for worker in workers if worker.is_pending()]
        runs = self.targets.outputs.unended_outputs(args.output)
        if crew or runs:
            numbers = ", ".join(str(worker.id) for worker in crew)
            focus = f"the work of workers {numbers}" if crew else "the test run"
            refs = [worker.mention().ref() for worker in crew] + [self.targets.ref(run) for run in runs]
            self.events.wait_declared(focus + "".join(f" and output {run.id}" for run in runs), ",".join(refs), caller)
            print(f"awaiting {', '.join([f'workers {numbers}'] * bool(crew) + [f'output {run.id}' for run in runs])}: you are told as each ends, and when the last is done")
        return 0

    def state_line(self, worker: Worker) -> str:
        if not worker.is_delivered():
            return f"worker {worker.id}, {worker.name}, is not out: it is {worker.state}"
        task_ids = self.tasks.holder_task_ids(Ref.build(worker))
        if not task_ids:
            return f"worker {worker.id}, {worker.name}, clocked out and holds no task"
        return f"worker {worker.id}, {worker.name}, already clocked out: task {task_ids[0]} is ready to check; read its proofs with journal task show {task_ids[0]}, then journal worker check {worker.id} <point>"

    def stop(self, args: Namespace, caller: Caller) -> int:
        self.actions.stop(args.n, args.why, caller.actor)
        print(f"worker {args.n} stopped" + (f": {args.why}" if args.why else ""))
        return 0

    def complete(self, args: Namespace, caller: Caller) -> int:
        worker, dropped = self.actions.complete(args.n, args.why, caller.actor)
        print(f"worker {worker.id}'s report is acted on" + (f": {args.why}" if args.why else "") + (f"; {dropped}" if dropped else ""))
        return 0

    def discard(self, args: Namespace, caller: Caller) -> int:
        worker, dropped = self.actions.discard(args.n, args.why, caller.actor)
        print(f"worker {worker.id} is retired and its work thrown away: {args.why}" + (f"; {dropped}" if dropped else ""))
        return 0

    def peers(self, args: Namespace, caller: Caller) -> int:
        raise Rejection("only a worker has peers: `journal worker list` lists the workers you dispatched")

    def list(self, args: Namespace, caller: Caller) -> int:
        workers = list(reversed(self.workers.scoped_page(LISTED_WORKERS)))
        if len(workers) == LISTED_WORKERS:
            print(f"the newest {LISTED_WORKERS} workers are listed; `journal worker open` lists the ones to act on")
        for worker in workers:
            print(f"{worker.id:>4}  {worker.state:<10} {worker.name}: {CardDetail.shortened(worker.brief)}")
            print(self.standing_line(worker))
            if not worker.is_running():
                print(f"{'':>16}files: {worker.files_line()}")
        output = [str(worker.id) for worker in workers if worker.is_running()]
        if output:
            print(f"`journal worker wait {' '.join(output)}` waits for a report; listing again does not bring it sooner")
        self.print_subagents(caller.session)
        return 0

    def open(self, args: Namespace, caller: Caller) -> int:
        workers = self.workers.open_workers()
        for worker in workers:
            print(f"{worker.id:>4}  {worker.state:<10} {worker.name}: {CardDetail.shortened(worker.brief)}")
            print(self.standing_line(worker))
        subagents = [] if caller.session is None else self.subagents.running_session_subagents(caller.session)
        for subagent in subagents:
            print(f"{subagent.id:>4}  {subagent.state:<10} {subagent.agent_type}: {subagent.title_words()}")
        if not workers and not subagents:
            print("no worker or subagent to act on")
        return 0

    @staticmethod
    def standing_line(worker: Worker) -> str:
        return f"{'':>16}on {worker.model}, ${worker.cost_dollars:.2f} at API prices, sent back {worker.rejections()} times on this task"

    def print_subagents(self, session: str | None) -> None:
        subagents = [] if session is None else self.subagents.session_subagents(session)
        if subagents:
            print("subagents this agent started:")
        for subagent in subagents:
            print(f"{subagent.id:>4}  {subagent.state:<10} {subagent.agent_type}: {subagent.title_words()}")
            if subagent.is_idle():
                print(f"{'':>16}session: {subagent.session}")
        if any(subagent.is_idle() for subagent in subagents):
            print("an idle subagent takes its next job by SendMessage to its session; `journal subagent retire <n>` lets one go")

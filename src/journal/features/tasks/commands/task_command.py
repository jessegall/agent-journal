from argparse import Namespace
from datetime import datetime

from journal.console.command import Command
from journal.support.caller import Caller
from journal.engine.clock import Clock
from journal.support.rejection import Rejection
from journal.features.tasks.active_task import ActiveTask
from journal.features.tasks.support.task_briefing import TaskBriefing
from journal.features.tasks.support.block_check import BlockCheck
from journal.features.tasks.support.message_reminder import MessageReminder
from journal.features.tasks.support.waits import Waits
from journal.models.link import Link
from journal.models.message import Message
from journal.models.support.ref import Ref
from journal.models.environment import Environment
from journal.models.plan import Plan
from journal.models.task import Task
from journal.support.actor import Actor
from journal.models.worker import Worker
from journal.support.task_priority import NORMAL, TaskPriority
from journal.models.task_log import TaskLog
from journal.repositories.links import Links
from journal.repositories.messages import Messages
from journal.repositories.task_logs import TaskLogs
from journal.repositories.plans import PHASE_LINK, PLAN_LINK, Plans
from journal.repositories.questions import Questions
from journal.repositories.environments import Environments
from journal.repositories.tasks import Tasks
from journal.repositories.command_outputs import CommandOutputs
from journal.features.tasks.support.task_test_runs import TaskTestRuns
from journal.repositories.agents import Agents
from journal.features.tasks.support.next_task_reader import NextTaskReader
from journal.support.time_source import TimeSource
from journal.engine.support.assigner_resolution import AssignerResolution
from journal.engine.support.session_agents import SessionAgents
from journal.events.agent.next_tasks_request import NextTasksRequest
from journal.repositories.scope import Scope
CURRENT = "current"

# the open tasks a plain task list prints, highest priority first; the rest are counted
LIST_ROWS = 20

class TaskCommand(Command):
    noun = "task"
    uncut_verbs = frozenset({"show", "start", "complete"})

    def __init__(self, tasks: Tasks, logs: TaskLogs, messages: Messages, links: Links, plans: Plans, taking: ActiveTask, questions: Questions, waits: Waits, briefing: TaskBriefing, clock: Clock, next_tasks: NextTaskReader, check: BlockCheck, reminder: MessageReminder, time_source: TimeSource, assigners: AssignerResolution, sessions: SessionAgents, scope: Scope, agents: Agents, outputs: CommandOutputs, test_runs: TaskTestRuns, environments: Environments) -> None:
        self.environments = environments
        self.assigners, self.sessions, self.scope, self.agents, self.outputs, self.test_runs = assigners, sessions, scope, agents, outputs, test_runs
        self.clock, self.next_tasks, self.reminder, self.time_source = clock, next_tasks, reminder, time_source
        self.tasks, self.logs, self.messages, self.links, self.plans, self.taking, self.questions, self.waits, self.briefing = tasks, logs, messages, links, plans, taking, questions, waits, briefing
        self.check = check

    def arguments(self, verbs) -> None:
        creation = self.verb(verbs, "create", "file a task")
        creation.add_argument("title")
        transfer = self.verb(verbs, "transfer", "move a task, with its log, to another environment of this project")
        transfer.add_argument("n", type=int)
        transfer.add_argument("environment", help="the name of the environment it moves to")
        transfer.add_argument("--force", action="store_true", help="move a task in progress, blocked first, or a task of a plan here, taken out of the plan")
        rename = self.verb(verbs, "rename", "a task's title written again, when the first one was wrong")
        rename.add_argument("n", type=int)
        rename.add_argument("title")
        edit = self.verb(verbs, "edit", "a task's title or brief written anew, as when the user corrects what it is about")
        edit.add_argument("n", type=int)
        edit.add_argument("--title", default="")
        edit.add_argument("--brief", default="", help="the whole brief, which replaces the old one")
        edit.add_argument("--priority", default="", help="low, normal, high, critical or a number")
        edit.add_argument("--from", dest="message", type=int, default=0, help="the user's message this edit comes from")
        brief = self.verb(verbs, "brief", "a task's brief written anew, when what done looks like has changed")
        brief.add_argument("n", type=int)
        brief.add_argument("brief")
        creation.add_argument("--brief", default="")
        creation.add_argument("--priority", default="", help="low, normal, high, critical or a number; unnamed, the task is normal and is asked about with the others of the default priority")
        creation.add_argument("--start", action="store_true", help="start it at once")
        creation.add_argument("--from", dest="message", type=int, default=0, help="the user's message it was filed from")
        self.verb(verbs, "start", "take a task in hand").add_argument("n", type=int)
        log = self.verb(verbs, "log", "note where a task stands")
        log.add_argument("n", type=int)
        log.add_argument("line")
        finished = self.verb(verbs, "complete", "complete a task")
        finished.add_argument("n", type=int)
        finished.add_argument("--how", default="")
        dropped = self.verb(verbs, "cancel", "give a task up, undone, with why")
        dropped.add_argument("n", type=int)
        dropped.add_argument("--why", required=True)
        block = self.verb(verbs, "block", "a task waits on something outside your hands: blocked, with why, it is neither offered nor nudged")
        block.add_argument("n", type=int)
        block.add_argument("why", nargs="?", default="")
        Waits.arguments(block, "task")
        self.verb(verbs, "unblock", "what it waited on came: the task is open again").add_argument("n", type=int)
        manual = self.verb(verbs, "manual", "keep a task for the orchestrator to hand out by hand: the journal, dispatching the next tasks by itself, passes it over")
        manual.add_argument("n", type=int)
        manual.add_argument("--off", action="store_true", help="leave the task to the journal's own dispatch again")
        testing = self.verb(verbs, "test", "the work is done but a test run must say so: the task waits in testing, out of your hand; the run passing completes it, failing blocks it with what failed")
        testing.add_argument("n", type=int)
        testing.add_argument("--output", type=int, default=0, help="the run that tests it, by its output number")
        pause = self.verb(verbs, "pause", "no longer done: a task waits by being blocked")
        pause.add_argument("n", type=int)
        pause.add_argument("why", nargs="*")
        priorities = self.verb(verbs, "priorities", "the open tasks you made at the default priority: confirm states that normal is right for each")
        priorities.add_argument("action", choices=("confirm",))
        self.verb(verbs, "show", "a task whole: its title, state, plan and phase, brief and every log line in order").add_argument("n", help="the task's number, or current for the task in hand")
        self.verb(verbs, "list", "every task here not closed, and how many are done or cancelled").add_argument("--all", action="store_true", help="every task, the closed ones too")
        self.verb(verbs, "next", "the next tasks to hand out, as the task assigner in force chooses them: for the orchestrator the next tasks to give workers, plan by plan in turn; it starts none").add_argument("--quantity", type=int, default=1, help="how many tasks to name, the assigner choosing each in turn")

    def create(self, args: Namespace, caller: Caller) -> int:
        task = self.tasks.save(self.created(args), caller.actor)
        self.link_creation(args.message, task, caller)
        blocked = ""
        if args.start:
            task, blocked = self.handover(task, caller)
        unfiled = "" if args.message else self.reminder.creation_line(task, self.tasks.previous_creation(task))
        line = f"task {task.row_id} {task.state}" + (f" (from message {args.message})" if args.message else "")
        print("\n".join(filter(None, [line, blocked, unfiled])))
        return 0

    @staticmethod
    def created(args: Namespace) -> Task:
        task = Task(title=args.title, brief=args.brief)
        return task.prioritised(TaskPriority.parsed(args.priority)) if args.priority else task

    def link_creation(self, message: int, task: Task, caller: Caller) -> None:
        if not message or Ref.build(task) in self.links.targets(self.messages.find(message), Messages.SUBJECT_LINK):
            return
        for guessed in self.links.typed_source_links(task, Messages.SUBJECT_LINK, Message.table()):
            self.links.delete(guessed, caller.actor)
        self.links.save(Link(source=Ref.build(self.messages.find(message)), target=Ref.build(task), link_type=Messages.SUBJECT_LINK), caller.actor)

    def link_edit(self, message: int, task: Task, caller: Caller) -> None:
        if message:
            source = Ref.build(self.messages.find(message))
            self.links.save(Link(source=source, target=Ref.build(task), link_type=Messages.EDIT_LINK), caller.actor)
            self.links.save(Link(source=source, target=Ref.build(task), link_type=Messages.SUBJECT_LINK), caller.actor)

    def start(self, args: Namespace, caller: Caller) -> int:
        task, blocked = self.handover(self.tasks.find(args.n), caller)
        print("\n".join([*filter(None, [blocked]), f"task {task.row_id} started", *self.briefing.lines(task)]))
        return 0

    def handover(self, task: Task, caller: Caller) -> tuple[Task, str]:
        previous = self.taking.blocked_current(task, caller)
        started = self.taking.start(self.tasks.find(task.id), caller)
        return started, f"task {previous.row_id} blocked until task {started.id} closes" if previous is not None else ""

    def transfer(self, args: Namespace, caller: Caller) -> int:
        task, environment = self.tasks.find(args.n), self.environments.existing(args.environment)
        plans = self.plans.containing(task)
        self.refuse_transfer(task, plans, args.force)
        for plan in plans:
            self.plans.remove_task(plan, task, caller.actor)
        task = self.blocked_beside_work(task, environment, caller.actor)
        for line in self.logs.logs(task):
            self.logs.save(line.with_(environment_id=environment.id), caller.actor)
        self.tasks.save(task.transferred(environment.id, self.environments.find(task.environment_id).name, environment.name, self._time()), caller.actor)
        print(f"task {task.id} moved to environment {environment.name}")
        return 0

    def refuse_transfer(self, task: Task, plans: list[Plan], force: bool) -> None:
        if task.delegated:
            raise Rejection(f"task {task.id} is worker {self.tasks.holder(task).id}'s: release the worker first")
        if not force and task.is_active():
            raise Rejection(f"task {task.id} is in progress: block it first, or --force moves it as it is")
        if not force and plans:
            raise Rejection(f"task {task.id} is in plan {plans[0].id}: --force takes it out of the plan and moves it")

    def blocked_beside_work(self, task: Task, environment: Environment, actor: Actor) -> Task:
        if not task.is_started() or not self.tasks.environment_started_tasks(environment.id):
            return task
        return self.tasks.save(task.blocked(f"moved to environment {environment.name}, where a task is in progress", self._time()), actor)

    def rename(self, args: Namespace, caller: Caller) -> int:
        old_task = self.tasks.find(args.n)
        task = self.tasks.save(old_task.edited(args.title, old_task.brief, self.clock.time()), caller.actor)
        print("\n".join(filter(None, [f"task {task.row_id} is now: {task.title}", self.reminder.line(old_task)])))
        return 0

    def brief(self, args: Namespace, caller: Caller) -> int:
        old_task = self.tasks.find(args.n)
        task = self.tasks.save(old_task.edited(old_task.title, args.brief, self.clock.time()), caller.actor)
        print("\n".join(filter(None, [f"task {task.row_id} brief written anew", self.reminder.line(old_task)])))
        return 0

    def priorities(self, args: Namespace, caller: Caller) -> int:
        confirmed = [self.tasks.save(task.priority_confirmed(), caller.actor) for task in self.tasks.unprioritised()]
        print(f"{len(confirmed)} open tasks confirmed at normal priority" + (f": {', '.join(str(task.id) for task in confirmed)}" if confirmed else ""))
        return 0

    def edit(self, args: Namespace, caller: Caller) -> int:
        if not args.title and not args.brief and not args.priority and args.message:
            return self.message_linked(args, caller)
        if not args.title and not args.brief and not args.priority:
            raise Rejection("name what changes: --title \"<title>\", --brief \"<the whole brief>\", --priority <level>, --from <message>, or several")
        task = self.tasks.find(args.n)
        priority_task = task.prioritised(TaskPriority.parsed(args.priority)) if args.priority else task
        new_task = self.tasks.save(priority_task.edited(args.title or task.title, args.brief or task.brief, self.clock.time()), caller.actor)
        self.link_edit(args.message, new_task, caller)
        summary = f"task {task.row_id} edited: {' and '.join(name for name, value in (('title', args.title), ('brief', args.brief), ('priority', args.priority)) if value)} written anew"
        print("\n".join(filter(None, [summary + (f" (from message {args.message})" if args.message else ""), ("" if args.message else self.reminder.line(task))])))
        return 0

    def message_linked(self, args: Namespace, caller: Caller) -> int:
        task = self.tasks.find(args.n)
        self.link_edit(args.message, task, caller)
        print(f"message {args.message} linked to task {task.id}")
        return 0

    def log(self, args: Namespace, caller: Caller) -> int:
        task = self.readable(args.n, caller)
        if caller.is_main_agent() and not task.is_started():
            raise Rejection(f"task {task.row_id} is not in hand, so no log line: use `journal task edit {task.id} --brief`")
        self.logs.save(TaskLog.build(task, args.line, self.clock.time()), caller.actor)
        print(f"task {task.row_id} logged")
        return 0

    def pause(self, args: Namespace, caller: Caller) -> int:
        raise Rejection(f"tasks are blocked, never paused: `journal task block {args.n} \"<why>\"`, with --on task:<n> or --until \"<check>\"")

    def test(self, args: Namespace, caller: Caller) -> int:
        task = self.tasks.save(self.tasks.find(args.n).testing(self._time()), caller.actor)
        if not args.output:
            print(f"task {task.row_id} waits in testing: complete it with `journal task complete {task.id}` once it is tested")
            return 0
        output = self.outputs.find(args.output)
        self.test_runs.attach([task], output, caller.actor)
        print(f"task {task.row_id} waits in testing on output {output.id}: it completes when the run passes, and is blocked with what failed if it fails")
        return 0

    def block(self, args: Namespace, caller: Caller) -> int:
        self.waits.refuse_unnamed(args.why, args.on, args.until)
        self.check.refuse()
        task = self.tasks.save(self.tasks.find(args.n).blocked(args.why, self._time()), caller.actor)
        self.waits.linked(task, args.on, args.until, args.every, caller.actor)
        print(f"task {task.row_id} blocked, waiting on: {self.tasks.reason(task)}")
        return 0

    def manual(self, args: Namespace, caller: Caller) -> int:
        task = self.tasks.find(args.n)
        if args.off:
            self.tasks.save(task.left_to_the_journal(), caller.actor)
            print(f"task {task.row_id} is left to the journal's own dispatch again")
            return 0
        self.tasks.save(task.kept_by_hand(), caller.actor)
        print(f"task {task.row_id} is kept for you to hand out: the journal's own dispatch passes it over")
        return 0

    def unblock(self, args: Namespace, caller: Caller) -> int:
        task = self.tasks.save(self.tasks.find(args.n).unblocked("it was unblocked by hand", self._time().timestamp()), caller.actor)
        print(f"task {task.row_id} open again")
        return 0

    def complete(self, args: Namespace, caller: Caller) -> int:
        holdings = self.tasks.task_worker_holdings({args.n})
        if args.n in holdings and not caller.actor.can_move_worker_tasks():
            raise Rejection(f"task {args.n} is worker {holdings[args.n]}'s: check its proofs, then `journal worker merge {holdings[args.n]}`")
        task = self.tasks.find(args.n)
        if self.plans.has_phase_end_tests(task):
            return self.phase_tested(task, args.how, caller)
        task = self.tasks.save(task.completed(self._time(), args.how), caller.actor)
        print(f"task {task.row_id} done")
        self._name_next(task)
        return 0

    def phase_tested(self, task: Task, outcome: str, caller: Caller) -> int:
        self.logs.save(TaskLog.build(task, f"done, waiting for the phase's tests: {outcome}", self._time().timestamp()), caller.actor)
        task = self.tasks.save(task.testing(self._time()), caller.actor)
        print(f"task {task.row_id} waits in testing until the phase's test run passes: `journal output test <n>` on that run completes it")
        self._name_next(task)
        return 0

    def cancel(self, args: Namespace, caller: Caller) -> int:
        task = self.tasks.save(self.tasks.find(args.n).cancelled(self._time(), args.why), caller.actor)
        print(f"task {task.row_id} cancelled")
        self._name_next(task)
        return 0

    def readable(self, n: int, caller: Caller) -> Task:
        return self.tasks.find(n)

    def show(self, args: Namespace, caller: Caller) -> int:
        if args.n == CURRENT:
            holder = self.taking.holder(caller)
            current_task = self.tasks.holder_task(holder) if holder is not None else None
            if current_task is None:
                print("no task is in hand")
                return 0
            args.n = current_task.id
        task = self.readable(int(args.n), caller)
        print(f"""task {task.row_id}: {task.title}
state: {task.state}
{self.place(task)}{self.wait_line(task)}
{self.briefing.whole(task)}""")
        return 0

    def place(self, task: Task) -> str:
        plan = next((self.plans.find(ref.id) for ref in self.links.targets(task, PLAN_LINK)), None)
        if plan is None:
            return "plan: none"
        phases = self.plans.phase_states(plan)
        phase_ids = {ref.id for ref in self.links.targets(task, PHASE_LINK)}
        phase = next((p for p in phases if p.phase.id in phase_ids), None)
        return f"plan {plan.id}: {plan.title}" + (f", phase {phase.number} of {len(phases)}: {phase.phase.title}" if phase else "")

    def next(self, args: Namespace, caller: Caller) -> int:
        agent = self.sessions.agent(caller.agent_session, self.scope.id)
        request = NextTasksRequest(agent=agent).placed(agent, None, self.time_source.moment().timestamp())
        assignment = self.assigners.resolved(agent).next_task(agent, request, args.quantity)
        if not assignment.has_task():
            print("no task to hand out now: the builder is handed its next task at a stop or when its task closes")
            return 0
        for task in (self.tasks.find(task_id) for task_id in assignment.task_ids()):
            print(f"task {task.id}: {task.title}")
        print(assignment.reason)
        return 0

    def list(self, args: Namespace, caller: Caller) -> int:
        if args.all:
            print(self.task_lines(self.tasks.scoped()))
            return 0
        print(self.task_lines(self.tasks.unclosed_page(LIST_ROWS)))
        unshown, closed = self.tasks.unclosed_count() - LIST_ROWS, self.tasks.closed_count()
        if unshown > 0:
            print(f"and {unshown} more open: journal task list --all")
        if closed:
            print(f"and {closed} done or cancelled: journal task list --all")
        return 0

    def wait_line(self, task: Task) -> str:
        reason = self.tasks.reason(task)
        return f"\nwaiting on: {reason}" if reason else ""

    def task_lines(self, tasks: list[Task]) -> str:
        return "\n".join(self.task_line(task) for task in tasks)

    def task_line(self, task: Task) -> str:
        reason = self.tasks.reason(task)
        priority = "" if task.priority == NORMAL else f"  [{TaskPriority.label(task.priority)}]"
        wait = f"  [waiting on: {reason}]" if reason else ""
        return f"{task.id:>4}  {task.state:<8} {task.title}{priority}{wait}"

    def _name_next(self, closed: Task) -> None:
        next_task = self.next_tasks.holder_task(closed)
        if next_task:
            print(next_task.line())

    def _time(self) -> datetime:
        return self.time_source.moment()

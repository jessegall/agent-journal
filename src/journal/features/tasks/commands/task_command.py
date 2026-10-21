from argparse import Namespace
from dataclasses import replace
from datetime import datetime, timezone

from journal.console.command import Command
from journal.support.caller import Caller
from journal.engine.clock import Clock
from journal.engine.state_machine import StateMachine
from journal.support.refused import Refused
from journal.features.tasks.states.idle import Idle
from journal.features.tasks.support.in_hand import InHand
from journal.support.task_briefing import TaskBriefing
from journal.support.waits import Waits
from journal.features.tasks.states.working import Working
from journal.models.link import Link
from journal.support.ref import Ref
from journal.models.task import Task
from journal.models.task_log import TaskLog
from journal.models.task_state import TaskState
from journal.repositories.links import Links
from journal.repositories.messages import Messages
from journal.support.not_found import NotFound
from journal.repositories.task_logs import TaskLogs
from journal.repositories.plans import Plans
from journal.repositories.questions import Questions
from journal.repositories.tasks import Tasks, WAITS_ON
from journal.features.tasks.support.next_open_task import NextOpenTask


class TaskCommand(Command):
    noun = "task"

    def __init__(self, tasks: Tasks, logs: TaskLogs, machine: StateMachine, messages: Messages, links: Links, plans: Plans, taking: InHand, questions: Questions, waits: Waits, briefing: TaskBriefing, clock: Clock, next_task: NextOpenTask) -> None:
        self.clock, self.next_task = clock, next_task
        self.tasks, self.logs, self.machine, self.messages, self.links, self.plans, self.taking, self.questions, self.waits, self.briefing = tasks, logs, machine, messages, links, plans, taking, questions, waits, briefing

    def arguments(self, verbs) -> None:
        create = self.verb(verbs, "create", "file a task")
        create.add_argument("title")
        rename = self.verb(verbs, "rename", "a task's title said again, when the first one was wrong")
        rename.add_argument("n", type=int)
        rename.add_argument("title")
        brief = self.verb(verbs, "brief", "a task's brief written anew, when what done looks like has changed")
        brief.add_argument("n", type=int)
        brief.add_argument("brief")
        create.add_argument("--brief", default="")
        create.add_argument("--start", action="store_true", help="start it at once")
        create.add_argument("--from", dest="message", type=int, default=0, help="the user's message it was filed from")
        self.verb(verbs, "start", "take a task in hand").add_argument("n", type=int)
        log = self.verb(verbs, "log", "note where a task stands")
        log.add_argument("n", type=int)
        log.add_argument("line")
        done = self.verb(verbs, "done", "finish a task")
        done.add_argument("n", type=int)
        done.add_argument("--how", default="")
        block = self.verb(verbs, "block", "a task waits on something outside your hands: blocked, with why, it is neither offered nor nudged")
        block.add_argument("n", type=int)
        block.add_argument("why", nargs="?", default="")
        Waits.arguments(block, "task")
        self.verb(verbs, "unblock", "what it waited on came: the task is open again").add_argument("n", type=int)
        park = self.verb(verbs, "park", "set a task aside for something else first, by choice; it stays open and stops being nudged")
        park.add_argument("n", type=int)
        park.add_argument("why")
        self.verb(verbs, "resume", "pick a parked task up again").add_argument("n", type=int)
        self.verb(verbs, "list", "every open task here")

    def create(self, args: Namespace, caller: Caller) -> int:
        task = self.tasks.save(Task(title=args.title, brief=args.brief), caller.actor)
        if args.message:
            self.links.save(Link(source=Ref.to(self.messages.find(args.message)), target=Ref.to(task), kind=Messages.ABOUT), caller.actor)
        if args.start:
            task = self.taking.start(task, caller)
        print(f"task {task.id} {task.state}" + (f" (from message {args.message})" if args.message else ""))
        return 0

    def start(self, args: Namespace, caller: Caller) -> int:
        return self.taken(args.n, caller, "started")

    def rename(self, args: Namespace, caller: Caller) -> int:
        task = self.tasks.save(self.tasks.find(args.n).with_(title=args.title), caller.actor)
        print(f"task {task.id} is now: {task.title}")
        return 0

    def brief(self, args: Namespace, caller: Caller) -> int:
        task = self.tasks.save(self.tasks.find(args.n).with_(brief=args.brief), caller.actor)
        print(f"task {task.id} brief written anew")
        return 0

    def log(self, args: Namespace, caller: Caller) -> int:
        task = self.tasks.find(args.n)
        self.logs.save(TaskLog.of(task, args.line, self._now().timestamp()), caller.actor)
        current = self.taking.current(caller)
        if current and current.task_id == task.id:
            self.machine.move(caller.session, task.environment_id, current.logged(self.clock.now()))
        print(f"task {task.id} logged")
        return 0

    def park(self, args: Namespace, caller: Caller) -> int:
        task = self.tasks.save(self.tasks.find(args.n).parked(args.why, self._now()), caller.actor)
        print(f"task {task.id} parked")
        return 0

    def resume(self, args: Namespace, caller: Caller) -> int:
        return self.taken(args.n, caller, "resumed")

    def taken(self, n: int, caller: Caller, how: str) -> int:
        task = self.taking.start(self.tasks.find(n), caller)
        print("\n".join([f"task {task.id} {how}", *self.briefing.lines(task)]))
        return 0

    def block(self, args: Namespace, caller: Caller) -> int:
        self.waits.refuse_unnamed(args.why, args.on, args.until)
        task = self.tasks.save(self.tasks.find(args.n).blocked(args.why, self._now()), caller.actor)
        for ref in self.waits.named(args.on, args.until, args.every, f"task {task.id}", caller.actor):
            self.links.save(Link(source=Ref.to(task), target=ref, kind=WAITS_ON), caller.actor)
        print(f"task {task.id} blocked, waiting on: {self.tasks.reason(task)}")
        return 0

    def unblock(self, args: Namespace, caller: Caller) -> int:
        task = self.tasks.save(self.tasks.find(args.n).unblocked("the user opened it", self._now().timestamp()), caller.actor)
        print(f"task {task.id} open again")
        return 0

    def done(self, args: Namespace, caller: Caller) -> int:
        task = self.tasks.save(self.tasks.find(args.n).finished(self._now(), args.how), caller.actor)
        print(f"task {task.id} done")
        self._name_next(task)
        return 0

    def list(self, args: Namespace, caller: Caller) -> int:
        for task in self.tasks.in_():
            print(f"{task.id:>4}  {task.state:<8} {task.title}")
        return 0

    def _name_next(self, closed: Task) -> None:
        next_open = self.next_task.after(closed)
        if next_open:
            print(next_open.line())

    @staticmethod
    def _now() -> datetime:
        return datetime.now(timezone.utc)

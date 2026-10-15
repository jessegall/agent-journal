import time
from argparse import Namespace
from dataclasses import replace
from datetime import datetime, timezone

from journal.console.command import Command
from journal.console.where import Where
from journal.engine.machine import Machine
from journal.engine.states.paused import Paused
from journal.refused import Refused
from journal.features.tasks.states.idle import Idle
from journal.features.tasks.in_hand import InHand
from journal.features.tasks.states.expecting import Expecting
from journal.features.tasks.states.working import Working
from journal.models.link import Link
from journal.models.ref import Ref
from journal.models.task import Task
from journal.models.task_log import TaskLog
from journal.models.task_state import TaskState
from journal.repositories.environments import Environments
from journal.repositories.links import Links
from journal.repositories.messages import Messages
from journal.repositories.not_found import NotFound
from journal.repositories.task_logs import TaskLogs
from journal.repositories.plans import Plans
from journal.repositories.tasks import Tasks


class TaskCommand(Command):
    noun = "task"

    def __init__(self, tasks: Tasks, logs: TaskLogs, environments: Environments, machine: Machine, messages: Messages, links: Links, plans: Plans, in_hand: InHand) -> None:
        self.tasks, self.logs, self.environments, self.machine, self.messages, self.links, self.plans, self.in_hand = tasks, logs, environments, machine, messages, links, plans, in_hand

    def arguments(self, verbs) -> None:
        create = self.verb(verbs, "create", "file a task")
        create.add_argument("title")
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
        block.add_argument("why")
        self.verb(verbs, "unblock", "what it waited on came: the task is open again").add_argument("n", type=int)
        park = self.verb(verbs, "park", "set a task aside for something else first, by choice; it stays open and stops being nudged")
        park.add_argument("n", type=int)
        park.add_argument("why")
        self.verb(verbs, "resume", "pick a parked task up again").add_argument("n", type=int)
        wait = self.verb(verbs, "await", "the task in hand waits for something outside your hands, a run or a person; working again lifts it")
        wait.add_argument("n", type=int)
        wait.add_argument("what")
        self.verb(verbs, "list", "every open task here")

    def create(self, args: Namespace, where: Where) -> int:
        task = self.tasks.save(Task(environment_id=self.environments.named(where.environment).id, title=args.title, brief=args.brief), where.actor)
        if args.message:
            self.links.save(Link(source=Ref.to(self.messages.find(args.message)), target=Ref.to(task), kind=Messages.ABOUT), where.actor)
        if args.start:
            task = self.in_hand.start(task, where)
        print(f"task {task.id} {task.state}: {task.title}" + (f" (from message {args.message})" if args.message else ""))
        return 0

    def start(self, args: Namespace, where: Where) -> int:
        task = self.in_hand.start(self.tasks.find(args.n), where)
        print(f"task {task.id} started: {task.title}")
        return 0

    def log(self, args: Namespace, where: Where) -> int:
        task = self.tasks.find(args.n)
        self.logs.save(TaskLog(environment_id=task.environment_id, task_id=task.id, line=args.line), where.actor)
        current = self.in_hand.current(where)
        if current and current.task_id == task.id:
            self.machine.move(where.session, task.environment_id, current.logged(time.time()))
        print(f"task {task.id} logged")
        return 0

    def park(self, args: Namespace, where: Where) -> int:
        task = self.tasks.save(self.tasks.find(args.n).parked(args.why), where.actor)
        self.in_hand.let_go(task, where)
        print(f"task {task.id} parked: {task.title}")
        return 0

    def resume(self, args: Namespace, where: Where) -> int:
        task = self.in_hand.start(self.tasks.find(args.n), where)
        print(f"task {task.id} resumed: {task.title}")
        return 0

    def await_(self, args: Namespace, where: Where) -> int:
        current = self.in_hand.current(where)
        if not current or current.task_id != args.n:
            raise Refused(f"task {args.n} is not in hand: journal task start {args.n} first")
        self.machine.move(where.session, self.tasks.find(args.n).environment_id, Expecting.leaving(current, what=args.what))
        print(f"task {args.n} waits for {args.what}; working again lifts it")
        return 0

    def block(self, args: Namespace, where: Where) -> int:
        task = self.tasks.save(self.tasks.find(args.n).blocked(args.why), where.actor)
        self.in_hand.let_go(task, where)
        print(f"task {task.id} blocked: {task.title} (waiting on: {task.blocked_why})")
        return 0

    def unblock(self, args: Namespace, where: Where) -> int:
        task = self.tasks.save(self.tasks.find(args.n).unblocked(), where.actor)
        print(f"task {task.id} open again: {task.title}")
        return 0

    def done(self, args: Namespace, where: Where) -> int:
        task = self.tasks.save(self.tasks.find(args.n).finished(self._now(), args.how), where.actor)
        self.in_hand.let_go(task, where)
        print(f"task {task.id} done: {task.title}")
        self._name_next(task)
        return 0

    def list(self, args: Namespace, where: Where) -> int:
        for task in self.tasks.in_(self.environments.named(where.environment).id):
            print(f"{task.id:>4}  {task.state:<8} {task.title}")
        return 0

    def _name_next(self, done: Task) -> None:
        from journal.features.tasks.feature import Tasks
        open_ = self.plans.free(done.environment_id)
        if open_:
            print(Tasks.NEXT.about(n=open_[0].id, title=open_[0].title).rendered())

    @staticmethod
    def _now() -> datetime:
        return datetime.now(timezone.utc)

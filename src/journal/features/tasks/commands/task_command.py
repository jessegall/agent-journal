import time
from argparse import Namespace
from dataclasses import replace
from datetime import datetime, timezone

from journal.console.command import Command
from journal.support.where import Where
from journal.engine.machine import Machine
from journal.engine.states.paused import Paused
from journal.support.refused import Refused
from journal.features.tasks.states.idle import Idle
from journal.features.tasks.in_hand import InHand
from journal.features.tasks.task_briefing import TaskBriefing
from journal.features.tasks.waits import Waits
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


class TaskCommand(Command):
    noun = "task"

    def __init__(self, tasks: Tasks, logs: TaskLogs, machine: Machine, messages: Messages, links: Links, plans: Plans, in_hand: InHand, questions: Questions, waits: Waits, briefing: TaskBriefing) -> None:
        self.tasks, self.logs, self.machine, self.messages, self.links, self.plans, self.in_hand, self.questions, self.waits, self.briefing = tasks, logs, machine, messages, links, plans, in_hand, questions, waits, briefing

    def arguments(self, verbs) -> None:
        create = self.verb(verbs, "create", "file a task")
        create.add_argument("title")
        rename = self.verb(verbs, "rename", "a task's title said again, when the first one was wrong")
        rename.add_argument("n", type=int)
        rename.add_argument("title")
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

    def create(self, args: Namespace, where: Where) -> int:
        task = self.tasks.save(Task(title=args.title, brief=args.brief), where.actor)
        if args.message:
            self.links.save(Link(source=Ref.to(self.messages.find(args.message)), target=Ref.to(task), kind=Messages.ABOUT), where.actor)
        if args.start:
            task = self.in_hand.start(task, where)
        print(f"task {task.id} {task.state}" + (f" (from message {args.message})" if args.message else ""))
        return 0

    def start(self, args: Namespace, where: Where) -> int:
        return self.taken(args.n, where, "started")

    def rename(self, args: Namespace, where: Where) -> int:
        task = self.tasks.save(self.tasks.find(args.n).with_(title=args.title), where.actor)
        print(f"task {task.id} is now: {task.title}")
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
        print(f"task {task.id} parked")
        return 0

    def resume(self, args: Namespace, where: Where) -> int:
        return self.taken(args.n, where, "resumed")

    def taken(self, n: int, where: Where, said: str) -> int:
        task = self.in_hand.start(self.tasks.find(n), where)
        print("\n".join([f"task {task.id} {said}", *self.briefing.lines(task)]))
        return 0

    def block(self, args: Namespace, where: Where) -> int:
        if not args.why and not args.on and not args.until:
            raise Refused("say what it waits on: --on question:N or --on task:N, --until \"<command>\", or a reason in words")
        task = self.tasks.save(self.tasks.find(args.n).blocked(args.why), where.actor)
        for ref in self.waits.named(args.on, args.until, args.every, f"task {task.id}", where.actor):
            self.links.save(Link(source=Ref.to(task), target=ref, kind=WAITS_ON), where.actor)
        self.in_hand.let_go(task, where)
        print(f"task {task.id} blocked, waiting on: {self.tasks.reason(task)}")
        return 0

    def unblock(self, args: Namespace, where: Where) -> int:
        task = self.tasks.save(self.tasks.find(args.n).unblocked(), where.actor)
        print(f"task {task.id} open again")
        return 0

    def done(self, args: Namespace, where: Where) -> int:
        task = self.tasks.save(self.tasks.find(args.n).finished(self._now(), args.how), where.actor)
        self.in_hand.let_go(task, where)
        print(f"task {task.id} done")
        self._name_next(task)
        return 0

    def list(self, args: Namespace, where: Where) -> int:
        for task in self.tasks.in_():
            print(f"{task.id:>4}  {task.state:<8} {task.title}")
        return 0

    def _name_next(self, done: Task) -> None:
        from journal.features.tasks.feature import Tasks
        if self.tasks.in_hand() is not None or self.plans.is_moving(done):
            return
        parked = self.tasks.in_state(TaskState.PARKED)
        if parked:
            print(Tasks.PARKED_STILL.about(n=parked[0].id, why=parked[0].parked_why).rendered())
            return
        open_ = self.plans.free()
        if open_:
            print(Tasks.NEXT.about(n=open_[0].id, title=open_[0].title).rendered())

    @staticmethod
    def _now() -> datetime:
        return datetime.now(timezone.utc)

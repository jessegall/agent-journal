from argparse import Namespace
from datetime import datetime, timezone

from journal.console.command import Command
from journal.console.where import Where
from journal.engine.machine import Machine
from journal.refused import Refused
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
from journal.repositories.tasks import Tasks


class TaskCommand(Command):
    noun = "task"

    def __init__(self, tasks: Tasks, logs: TaskLogs, environments: Environments, machine: Machine, messages: Messages, links: Links) -> None:
        self.tasks, self.logs, self.environments, self.machine, self.messages, self.links = tasks, logs, environments, machine, messages, links

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
        park = self.verb(verbs, "park", "set a task aside for something else first")
        park.add_argument("n", type=int)
        park.add_argument("why")
        self.verb(verbs, "resume", "pick a parked task up again").add_argument("n", type=int)
        block = self.verb(verbs, "block", "a task waits on something outside your hands: blocked, with why, it is neither offered nor nudged")
        block.add_argument("n", type=int)
        block.add_argument("why")
        self.verb(verbs, "unblock", "what it waited on came: the task is open again").add_argument("n", type=int)
        wait = self.verb(verbs, "await", "wait for something outside your hands")
        wait.add_argument("n", type=int)
        wait.add_argument("what")
        self.verb(verbs, "list", "every open task here")

    def create(self, args: Namespace, where: Where) -> int:
        task = self.tasks.save(Task(environment_id=self.environments.named(where.environment).id, title=args.title, brief=args.brief), where.actor)
        if args.message:
            self.links.save(Link(source=Ref.to(self.messages.find(args.message)), target=Ref.to(task), kind=Messages.ABOUT), where.actor)
        if args.start:
            task = self._start(task, where)
        print(f"task {task.id} {task.state}: {task.title}" + (f" (from message {args.message})" if args.message else ""))
        return 0

    def start(self, args: Namespace, where: Where) -> int:
        task = self._start(self.tasks.find(args.n), where)
        print(f"task {task.id} started: {task.title}")
        return 0

    def log(self, args: Namespace, where: Where) -> int:
        task = self.tasks.find(args.n)
        self.logs.save(TaskLog(environment_id=task.environment_id, task_id=task.id, line=args.line), where.actor)
        current = self._in_hand(where)
        if current and current.task_id == task.id:
            self.machine.move(where.session, task.environment_id, current.logged())
        print(f"task {task.id} logged")
        return 0

    def park(self, args: Namespace, where: Where) -> int:
        task = self.tasks.save(self.tasks.find(args.n).parked(args.why), where.actor)
        self._let_go(task, where)
        print(f"task {task.id} parked: {task.title}")
        return 0

    def block(self, args: Namespace, where: Where) -> int:
        task = self.tasks.save(self.tasks.find(args.n).blocked(args.why), where.actor)
        self._let_go(task, where)
        print(f"task {task.id} blocked: {task.title} (waiting on: {task.blocked_why})")
        return 0

    def unblock(self, args: Namespace, where: Where) -> int:
        task = self.tasks.save(self.tasks.find(args.n).unblocked(), where.actor)
        print(f"task {task.id} open again: {task.title}")
        return 0

    def resume(self, args: Namespace, where: Where) -> int:
        task = self._start(self.tasks.find(args.n), where)
        print(f"task {task.id} resumed: {task.title}")
        return 0

    def await_(self, args: Namespace, where: Where) -> int:
        current = self._in_hand(where)
        if not current or current.task_id != args.n:
            raise Refused(f"task {args.n} is not in hand: journal task start {args.n} first")
        self.machine.move(where.session, self.tasks.find(args.n).environment_id, Expecting.leaving(current, what=args.what))
        print(f"task {args.n} waits for {args.what}; working again lifts it")
        return 0

    def done(self, args: Namespace, where: Where) -> int:
        task = self.tasks.save(self.tasks.find(args.n).finished(self._now(), args.how), where.actor)
        self._let_go(task, where)
        print(f"task {task.id} done: {task.title}")
        self._name_next(task)
        return 0

    def list(self, args: Namespace, where: Where) -> int:
        for task in self.tasks.in_(self.environments.named(where.environment).id):
            print(f"{task.id:>4}  {task.state:<8} {task.title}")
        return 0

    def _name_next(self, done: Task) -> None:
        from journal.features.tasks.feature import Tasks
        open_ = [t for t in self.tasks.in_state(done.environment_id, TaskState.OPEN)]
        if open_:
            print(Tasks.NEXT.about(n=open_[0].id, title=open_[0].title).rendered())

    def _start(self, task: Task, where: Where) -> Task:
        """One task in hand at a time: a second start is refused until the first is done or parked. Work declared without a task gives way to a task taken up."""
        current = self._in_hand(where)
        if current and current.task_id and current.task_id != task.id:
            raise Refused(f"task {current.task_id} is in hand: finish it or park it before you start task {task.id}")
        started = self.tasks.save(task.started(self._now()), where.actor)
        if where.session:
            self.machine.move(where.session, started.environment_id, Working(task_id=started.id))
        return started

    def _in_hand(self, where: Where) -> Working | None:
        if not where.session:
            return None
        try:
            current = self.machine.current(where.session)
        except NotFound:
            return None
        return current if isinstance(current, Working) else None

    def _let_go(self, task: Task, where: Where) -> None:
        """An agent that finished the task it was on is idle again."""
        if not where.session:
            return
        try:
            current = self.machine.current(where.session)
        except NotFound:
            return
        if isinstance(current, Working) and current.task_id == task.id:
            self.machine.move(where.session, task.environment_id, self.machine.states.first())

    @staticmethod
    def _now() -> datetime:
        return datetime.now(timezone.utc)

import time
from argparse import Namespace

from journal.console.command import Command
from journal.console.where import Where
from journal.engine.cards import Cards
from journal.engine.machine import Machine
from journal.refused import Refused
from journal.features.tasks.states.expecting import Expecting
from journal.features.tasks.in_hand import InHand
from journal.features.tasks.states.idle import Idle
from journal.models.task import Task
from journal.repositories.tasks import Tasks
from journal.features.tasks.states.working import Working
from journal.models.task_log import TaskLog
from journal.repositories.environments import Environments
from journal.repositories.task_logs import TaskLogs


class WorkCommand(Command):
    """Work declared without a task: a small change said in a sentence, logged as it goes, and ended with what came of it."""

    noun = "work"

    def __init__(self, machine: Machine, environments: Environments, logs: TaskLogs, cards: Cards, tasks: Tasks, in_hand: InHand) -> None:
        self.machine, self.environments, self.logs, self.cards = machine, environments, logs, cards
        self.tasks, self.in_hand = tasks, in_hand

    def arguments(self, verbs) -> None:
        self.verb(verbs, "start", "declare what you are doing before you write; no task needed for a small change").add_argument("what")
        self.verb(verbs, "log", "where the work in hand stands").add_argument("line")
        self.verb(verbs, "end", "the work is done").add_argument("--how", default="")
        self.verb(verbs, "await", "the work in hand waits for something outside your hands, a run or a person; working again lifts it").add_argument("what")
        park = self.verb(verbs, "park", "set the work in hand aside for something else first, by choice; it stays open and stops being nudged")
        park.add_argument("why")
        park.add_argument("--task", type=int, default=0, help="a task other than the one in hand")
        self.verb(verbs, "resume", "pick a parked task up again").add_argument("n", type=int)

    def start(self, args: Namespace, where: Where) -> int:
        if not where.session:
            raise Refused("work is an agent's: this shell is not an agent's")
        current = self.in_hand.current(where)
        if current and current.task_id:
            raise Refused(f"task {current.task_id} is in hand: finish it or park it before other work")
        self.machine.move(where.session, self.environment(where), Working(what=args.what, logged_at=time.time()))
        print(f"work started: {args.what}")
        return 0

    def log(self, args: Namespace, where: Where) -> int:
        current = self.in_hand.current(where)
        if not current:
            raise Refused("no work in hand: journal work start \"<what>\" first")
        self.logs.save(TaskLog(environment_id=self.environment(where), task_id=current.task_id, line=args.line), where.actor)
        self.machine.move(where.session, self.environment(where), current.logged(time.time()))
        print("work logged")
        return 0

    def end(self, args: Namespace, where: Where) -> int:
        current = self.in_hand.current(where)
        if not current or current.task_id:
            raise Refused("no work in hand without a task: a task ends with journal task done <n>")
        environment = self.environment(where)
        self.cards.show(environment, where.session, f"Work ended: {current.what}", "check", "good", args.how)
        self.machine.move(where.session, environment, Idle())
        print(f"work ended: {current.what}" + (f" ({args.how})" if args.how else ""))
        return 0

    def await_(self, args: Namespace, where: Where) -> int:
        current = self.in_hand.current(where)
        if not current:
            raise Refused("nothing is in hand to wait with: journal task start <n> or journal work start \"<what>\" first")
        self.machine.move(where.session, self.environment(where), Expecting.leaving(current, what=args.what))
        print(f"{current.named()} waits for {args.what}; working again lifts it")
        return 0

    def park(self, args: Namespace, where: Where) -> int:
        """The task in hand parked; declared work without a task becomes a parked task of its words, so it can be picked up again."""
        current = self.in_hand.current(where)
        task = self.tasks.find(args.task) if args.task else self.tasks.find(current.task_id) if current and current.task_id else None
        if task is None and current:
            task = self.tasks.save(Task(environment_id=self.environment(where), title=current.what), where.actor)
        if task is None:
            raise Refused("nothing is in hand to park: journal work park \"<why>\" --task <n> names one")
        parked = self.tasks.save(task.parked(args.why), where.actor)
        self.in_hand.let_go(parked, where)
        print(f"task {parked.id} parked: {parked.title}")
        return 0

    def resume(self, args: Namespace, where: Where) -> int:
        task = self.in_hand.start(self.tasks.find(args.n), where)
        print(f"task {task.id} resumed: {task.title}")
        return 0

    def environment(self, where: Where) -> int:
        return self.environments.named(where.environment).id

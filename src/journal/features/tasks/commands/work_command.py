import time
from argparse import Namespace

from journal.console.command import Command
from journal.console.where import Where
from journal.engine.cards import Cards
from journal.engine.machine import Machine
from journal.refused import Refused
from journal.features.tasks.states.expecting import Expecting
from journal.features.tasks.states.idle import Idle
from journal.features.tasks.states.working import Working
from journal.models.task_log import TaskLog
from journal.repositories.environments import Environments
from journal.repositories.task_logs import TaskLogs


class WorkCommand(Command):
    """Work declared without a task: a small change said in a sentence, logged as it goes, and ended with what came of it."""

    noun = "work"

    def __init__(self, machine: Machine, environments: Environments, logs: TaskLogs, cards: Cards) -> None:
        self.machine, self.environments, self.logs, self.cards = machine, environments, logs, cards

    def arguments(self, verbs) -> None:
        self.verb(verbs, "start", "declare what you are doing before you write; no task needed for a small change").add_argument("what")
        self.verb(verbs, "log", "where the work in hand stands").add_argument("line")
        self.verb(verbs, "end", "the work is done").add_argument("--how", default="")
        self.verb(verbs, "await", "the work in hand waits for something outside your hands, a run or a person; working again lifts it").add_argument("what")

    def start(self, args: Namespace, where: Where) -> int:
        current = self.in_hand(where)
        if current and current.task_id:
            raise Refused(f"task {current.task_id} is in hand: finish it or park it before other work")
        self.machine.move(where.session, self.environment(where), Working(what=args.what, logged_at=time.time()))
        print(f"work started: {args.what}")
        return 0

    def log(self, args: Namespace, where: Where) -> int:
        current = self.in_hand(where)
        if not current:
            raise Refused("no work in hand: journal work start \"<what>\" first")
        self.logs.save(TaskLog(environment_id=self.environment(where), task_id=current.task_id, line=args.line), where.actor)
        self.machine.move(where.session, self.environment(where), current.logged(time.time()))
        print("work logged")
        return 0

    def end(self, args: Namespace, where: Where) -> int:
        current = self.in_hand(where)
        if not current or current.task_id:
            raise Refused("no work in hand without a task: a task ends with journal task done <n>")
        environment = self.environment(where)
        self.cards.show(environment, where.session, f"Work ended: {current.what}", "check", "good", args.how)
        self.machine.move(where.session, environment, Idle())
        print(f"work ended: {current.what}" + (f" ({args.how})" if args.how else ""))
        return 0

    def await_(self, args: Namespace, where: Where) -> int:
        current = self.in_hand(where)
        if not current:
            raise Refused("nothing is in hand to wait with: journal task start <n> or journal work start \"<what>\" first")
        self.machine.move(where.session, self.environment(where), Expecting.leaving(current, what=args.what))
        print(f"{current.named()} waits for {args.what}; working again lifts it")
        return 0

    def environment(self, where: Where) -> int:
        return self.environments.named(where.environment).id

    def in_hand(self, where: Where) -> Working | None:
        if not where.session:
            raise Refused("work is an agent's: this shell is not an agent's")
        current = self.machine.current(where.session)
        return current if isinstance(current, Working) else None

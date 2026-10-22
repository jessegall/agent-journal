from argparse import Namespace

from journal.console.command import WORKER_KINDS, Command
from journal.models.support.ref import Ref
from journal.models.task import Task
from journal.models.worker import Worker
from journal.repositories.tasks import Tasks
from journal.repositories.worker_todos import WorkerTodos
from journal.support.caller import Caller
from journal.support.rejection import Rejection


class TodoCommand(Command):
    """journal todo: the to-do list a worker keeps inside the task it holds, in the order it writes it."""

    noun = "todo"
    callers = {"add": WORKER_KINDS, "check": WORKER_KINDS, "list": WORKER_KINDS}

    def __init__(self, tasks: Tasks, todos: WorkerTodos) -> None:
        self.tasks, self.todos = tasks, todos

    def arguments(self, verbs) -> None:
        self.verb(verbs, "add", "add an item to the end of your to-do list").add_argument("text")
        self.verb(verbs, "check", "mark an item of your to-do list complete, by its number").add_argument("k", type=int)
        self.verb(verbs, "list", "your to-do list in order, the complete items marked")

    def add(self, args: Namespace, caller: Caller) -> int:
        item = self.todos.appended(self.worker_task(caller), args.text, caller.actor)
        print(f"to-do {item.position} added: {item.text}")
        return 0

    def check(self, args: Namespace, caller: Caller) -> int:
        items = self.todos.task_items(self.worker_task(caller))
        if not 1 <= args.k <= len(items):
            raise Rejection(f"your to-do list has {len(items)} items: name one by its number, journal todo list shows them")
        self.todos.save(items[args.k - 1].completed(), caller.actor)
        print(f"to-do {args.k} complete: {items[args.k - 1].text}")
        return 0

    def list(self, args: Namespace, caller: Caller) -> int:
        for item in self.todos.task_items(self.worker_task(caller)):
            print(f"{item.position:>3}  [{'x' if item.complete else ' '}]  {item.text}")
        return 0

    def worker_task(self, caller: Caller) -> Task:
        holdings = [] if caller.worker_number is None else self.tasks.holder_task_ids(Ref(Worker.table(), caller.worker_number))
        if not holdings:
            raise Rejection("a to-do list is kept inside the task a worker holds: only a worker on a task keeps one")
        return self.tasks.find(holdings[0])

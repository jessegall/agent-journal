from argparse import Namespace
from datetime import datetime, timezone

from journal.console.command import Command
from journal.console.where import Where
from journal.models.actor import Actor
from journal.models.task import Task
from journal.models.task_log import TaskLog
from journal.repositories.task_logs import TaskLogs
from journal.repositories.tasks import Tasks


class TaskCommand(Command):
    noun = "task"

    def __init__(self, tasks: Tasks, logs: TaskLogs, where: Where) -> None:
        self.tasks, self.logs, self.where = tasks, logs, where

    def arguments(self, verbs) -> None:
        create = self.verb(verbs, "create", "file a task")
        create.add_argument("title")
        create.add_argument("--brief", default="")
        create.add_argument("--start", action="store_true", help="start it at once")
        self.verb(verbs, "start", "take a task in hand").add_argument("n", type=int)
        log = self.verb(verbs, "log", "note where a task stands")
        log.add_argument("n", type=int)
        log.add_argument("line")
        done = self.verb(verbs, "done", "finish a task")
        done.add_argument("n", type=int)
        done.add_argument("--how", default="")
        self.verb(verbs, "list", "every open task here")

    def create(self, args: Namespace, by: Actor) -> int:
        task = self.tasks.save(Task(environment_id=self.where.environment().id, title=args.title, brief=args.brief), by)
        if args.start:
            task = self.tasks.save(task.started(self._now()), by)
        print(f"task {task.id} {task.state}: {task.title}")
        return 0

    def start(self, args: Namespace, by: Actor) -> int:
        task = self.tasks.save(self.tasks.find(args.n).started(self._now()), by)
        print(f"task {task.id} started: {task.title}")
        return 0

    def log(self, args: Namespace, by: Actor) -> int:
        task = self.tasks.find(args.n)
        self.logs.save(TaskLog(environment_id=task.environment_id, task_id=task.id, line=args.line), by)
        print(f"task {task.id} logged")
        return 0

    def done(self, args: Namespace, by: Actor) -> int:
        task = self.tasks.save(self.tasks.find(args.n).finished(self._now(), args.how), by)
        print(f"task {task.id} done: {task.title}")
        return 0

    def list(self, args: Namespace, by: Actor) -> int:
        for task in self.tasks.in_(self.where.environment().id):
            print(f"{task.id:>4}  {task.state:<8} {task.title}")
        return 0

    @staticmethod
    def _now() -> datetime:
        return datetime.now(timezone.utc)

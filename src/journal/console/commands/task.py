from argparse import ArgumentParser, Namespace

from journal.models.actor import Actor

from journal.console.command import Command
from journal.repositories.task_logs import TaskLogs
from journal.repositories.tasks import Tasks


class TaskCommand(Command):
    noun = "task"

    def __init__(self, tasks: Tasks, logs: TaskLogs) -> None: ...

    def arguments(self, parser: ArgumentParser) -> None: ...

    def create(self, args: Namespace, by: Actor) -> int: ...

    def start(self, args: Namespace, by: Actor) -> int: ...

    def log(self, args: Namespace, by: Actor) -> int: ...

    def done(self, args: Namespace, by: Actor) -> int: ...

    def list(self, args: Namespace, by: Actor) -> int: ...

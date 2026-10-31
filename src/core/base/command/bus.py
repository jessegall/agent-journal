from typing import TypeVar

from core.base.actor import Actor
from core.base.clock import Clock
from core.base.command.command import Command
from core.base.command.context import Context
from core.base.command.handler import Handler, is_handler_class
from core.base.container import Container
from core.base.database.database import Database
from core.base.deadline import Deadline
from core.base.guard.explanation import Explanation
from core.base.registry.registry import Registry

R = TypeVar("R")



class MissingHandlerError(Exception):
    """Raised when no registered handler carries out a command."""


class TransactionError(Exception):
    """Raised when a command is run at the top inside a transaction, or nested outside one."""


class ExplanationRollback(Exception):
    """Raised at the end of a command run with --explain, so its transaction rolls back."""


class Bus:
    """Runs commands: a command at the top runs in a transaction of its own, rolled back when the caller's
    deadline passes before its commit; a command run inside another, by a handler or a listener, runs in a
    savepoint of that transaction with the same actor and timestamp."""

    def __init__(self, container: Container, database: Database, registry: Registry, clock: Clock, deadline: Deadline) -> None:
        self.container, self.database, self.registry, self.clock, self.deadline = container, database, registry, clock, deadline

    def run(self, command: Command[R], actor: Actor, skipped_guards: frozenset[str] = frozenset(), cause_id: int | None = None,
            environment_id: int | None = None) -> R:
        if self.database.has_transaction:
            raise TransactionError(f"{command.label()} was run at the top inside a transaction: dispatch it with the context instead")
        handler = self.handler(command)
        with self.database.transaction():
            context = Context(actor, self.clock.timestamp(), command, skipped_guards, cause_id, environment_id)
            command_output = self.result(handler.handle(command, context), command)
            self.deadline.check()
            return command_output

    def explain(self, command: Command[object], actor: Actor, skipped_guards: frozenset[str] = frozenset(), environment_id: int | None = None) -> Explanation:
        if self.database.has_transaction:
            raise TransactionError(f"{command.label()} was explained inside a transaction")
        handler, explanation = self.handler(command), Explanation()
        try:
            with self.database.transaction():
                handler.handle(command, Context(actor, self.clock.timestamp(), command, skipped_guards, None, environment_id, explanation))
                raise ExplanationRollback()
        except ExplanationRollback:
            return explanation

    def dispatch(self, command: Command[R], context: Context) -> R:
        if not self.database.has_transaction:
            raise TransactionError(f"{command.label()} was dispatched outside a transaction: run it instead")
        handler = self.handler(command)
        with self.database.savepoint(command.label()):
            return self.result(handler.handle(command, context.nested(command)), command)

    def handler(self, command: Command[object]) -> Handler[Command[object], object]:
        command_class = next((command_type for command_type in type(command).__mro__ if self.registry.has_handler(command_type)), None)
        if command_class is None:
            raise MissingHandlerError(f"no handler carries out {command.label()}")
        handler_class = self.registry.command_handler(command_class).loaded()
        if not is_handler_class(handler_class):
            raise MissingHandlerError(f"the handler of {command.label()} is no handler")
        return self.container.get(handler_class)

    def result(self, value: object, command: Command[R]) -> R:
        if command.is_result(value):
            return value
        raise TypeError(f"{command.label()} gave back a {type(value).__name__}, not the result its command names")

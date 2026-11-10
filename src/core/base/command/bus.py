from typing import TypeVar
from engine.actor.actor import Actor
from engine.time.clock import Clock
from core.base.command.command import Command
from core.base.command.context import Context
from core.base.command.handler import Handler, is_handler_class
from core.base.command.outside_run_rollback_error import OutsideRunRollbackError
from core.base.command.outside_runs import SERVER_THREAD_REASON, SINGLE_RUN_REASON, OutsideRuns
from core.base.command.script_policy import ScriptPolicy
from engine.container.container import Container
from core.base.database.database import Database
from engine.time.deadline import Deadline
from engine.text.explanation import Explanation
from core.base.registry.registry import Registry
from engine.scope.scopes import Scopes
from engine.time.timing import Timing
from core.base.command.missing_handler_error import MissingHandlerError
from core.base.command.transaction_error import TransactionError
from core.base.command.explanation_rollback_error import ExplanationRollbackError


R = TypeVar("R")
class Bus:
    """Runs commands in transactions: a locked command opens one unless it already runs inside one, and an unlocked
    command opens none; nested commands use savepoints inside a transaction."""

    def __init__(self, container: Container, database: Database, registry: Registry, clock: Clock, deadline: Deadline, timing: Timing, scopes: Scopes, policy: ScriptPolicy) -> None:
        self.container, self.database, self.registry, self.clock, self.deadline, self.timing, self.scopes, self.policy = container, database, registry, clock, deadline, timing, scopes, policy

    def run(self, command: Command[R], actor: Actor, skipped_guards: frozenset[str] = frozenset(), cause_id: int | None = None,
            environment_id: int | None = None, plugin_script: str = "", approval_id: int | None = None) -> R:
        if self.database.nested and (self.database.has_transaction or not command.lock):
            return self.dispatch(command, Context(actor, self.clock.timestamp(), command, skipped_guards, cause_id, environment_id, external_runs=OutsideRuns(True, plugin_script, SINGLE_RUN_REASON), approval_id=approval_id))
        if self.database.has_transaction:
            raise TransactionError(f"{command.label()} was run at the top inside a transaction: dispatch it with the context instead")
        handler = self.handler(command)
        handler.prepare(command, actor)
        with self.scopes.command_scope(handler.disabled_scopes, actor, environment_id):
            runs = self.create_deferred_runs(command, handler, plugin_script)
            if not command.lock:
                with self.database.savepoint(command.label()):
                    return self.result(handler.handle(command, Context(actor, self.clock.timestamp(), command, skipped_guards, cause_id, self.scopes.environment_id or environment_id, external_runs=runs, approval_id=approval_id)), command)
            while True:
                try:
                    with self.database.transaction(), self.database.savepoint(command.label()):
                        self.timing.stamp("write_started")
                        context = Context(actor, self.clock.timestamp(), command, skipped_guards, cause_id, self.scopes.environment_id or environment_id, external_runs=runs.next_round(), approval_id=approval_id)
                        command_output = self.result(handler.handle(command, context), command)
                        self.timing.stamp("handled")
                        runs.refuse_unfinished_work()
                        self.deadline.check()
                    self.timing.stamp("committed")
                    return command_output
                except OutsideRunRollbackError as rollback:
                    rollback.work.run(runs)

    def create_deferred_runs(self, command: Command[object], handler: Handler[Command[object], object], plugin_script: str) -> OutsideRuns:
        if handler.runs_once or not command.lock:
            return OutsideRuns(True, plugin_script, SINGLE_RUN_REASON)
        return OutsideRuns(not self.policy.guards_run, plugin_script, SERVER_THREAD_REASON)

    def run_with_context(self, command: Command[R], context: Context) -> R:
        if self.database.nested or self.database.has_transaction:
            return self.dispatch(command, context)
        return self.run(command, context.actor, context.skipped_guards, cause_id=context.cause_id, environment_id=context.environment_id, plugin_script=context.external_runs.plugin_script)

    def explain(self, command: Command[object], actor: Actor, skipped_guards: frozenset[str] = frozenset(), environment_id: int | None = None) -> Explanation:
        if self.database.has_transaction:
            raise TransactionError(f"{command.label()} was explained inside a transaction")
        handler, explanation = self.handler(command), Explanation()
        try:
            with self.scopes.command_scope(handler.disabled_scopes, actor, environment_id), self.database.transaction():
                handler.handle(command, Context(actor, self.clock.timestamp(), command, skipped_guards, None, self.scopes.environment_id or environment_id, explanation))
                raise ExplanationRollbackError()
        except ExplanationRollbackError:
            return explanation

    def dispatch(self, command: Command[R], context: Context) -> R:
        if not self.database.has_transaction and (command.lock or not self.database.nested):
            return self.run(command, context.actor, context.skipped_guards, cause_id=context.cause_id,
                            environment_id=context.environment_id, plugin_script=context.external_runs.plugin_script, approval_id=context.approval_id)
        handler = self.handler(command)
        if handler.has_prepare_step and not handler.caller_prepares:
            if self.database.has_transaction:
                raise TransactionError(f"{command.label()} has a prepare step, which a dispatch skips: run it instead")
            handler.prepare(command, context.actor)
        if handler.runs_once:
            context.external_runs.close()
        with self.database.savepoint(command.label()), self.scopes.command_scope(handler.disabled_scopes, context.actor, context.environment_id):
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

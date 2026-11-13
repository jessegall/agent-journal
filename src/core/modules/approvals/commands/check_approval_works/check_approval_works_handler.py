from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.caller.caller import Caller
from engine.cli.console import Console
from engine.cli.module_remove_line import MODULE_REMOVAL_ARGUMENTS
from engine.command.bus import Bus
from engine.command.check_approval_works import CheckApprovalWorks
from engine.command.command import Command
from engine.command.context import Context
from engine.command.dry_run import DryRunReachedEffect, dry_run
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from engine.subcommand.subcommand import Subcommand
from core.modules.actors.models.actor_record import ActorRecord


class CheckApprovalWorksHandler(Handler[CheckApprovalWorks, None]):
    """Explains what Accept would run, as the user who would accept, and refuses the request when that would
    fail, so a card that cannot work is never shown. Where no user has joined there is none to run it as,
    and a command whose handler does work before its transaction cannot be tried without doing that work,
    so it is not tried. A command that reaches a change outside the database has passed everything before
    it, and the dry run stops there."""

    command = CheckApprovalWorks

    def __init__(self, queries: Queries, bus: Bus, console: Console) -> None:
        self.queries, self.bus, self.console = queries, bus, console

    def handle(self, command: CheckApprovalWorks, context: Context) -> None:
        person = self.person(command.approval.required_person_id)
        if person is None:
            return None
        with dry_run():
            try:
                if command.approval.command is not None:
                    self.explain(command.approval.command, person, context)
                if command.arguments and list(command.arguments[:2]) != MODULE_REMOVAL_ARGUMENTS:
                    self.explain_line(command.arguments, Caller(person, context.environment_id), context)
            except Refusal as refusal:
                raise Refusal(f"this would fail when a user accepts it: {refusal.text}", "change the request so it works, then ask again") from None

    def person(self, person_id: int | None) -> Actor | None:
        people = self.queries.query(ActorRecord).filter(type=ActorType.USER)
        person = people.filter(id=person_id).first() if person_id is not None else people.first()
        return Actor(person.id, ActorType.USER) if person is not None else None

    def explain_line(self, arguments: tuple[str, ...], caller: Caller, context: Context) -> None:
        line = list(arguments)
        subcommand, _ = self.console.line_parser.parser(line)
        if not isinstance(subcommand, Subcommand):
            return None
        command, _ = self.console.line_command(line, caller)
        self.explain(command, caller.actor, context)

    def explain(self, command: Command[object], person: Actor, context: Context) -> None:
        if self.bus.handler(command).has_prepare_step:
            return None
        try:
            self.bus.explain(command, person, frozenset(), context.environment_id)
        except DryRunReachedEffect:
            return None

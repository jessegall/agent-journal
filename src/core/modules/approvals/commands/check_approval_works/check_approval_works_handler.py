import io
from contextlib import redirect_stderr, redirect_stdout

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.caller.caller import Caller
from core.base.cli.console import Console
from core.base.cli.module_remove_line import MODULE_REMOVAL_ARGUMENTS
from core.base.command.bus import Bus
from core.base.command.check_approval_works import CheckApprovalWorks
from core.base.command.command import Command
from core.base.command.context import Context
from core.base.command.dry_run import DryRunReachedEffect, dry_run
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.subcommand.subcommand import Subcommand
from core.modules.actors.models.actor_record import ActorRecord


class CheckApprovalWorksHandler(Handler[CheckApprovalWorks, None]):
    """Explains what Accept would run, as the person who would accept, and refuses the request when that would
    fail, so a card that cannot work is never shown. Where no person has joined there is none to run it as,
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
                raise Refusal(f"this would fail when a person accepts it: {refusal.text}", "change the request so it works, then ask again") from None

    def person(self, person_id: int | None) -> Actor | None:
        people = self.queries.query(ActorRecord).filter(type=ActorType.USER)
        person = people.filter(id=person_id).first() if person_id is not None else people.first()
        return Actor(person.id, ActorType.USER) if person is not None else None

    def explain_line(self, arguments: tuple[str, ...], caller: Caller, context: Context) -> None:
        line = list(arguments)
        subcommand, parser = self.console.line_parser.parser(line)
        if not isinstance(subcommand, Subcommand):
            return None
        captured_text = io.StringIO()
        try:
            with redirect_stdout(captured_text), redirect_stderr(captured_text):
                parsed = parser.parse_args(line[2:])
        except SystemExit:
            raise Refusal(captured_text.getvalue().strip()) from None
        self.explain(subcommand.command(parsed, caller), caller.actor, context)

    def explain(self, command: Command[object], person: Actor, context: Context) -> None:
        if self.bus.handler(command).has_prepare_step:
            return None
        try:
            self.bus.explain(command, person, frozenset(), context.environment_id)
        except DryRunReachedEffect:
            return None

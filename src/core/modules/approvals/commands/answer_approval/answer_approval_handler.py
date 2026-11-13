import io

from engine.enums.actor_type import ActorType
from engine.caller.caller import Caller
from engine.cli.console import Console, SUCCESS_CODE
from engine.cli.module_remove_line import MODULE_REMOVAL_ARGUMENTS, ModuleRemoveLine
from engine.cli.subcommand_lookup import SubcommandLookup
from engine.command.bus import Bus
from engine.command.command_json import CommandJson
from engine.command.context import Context
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.scope.scopes import Scopes
from core.modules.approvals.commands.answer_approval.answer_approval import AnswerApproval
from core.modules.approvals.commands.make_standing_approval.make_standing_approval import MakeStandingApproval
from core.modules.approvals.commands.move_approval.move_approval import MoveApproval
from core.modules.approvals.models.lifecycles.approval_lifecycle import ApprovalLifecycle
from core.modules.approvals.support.approval_result import ApprovalResult


class AnswerApprovalHandler(Handler[AnswerApproval, ApprovalResult]):
    """Claims a request before running its action with the deciding user's rights; an action that fails ends the
    request failed, with why, and it is never offered again: the agent asks anew."""

    command = AnswerApproval
    runs_once = True

    def __init__(self, bus: Bus, console: Console, scopes: Scopes, removal: ModuleRemoveLine, lookup: SubcommandLookup) -> None:
        self.bus, self.console, self.scopes = bus, console, scopes
        self.removal, self.lookup = removal, lookup

    def handle(self, command: AnswerApproval, context: Context) -> ApprovalResult:
        if not context.actor.is_person():
            raise Refusal("an agent cannot decide an approval request")
        request = self.bus.run(MoveApproval(command.row_id, ApprovalLifecycle.begin), context.actor, environment_id=context.environment_id)
        try:
            arguments = command.decision.choose(request.arguments, request.refused_arguments)
            output = io.StringIO()
            with self.scopes.opened(None):
                caller = Caller(context.actor, context.environment_id)
                code = self.run_action(arguments, caller, output)
                should_run_command = code == SUCCESS_CODE and request.command_json and command.decision.choose(True, False)
                if should_run_command:
                    self.bus.run(CommandJson.load(request.command_json, self.lookup), context.actor, environment_id=context.environment_id, approval_id=request.id)
                continued = command.decision.choose(request.continued_arguments, ())
                if code == SUCCESS_CODE and continued:
                    code = self.run_action(continued, caller, output)
            if code != SUCCESS_CODE:
                raise Refusal("the requested action failed", output.getvalue().strip())
            move = command.decision.choose(ApprovalLifecycle.accept, ApprovalLifecycle.refuse)
            ended = self.bus.run(MoveApproval(request.id, move), context.actor, environment_id=context.environment_id)
            self.keep_standing_yes(request.id, command, context)
        except Refusal as failure:
            self.failed(request.id, failure.text, command, context)
            raise
        except Exception as failure:
            self.failed(request.id, str(failure) or type(failure).__name__, command, context)
            raise
        return ApprovalResult(ended, output.getvalue())

    def failed(self, request_id: int, failure: str, command: AnswerApproval, context: Context) -> None:
        self.bus.run(MoveApproval(request_id, ApprovalLifecycle.fail, failure), context.actor, environment_id=context.environment_id)
        self.keep_standing_yes(request_id, command, context)

    def keep_standing_yes(self, request_id: int, command: AnswerApproval, context: Context) -> None:
        if command.standing is not None and command.decision.choose(True, False):
            self.bus.run(MakeStandingApproval(request_id, command.standing), context.actor, environment_id=context.environment_id)

    def run_action(self, arguments: tuple[str, ...], caller: Caller, output: io.StringIO) -> int:
        if not arguments:
            return SUCCESS_CODE
        if list(arguments[:2]) == MODULE_REMOVAL_ARGUMENTS:
            return self.removal.run_as(list(arguments), caller, output)
        return self.console.run(list(arguments), caller, output)

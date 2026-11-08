import io

from core.base.actor_type import ActorType
from core.base.caller.caller import Caller
from core.base.cli.console import Console, SUCCESS_CODE
from core.base.cli.module_remove_line import MODULE_REMOVAL_ARGUMENTS, ModuleRemoveLine
from core.base.command.bus import Bus
from core.base.command.command_json import CommandJson
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.scope.scopes import Scopes
from core.modules.approvals.commands.answer_approval.answer_approval import AnswerApproval
from core.modules.approvals.commands.make_standing_approval.make_standing_approval import MakeStandingApproval
from core.modules.approvals.commands.move_approval.move_approval import MoveApproval
from core.modules.approvals.models.lifecycles.approval_lifecycle import ApprovalLifecycle
from core.modules.approvals.support.approval_result import ApprovalResult


class AnswerApprovalHandler(Handler[AnswerApproval, ApprovalResult]):
    """Claims a request before running its action with the deciding person's rights."""

    command = AnswerApproval
    runs_once = True

    def __init__(self, bus: Bus, console: Console, scopes: Scopes, removal: ModuleRemoveLine) -> None:
        self.bus, self.console, self.scopes = bus, console, scopes
        self.removal = removal

    def handle(self, command: AnswerApproval, context: Context) -> ApprovalResult:
        if context.actor.type is not ActorType.USER:
            raise Refusal("an agent cannot decide an approval request")
        request = self.bus.run(MoveApproval(command.row_id, ApprovalLifecycle.begin), context.actor, environment_id=context.environment_id)
        try:
            arguments = command.decision.choose(request.arguments, request.refused_arguments)
            output = io.StringIO()
            with self.scopes.opened(None):
                caller = Caller(context.actor, context.environment_id)
                code = self.run_action(arguments, caller, output)
                if code == SUCCESS_CODE and request.command_json and command.decision.choose(True, False):
                    self.bus.run(CommandJson.load(request.command_json), context.actor, environment_id=context.environment_id, approval_id=request.id)
                continued = command.decision.choose(request.continued_arguments, ())
                if code == SUCCESS_CODE and continued:
                    code = self.run_action(continued, caller, output)
            move = command.decision.choose(ApprovalLifecycle.accept, ApprovalLifecycle.refuse) if code == SUCCESS_CODE else ApprovalLifecycle.retry
            ended = self.bus.run(MoveApproval(request.id, move), context.actor, environment_id=context.environment_id)
            if code == SUCCESS_CODE and command.standing is not None and command.decision.choose(True, False):
                self.bus.run(MakeStandingApproval(request.id, command.standing), context.actor, environment_id=context.environment_id)
        except Exception:
            self.bus.run(MoveApproval(request.id, ApprovalLifecycle.retry), context.actor, environment_id=context.environment_id)
            raise
        if code != SUCCESS_CODE:
            raise Refusal("the requested action failed", output.getvalue().strip())
        return ApprovalResult(ended, output.getvalue())

    def run_action(self, arguments: tuple[str, ...], caller: Caller, output: io.StringIO) -> int:
        if not arguments:
            return SUCCESS_CODE
        if list(arguments[:2]) == MODULE_REMOVAL_ARGUMENTS:
            return self.removal.run_as(list(arguments), caller, output)
        return self.console.run(list(arguments), caller, output)

from engine.command.bus import Bus
from engine.command.close_user_approval import CloseUserApproval
from engine.command.errors.user_approval_refusal import UserApprovalRefusal
from engine.command.request_user_approval import RequestUserApproval
from engine.event.changed import Changed
from engine.event.logged_event import LoggedEvent
from engine.listener.commit.commit_listener import CommitListener
from engine.module.module_actors import ModuleActors
from engine.scope.actor_scope import ActorScope
from engine.scope.environment_scope import EnvironmentScope
from core.modules.asks.commands.end_replaced_ask_stacks.end_replaced_ask_stacks import EndReplacedAskStacks
from core.modules.asks.models.ask_stack import AskStack

MODULE_NAME = "journal.core.asks"


class AskStackListener(CommitListener[Changed[AskStack]]):
    """Keeps one stack in force and one waiting per topic: a stack that comes into force ends the one it replaces, a
    new waiting stack ends the older waiting one, and a waiting stack is asked of the user in the approval dock."""

    name = "asks.stack-approval"
    disabled_scopes = [ActorScope, EnvironmentScope]

    def __init__(self, bus: Bus, actors: ModuleActors) -> None:
        self.bus, self.actors = bus, actors

    def handle(self, event: Changed[AskStack], logged: LoggedEvent) -> None:
        stack = event.row
        if stack.ended_at is None:
            self.end_others(stack, logged)
        self.update_request(stack, logged)

    def end_others(self, stack: AskStack, logged: LoggedEvent) -> None:
        self.bus.run(EndReplacedAskStacks(stack.id), self.actors.actor(MODULE_NAME), cause_id=logged.id, environment_id=stack.environment_id)

    def update_request(self, stack: AskStack, logged: LoggedEvent) -> None:
        arguments = ("ask-stack", "approve", str(stack.id))
        actor = self.actors.actor(MODULE_NAME)
        if stack.needs_approval and stack.ended_at is None:
            approval = UserApprovalRefusal(f"Use the question stack {stack.id} for {stack.topic}?", arguments, source_version=stack.version, request_reason=stack.levels_json)
            self.bus.run(RequestUserApproval(approval, arguments, stack.creator_id), actor, cause_id=logged.id, environment_id=stack.environment_id)
            return
        self.bus.run(CloseUserApproval(arguments), actor, cause_id=logged.id, environment_id=stack.environment_id)

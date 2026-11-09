from core.base.change.changed import Changed
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.command.close_user_approval import CloseUserApproval
from core.base.command.request_user_approval import RequestUserApproval
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from core.base.scope.actor_scope import ActorScope
from core.base.scope.environment_scope import EnvironmentScope
from core.base.user_approval_refusal import UserApprovalRefusal
from core.modules.secrets.models.secret import Secret


class SecretApprovalListener(CommitListener[Changed[Secret]]):
    """Asks a person before a proposed program can receive a secret."""

    name = "secrets.approval"
    disabled_scopes = [ActorScope, EnvironmentScope]

    def __init__(self, bus: Bus, actors: ModuleActors) -> None:
        self.bus, self.actors = bus, actors

    def handle(self, event: Changed[Secret], logged: LoggedEvent) -> None:
        secret = event.row
        actor = self.actors.actor("journal.core.secrets")
        for program in secret.proposed:
            if event.old_row is not None and program in event.old_row.proposed:
                continue
            arguments = ("secret", "allow", str(secret.id), program)
            approval = UserApprovalRefusal(f"Allow {program} to use the secret {secret.title}?", arguments,
                                           justification=f"The secret was proposed for {program}; it can use the secret once you allow it.")
            self.bus.run(RequestUserApproval(approval, arguments, logged.actor_id), actor,
                         cause_id=logged.id, environment_id=logged.environment_id)
        for program in secret.programs:
            if event.old_row is not None and program in event.old_row.programs:
                continue
            self.bus.run(CloseUserApproval(("secret", "allow", str(secret.id), program)), actor,
                         cause_id=logged.id, environment_id=logged.environment_id)

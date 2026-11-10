from core.base.change.changed import Changed
from core.base.change.logged_event import LoggedEvent
from core.base.change.registry_synced import RegistrySynced
from core.base.command.bus import Bus
from core.base.command.close_user_approval import CloseUserApproval
from core.base.command.request_user_approval import RequestUserApproval
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from engine.query.queries import Queries
from core.base.scope.actor_scope import ActorScope
from core.base.scope.environment_scope import EnvironmentScope
from engine.errors.user_approval_refusal import UserApprovalRefusal
from core.modules.agents.models.agent import Agent
from core.modules.triggers.models.trigger import Trigger


class TriggerApprovalListener(CommitListener[Changed[Trigger] | RegistrySynced]):
    """Keeps triggers needing permission in the shared approval dock."""

    name = "triggers.approval"
    disabled_scopes = [ActorScope, EnvironmentScope]

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries) -> None:
        self.bus, self.actors, self.queries = bus, actors, queries

    def handle(self, event: Changed[Trigger] | RegistrySynced, logged: LoggedEvent) -> None:
        triggers = tuple(self.queries.query(Trigger).filter(needs_enabling=True).all_rows()) if isinstance(event, RegistrySynced) else tuple([event.row])
        for trigger in triggers:
            self.update_request(trigger, logged)

    def update_request(self, trigger: Trigger, logged: LoggedEvent) -> None:
        actor = self.actors.actor("journal.core.triggers")
        arguments = ("trigger", "enable", str(trigger.id))
        environment_id = logged.environment_id
        if trigger.needs_enabling and trigger.ended_at is None:
            if environment_id is None:
                environment_id = self.queries.query(Agent).find(trigger.creator_id).environment_id
            approval = UserApprovalRefusal(f"Enable the trigger {trigger.name or trigger.text}?", arguments,
                                    ("trigger", "strike", str(trigger.id)), source_version=trigger.version, why=trigger.text)
            self.bus.run(RequestUserApproval(approval, arguments, trigger.creator_id), actor, cause_id=logged.id, environment_id=environment_id)
            return
        self.bus.run(CloseUserApproval(arguments), actor, cause_id=logged.id, environment_id=environment_id)

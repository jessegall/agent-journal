from engine.event.created import Created
from engine.event.moved import Moved
from engine.event.logged_event import LoggedEvent
from engine.event.registry_synced import RegistrySynced
from engine.command.bus import Bus
from engine.command.close_user_approval import CloseUserApproval
from engine.command.request_user_approval import RequestUserApproval
from engine.listener.commit.commit_listener import CommitListener
from engine.module.module_actors import ModuleActors
from engine.query.queries import Queries
from engine.scope.actor_scope import ActorScope
from engine.scope.environment_scope import EnvironmentScope
from engine.command.errors.user_approval_refusal import UserApprovalRefusal
from core.modules.sharing.commands.support.share_targets import ShareTargets
from core.modules.sharing.models.enums.share_link_state import ShareLinkState
from core.modules.sharing.models.share_link import ShareLink
from core.modules.sharing.models.lifecycles.share_link_lifecycle import ShareLinkLifecycle


class ShareApprovalListener(CommitListener[Created[ShareLink] | Moved[ShareLink] | RegistrySynced]):
    """Keeps waiting share links in the shared approval dock until a person decides them."""

    name = "sharing.approval"
    moves = (ShareLinkLifecycle.accept, ShareLinkLifecycle.deny, ShareLinkLifecycle.revoke)
    disabled_scopes = [ActorScope, EnvironmentScope]

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries, targets: ShareTargets) -> None:
        self.bus, self.actors, self.queries, self.targets = bus, actors, queries, targets

    def handle(self, event: Created[ShareLink] | Moved[ShareLink] | RegistrySynced, logged: LoggedEvent) -> None:
        links = tuple(self.queries.query(ShareLink).filter(state=ShareLinkState.WAITING).all_rows()) if isinstance(event, RegistrySynced) else tuple([event.row])
        for link in links:
            self.update_request(link, logged.id)

    def update_request(self, link: ShareLink, cause_id: int) -> None:
        actor = self.actors.actor("journal.core.sharing")
        arguments = ("share", "accept", str(link.id))
        if link.state is ShareLinkState.WAITING:
            shared = self.targets.shared_row(link)
            approval = UserApprovalRefusal(f"Share {shared.title} with a read-only link?", arguments,
                                    ("share", "deny", str(link.id)), source_version=link.version, returns_output=True,
                                    request_reason=f"Agent {link.creator_id} made a link that lets anyone who has it read {shared.title}.")
            self.bus.run(RequestUserApproval(approval, arguments, link.creator_id), actor,
                         cause_id=cause_id, environment_id=link.environment_id)
            return
        self.bus.run(CloseUserApproval(arguments), actor, cause_id=cause_id, environment_id=link.environment_id)

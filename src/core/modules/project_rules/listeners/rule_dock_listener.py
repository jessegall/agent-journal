from engine.event.logged_event import LoggedEvent
from engine.event.registry_synced import RegistrySynced
from engine.command.bus import Bus
from engine.command.request_user_approval import RequestUserApproval
from engine.command.close_user_approval import CloseUserApproval
from engine.command.errors.user_approval_refusal import UserApprovalRefusal
from engine.listener.commit.commit_listener import CommitListener
from engine.module.module_actors import ModuleActors
from engine.query.queries import Queries
from engine.scope.actor_scope import ActorScope
from engine.scope.environment_scope import EnvironmentScope
from core.modules.agents.models.agent import Agent
from core.modules.docking.commands.remove_dock_item.remove_dock_item import RemoveDockItem
from core.modules.docking.models.dock import Dock
from core.modules.docking.models.enums.dock_item_state import DockItemState
from core.modules.docking.queries.dock_item_query import DockItemQuery
from core.modules.project_rules.models.enums.rule_dock_type import RuleDockType
from core.modules.project_rules.models.enums.rule_state import RuleState
from core.modules.project_rules.models.project_rule import ProjectRule
from engine.event.changed import Changed

MODULE_NAME = "journal.core.project-rules"


class RuleDockListener(CommitListener[Changed[ProjectRule] | RegistrySynced]):
    """Moves proposed rules into the shared approval dock and removes their former cards."""

    name = "project_rules.proposed-dock"
    disabled_scopes = [ActorScope, EnvironmentScope]

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries, items: DockItemQuery) -> None:
        self.bus, self.actors, self.queries, self.items = bus, actors, queries, items

    def handle(self, event: Changed[ProjectRule] | RegistrySynced, logged: LoggedEvent) -> None:
        rules = tuple(self.queries.query(ProjectRule).filter(state=RuleState.PROPOSED).get()) if isinstance(event, RegistrySynced) else tuple([event.row])
        for rule in rules:
            self.update_request(rule, logged)

    def update_request(self, rule: ProjectRule, logged: LoggedEvent) -> None:
        actor = self.actors.actor(MODULE_NAME)
        docked = self.items.type_items(RuleDockType.PROPOSED.value).row_items(ProjectRule.model_name, rule.id).filter(state=DockItemState.DOCKED).get()
        docks = {dock.id: dock for dock in self.queries.query(Dock).find_many([item.dock_id for item in docked])}
        for item in docked:
            self.bus.run(RemoveDockItem(item.id), actor, cause_id=logged.id, environment_id=docks[item.dock_id].environment_id)
        arguments = ("rule", "approve", str(rule.id))
        environment_id = logged.environment_id
        if rule.state is RuleState.PROPOSED:
            if environment_id is None:
                environment_id = self.queries.query(Agent).find(rule.creator_id).environment_id
            approval = UserApprovalRefusal("Add this project rule?", arguments, ("rule", "deny", str(rule.id)), source_version=rule.version, request_reason=rule.text)
            self.bus.run(RequestUserApproval(approval, arguments, rule.creator_id), actor, cause_id=logged.id, environment_id=environment_id)
            return
        self.bus.run(CloseUserApproval(arguments), actor, cause_id=logged.id, environment_id=environment_id)

from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.base.scope.actor_scope import ActorScope
from core.base.scope.environment_scope import EnvironmentScope
from core.modules.agents.models.agent import Agent
from core.modules.docking.commands.add_dock_item.add_dock_item import AddDockItem
from core.modules.docking.commands.remove_dock_item.remove_dock_item import RemoveDockItem
from core.modules.docking.models.dock import Dock
from core.modules.docking.models.enums.dock_item_state import DockItemState
from core.modules.docking.queries.dock_item_query import DockItemQuery
from core.modules.project_rules.models.enums.rule_dock_type import RuleDockType
from core.modules.project_rules.models.enums.rule_state import RuleState
from core.modules.project_rules.models.project_rule import ProjectRule
from core.base.change.changed import Changed

MODULE_NAME = "journal.core.project-rules"


class RuleDockListener(CommitListener[Changed[ProjectRule]]):
    """A rule an agent proposed docks above the chat of its environment until a person approves or denies it."""

    name = "project_rules.proposed-dock"
    disabled_scopes = [ActorScope, EnvironmentScope]

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries, items: DockItemQuery) -> None:
        self.bus, self.actors, self.queries, self.items = bus, actors, queries, items

    def handle(self, event: Changed[ProjectRule], logged: LoggedEvent) -> None:
        rule = event.row
        actor = self.actors.actor(MODULE_NAME)
        if rule.state is RuleState.PROPOSED:
            environment_id = logged.environment_id or self.queries.query(Agent).find(rule.creator_id).environment_id
            self.bus.run(AddDockItem(RuleDockType.PROPOSED.value, ProjectRule.model_name, rule.id), actor, cause_id=logged.id, environment_id=environment_id)
            return
        docked = list(self.items.type_items(RuleDockType.PROPOSED.value).row_items(ProjectRule.model_name, rule.id).filter(state=DockItemState.DOCKED).all_rows())
        docks = {dock.id: dock for dock in self.queries.query(Dock).find_many([item.dock_id for item in docked])}
        for item in docked:
            self.bus.run(RemoveDockItem(item.id), actor, cause_id=logged.id, environment_id=docks[item.dock_id].environment_id)

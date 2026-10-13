from engine.organization import Role
from events import Fact
from events.organization import RoleAgentToStop, RoleTodoToStart
from features.organization.agents import start_role_agent
from receiving import Handler
from resources.types import Todo
from serving import Elsewhere, Processes


class StartNextForGlobalRole(Handler[RoleTodoToStart]):
    def handle(self, event: RoleTodoToStart, elsewhere: Elsewhere, processes: Processes) -> list[Fact]:
        place = elsewhere.named(event.environment)
        todos = place.rows(Todo)
        todos.unblock(event.n)
        role = Role(name=event.role, title=event.title, cardinality=event.cardinality, runs=event.runs)
        if started := start_role_agent(place.record, role, event.n, event.task, processes):
            todos.update(event.n, role_environment=started)
        return []


class StopRoleAgent(Handler[RoleAgentToStop]):
    def handle(self, event: RoleAgentToStop, elsewhere: Elsewhere, processes: Processes) -> list[Fact]:
        processes.stop(elsewhere.here().record, event.environment)
        return []

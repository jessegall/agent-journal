from controllers.types import Todos
from engine.events.resources import TodoCompleted
from expects import Answered, Given, Kept, Refused, Unchanged
from features.base import Feature
from features.tickets.controller import Tickets
from resources.base import AGENT, USER
from resources.types import Todo
from features.journal import Journal
from features.organization.commands import Delegate, ReportCoversOutputs, ShowOrganization
from features.organization.details import OrganizationDetails
from features.organization.handlers import StartNextForGlobalRole


NO_ORGANIZATION = "no organization yet: add agentic-organization/domains/<domain>/domain.toml and roles/<role>/role.toml"
CLOSED = TodoCompleted(n=5, type="todo", action="completed", actor=USER)


class OrganizationFeature(Feature):
    details = OrganizationDetails

    def register(self, journal: Journal) -> None:
        journal.commands.add("ticket", ShowOrganization(), expects=[
            Given((Tickets,)) >> Answered({"domains": [], "out": NO_ORGANIZATION}),
        ])
        journal.commands.add("todo", Delegate(), expects=[
            Given((Todos, "Fix the login", "web")) >> Refused("the organization has no domain 'web'; it has none"),
        ])
        journal.commands.intercept("todo.update", ReportCoversOutputs(), expects=[
            Given((Todos, {"actor": AGENT}, {"n": 5, "title": "A new title"}), rows=[Todo(n=5, title="Fix the login")]) >> Kept(),
            Given((Todos, {"actor": AGENT}, {"n": 5, "reported": "not a record"}), rows=[Todo(n=5, title="Fix the login")]) >> Kept(),
            Given((Todos, {"actor": AGENT}, {"n": 5, "reported": {"how": "Done and tested"}}), rows=[Todo(n=5, title="Fix the login")]) >> Kept(),
        ])
        journal.events.handler(StartNextForGlobalRole(), expects=[
            Given(CLOSED, rows=[Todo(n=5, title="Fix the login", completed=1.0)]) >> Unchanged(),
        ])

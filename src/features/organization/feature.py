from controllers.types import Todos
from events.todos import TodoCompleted
from engine.organization import AGENT as RUNS_AS_AGENT, Role
from events.asking import RowWriting
from events.organization import RoleAgentToStop, RoleTodoToStart
from expects import Answered, Dispatches, Given, Kept, Ran, Refused, Updated, answering, nothing
from features.organization.agents import kickoff
from framework.base import Feature
from controllers.types import Tickets
from resources.base import AGENT, USER
from resources.types import Todo
from framework.journal import Journal
from features.organization.commands import Delegate, ShowOrganization
from features.organization.details import OrganizationDetails
from features.organization.handlers import StartNextForGlobalRole, StopRoleAgent
from features.organization.listeners import SpotRoleWorkToHandOn
from features.organization.refusing import ReportCoversOutputs


NO_ORGANIZATION = "no organization yet: add agentic-organization/domains/<domain>/domain.toml and roles/<role>/role.toml"
CLOSED = TodoCompleted(n=5, type="todo", action="completed", actor=USER)
KICKOFF = kickoff("t", Role(name="developer", runs=RUNS_AS_AGENT), 6, "Fix the footer\n")


def updating(**fields) -> RowWriting:
    return RowWriting(type="todo", action="update", actor=AGENT, fields=(("n", 5), *fields.items()))


class OrganizationFeature(Feature):
    details = OrganizationDetails

    def register(self, journal: Journal) -> None:
        journal.commands.add("ticket", ShowOrganization(), expects=[
            Given((Tickets,)) >> Answered({"domains": [], "out": NO_ORGANIZATION}),
        ])
        journal.commands.add("todo", Delegate(), expects=[
            Given((Todos, "Fix the login", "web")) >> Refused("the organization has no domain 'web'; it has none"),
        ])
        journal.commands.refuse(RowWriting, ReportCoversOutputs(), expects=[
            Given(updating(title="A new title"), rows=[Todo(n=5, title="Fix the login")]) >> Kept(),
            Given(updating(reported="not a record"), rows=[Todo(n=5, title="Fix the login")]) >> Kept(),
            Given(updating(reported={"how": "Done and tested"}), rows=[Todo(n=5, title="Fix the login")]) >> Kept(),
        ])
        journal.events.listen(TodoCompleted, SpotRoleWorkToHandOn(), expects=[
            Given(CLOSED, rows=[Todo(n=5, title="Fix the login", completed=1.0)]) >> Dispatches(nothing),
            Given(CLOSED, rows=[Todo(n=5, title="Fix the login", completed=1.0, data={"role_environment": "t-developer-5"})]) >> Dispatches(RoleAgentToStop(environment="t-developer-5")),
        ])
        journal.events.handle(RoleTodoToStart, StartNextForGlobalRole(), expects=[
            Given(RoleTodoToStart(environment="t", n=6, task="Fix the footer\n", role="developer", title="", cardinality=Role().cardinality, runs=RUNS_AS_AGENT), rows=[Todo(n=6, title="Fix the footer", data={"blocked": "waits"})],
                  processes=answering({("start agent", "t-developer-6", "todo:6", KICKOFF): "t-developer-6"}))
                >> Updated(Todo(n=6), role_environment="t-developer-6"),
        ])
        journal.events.handle(RoleAgentToStop, StopRoleAgent(), expects=[
            Given(RoleAgentToStop(environment="t-developer-5"), rows=[], processes=answering({("tell", "t-developer-5", "x"): False})) >> Ran(("stop", "t-developer-5")),
        ])

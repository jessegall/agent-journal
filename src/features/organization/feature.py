from controllers.types import Todos
from events.todos import TodoCompleted
from framework.organization import AGENT as RUNS_AS_AGENT, Role
from events.asking import RowWriting
from events.organization import RoleAgentToStop, RoleTodoToStart
from expects import Answered, Dispatches, Given, Kept, Ran, Refused, Updated, Wrote, answering, nothing
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


ENGINEERING = "agentic-organization/domains/engineering"
ORGANIZED = answering({
    f"{ENGINEERING}/domain.toml": 'title = "Engineering"\nlead = "lead"\n',
    f"{ENGINEERING}/roles/lead/role.toml": 'title = "Engineering lead"\n',
    f"{ENGINEERING}/roles/developer/role.toml": 'title = "Developer"\ninputs = ["acceptance"]\noutputs = ["tests"]\nmodel = "sonnet"\n',
})
LOGIN = Todo(n=5, title="Fix the login")
DEVELOPING = Todo(n=5, title="Build dark mode", data={"domain": "engineering", "role": "developer"})


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
            Given((Todos, "Build dark mode", "engineering", "developer"), files=ORGANIZED) >> Refused("developer needs acceptance named in the task or --given"),
            Given((Todos, "Fix the login", "engineering", "tester"), files=ORGANIZED) >> Refused("domain engineering has no role 'tester'; it has developer, lead"),
            Given((Todos, "Build search", "engineering", "developer", "acceptance: results in 100ms"), rows=[DEVELOPING], files=ORGANIZED)
                >> Updated(Todo(title="Build search"), after=["todo:5"]),
            Given((Todos, "Build dark mode", "engineering", "developer", "acceptance: the toggle persists"), files=ORGANIZED)
                >> Wrote(Todo(title="Build dark mode", data={"domain": "engineering", "role": "developer"})),
        ])
        journal.commands.refuse(RowWriting, ReportCoversOutputs(), expects=[
            Given(updating(title="A new title"), rows=[LOGIN]) >> Kept(),
            Given(updating(reported="not a record"), rows=[LOGIN]) >> Kept(),
            Given(updating(reported={"how": "Done and tested"}), rows=[LOGIN]) >> Kept(),
            Given(updating(reported={"how": "built it"}), rows=[DEVELOPING], files=ORGANIZED) >> Refused("developer's report covers tests; it does not mention tests"),
            Given(updating(reported={"how": "built it; tests pass"}), rows=[DEVELOPING], files=ORGANIZED) >> Kept(),
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

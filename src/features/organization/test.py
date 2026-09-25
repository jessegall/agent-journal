import pytest

from controllers.base import COMMANDS

from features.organization.files import organization
from resources.base import Refused


def write(folder, text):
    folder.parent.mkdir(parents=True, exist_ok=True)
    folder.write_text(text)


def test_the_organization_is_read_from_domain_and_role_files_and_refuses_what_does_not_fit(tmp_path):
    home = tmp_path / "agentic-organization" / "domains" / "engineering"
    write(home / "domain.toml", 'title = "Engineering"\nlead = "lead"\nresponsible = "the code and its tests"\n')
    write(home / "roles" / "lead" / "role.toml", 'title = "Engineering lead"\n')
    write(home / "roles" / "developer" / "role.toml", 'title = "Developer"\nskills = ["python"]\ncardinality = "plural"\n')
    found = organization(tmp_path)
    engineering = found.domain("engineering")
    assert (engineering.title, engineering.lead, [r.name for r in engineering.roles], engineering.role("developer").skills,
            engineering.role("lead").cardinality) == ("Engineering", "lead", ["developer", "lead"], ["python"], "worktree"), \
        "a domain and its roles come from their files, a role one of a kind per ticket unless it says plural"
    with pytest.raises(Refused, match="no role 'tester'"):
        engineering.role("tester")
    write(home / "roles" / "developer" / "role.toml", 'cardinality = "everywhere"\n')
    with pytest.raises(Refused, match="cardinality is one of"):
        organization(tmp_path)
    write(home / "roles" / "developer" / "role.toml", 'runs = "agent"\n')
    assert organization(tmp_path).domain("engineering").role("developer").runs == "agent", "a role can run as a full agent of its own"
    write(home / "roles" / "developer" / "role.toml", 'runs = "daemon"\n')
    with pytest.raises(Refused, match="runs is agent"):
        organization(tmp_path)
    assert organization(tmp_path / "elsewhere").text().startswith("no organization yet"), "a project without the folder has an empty organization"


def test_a_task_is_delegated_to_a_role_queues_behind_its_own_and_is_reported_against_its_outputs(tmp_path):
    import features
    from controllers.types import Todos
    from resources.base import AGENT
    from tests.conftest import fresh, refused
    features.load()
    record = fresh()
    home = record.root.parent / "agentic-organization" / "domains" / "engineering"
    write(home / "domain.toml", 'title = "Engineering"\nlead = "lead"\n')
    write(home / "roles" / "lead" / "role.toml", 'title = "Engineering lead"\n')
    write(home / "roles" / "developer" / "role.toml", 'title = "Developer"\ninputs = ["acceptance"]\noutputs = ["tests"]\nmodel = "sonnet"\n')
    write(home / "roles" / "developer" / "AGENTS.md", "Write tests first.\n")
    write(home / "skills" / "review" / "SKILL.md", "Review before merging.\n")
    todos = Todos(record, actor=AGENT)
    delegate = lambda *args, **kwargs: COMMANDS["todo"]["delegate"](todos, *args, **kwargs)
    assert "needs acceptance" in refused(lambda: delegate("Build dark mode", "engineering", role="developer")), "a task must carry its role's inputs"
    first = delegate("Build dark mode", "engineering", role="developer", given="acceptance: the toggle persists")
    second = delegate("Build search", "engineering", role="developer", given="acceptance: results in 100ms")
    assert (first["waits"], second["waits"], "You are Developer in Engineering." in first["brief"], "with model sonnet" in first["brief"]) == (0, first["todo"], True, True), \
        "a role one of a kind per ticket takes its tasks one after another, and each comes with its lead's brief"
    assert (str(home / "roles" / "developer" / "AGENTS.md") in first["brief"], str(home / "skills" / "review" / "SKILL.md") in first["brief"]) == (True, True), \
        "the brief points at the role's AGENTS.md and at the skills of its role and domain"
    reporter = Todos(record, actor=AGENT, agent="a1")
    assert "does not mention tests" in refused(lambda: reporter.report(first["todo"], "built it")), "a report must cover the role's outputs"
    assert reporter.report(first["todo"], "built it; tests pass").data["reported"]["how"] == "built it; tests pass"


def test_a_role_with_a_browser_is_pointed_at_its_tickets_app():
    from features.organization.delegation import brief
    from features.organization.files import Domain, Role
    domain, role = Domain(name="engineering", title="Engineering"), Role(name="checker", title="Checker", tools=["browser"])
    assert "Open the ticket's app at http://127.0.0.1:8441" in brief(domain, role, 3, "Check the toggle", "", "http://127.0.0.1:8441"), \
        "a role granted a browser is told where the ticket's app runs"
    assert "Open the ticket's app" not in brief(domain, Role(name="writer"), 3, "Write the docs", "", "http://127.0.0.1:8441"), "a role without one is not"


def test_the_board_counts_each_role_by_the_tickets_where_its_work_is_in_hand():
    from types import SimpleNamespace
    import features
    from controllers.types import Todos, Works
    from engine.record import Record
    from features.tickets.controller import Tickets
    from resources.base import AGENT
    from tests.conftest import fresh
    features.load()
    record = fresh()
    home = record.root.parent / "agentic-organization" / "domains" / "engineering"
    write(home / "domain.toml", 'title = "Engineering"\nlead = "lead"\n')
    write(home / "roles" / "lead" / "role.toml", 'title = "Engineering lead"\n')
    write(home / "roles" / "developer" / "role.toml", 'title = "Developer"\ncardinality = "plural"\n')
    ticket_env = Record(record.root, "ticket-7")
    todos = Todos(ticket_env, actor=AGENT)
    todos.create("Build dark mode", domain="engineering", role="developer")
    started = todos.create("Build search", domain="engineering", role="developer")
    Works(ticket_env, actor=AGENT).create("Build search", todo=started.n)
    tickets = Tickets(record, actor=AGENT)
    tickets._running = lambda: [SimpleNamespace(n=7, title="Search", work_environment="ticket-7")]
    roles = {role["name"]: role["tickets"] for role in tickets._roles()}
    working = [{"n": 7, "title": "Search", "env": "", "worktree": "ticket-7"}]
    assert roles == {"engineering/developer": working, "engineering/lead": []}, roles
    domain = COMMANDS["ticket"]["organization"](tickets)["domains"][0]
    assert domain["working"] == [{"role": "developer", "role_title": "Developer", **working[0]}], "a domain lists the agents working in it"


def test_a_global_role_takes_one_task_at_a_time_across_every_environment():
    import features
    from controllers.types import Todos
    from engine.record import Record
    from resources.base import AGENT
    from tests.conftest import fresh
    features.load()
    record = fresh()
    home = record.root.parent / "agentic-organization" / "domains" / "operations"
    write(home / "domain.toml", 'title = "Operations"\nlead = "deployer"\n')
    write(home / "roles" / "deployer" / "role.toml", 'title = "Deployer"\ncardinality = "global"\n')
    first_env, second_env = Record(record.root, "ticket-1"), Record(record.root, "ticket-2")
    delegate = lambda env, task: COMMANDS["todo"]["delegate"](Todos(env, actor=AGENT), task, "operations")
    first = delegate(first_env, "Deploy dark mode")
    second = delegate(second_env, "Deploy search")
    waiting = Todos(second_env, actor=AGENT).load(second["todo"])
    assert (bool(Todos(first_env, actor=AGENT).load(first["todo"]).blocked), bool(waiting.blocked), waiting.data["waits_for"]) == (False, True, f"ticket-1:{first['todo']}"), \
        "the deployer runs once per journal: a second ticket's task waits for the first, wherever it is"
    Todos(first_env, actor=AGENT).complete(first["todo"], "deployed")
    assert not Todos(second_env, actor=AGENT).load(second["todo"]).blocked, "and starts once the first is done"


def test_a_role_that_runs_as_an_agent_is_started_in_the_tickets_worktree(monkeypatch):
    import features
    from controllers.types import Todos
    from engine.record import Record
    from resources.base import AGENT
    from tests.conftest import fresh
    features.load()
    record = fresh()
    home = record.root.parent / "agentic-organization" / "domains" / "engineering"
    write(home / "domain.toml", 'title = "Engineering"\nlead = "developer"\n')
    write(home / "roles" / "developer" / "role.toml", 'title = "Developer"\ncardinality = "plural"\nruns = "agent"\n')
    launched = []
    monkeypatch.setattr("engine.terminal.detached", lambda root, cwd, place, agent, args: launched.append((place, args)))
    ticket = Record(record.root, "ticket-5")
    given = COMMANDS["todo"]["delegate"](Todos(ticket, actor=AGENT), "Build search", "engineering")
    place, args = launched[0]
    assert (given["agent"], place, "--worktree" in args and args[args.index("--worktree") + 1]) == ("ticket-5-developer-1", "ticket-5-developer-1", "ticket-5"), \
        "a full-agent role gets an environment of its own, working in the ticket's worktree"
    assert Todos(ticket, actor=AGENT).load(given["todo"]).data["role_environment"] == "ticket-5-developer-1" and "Nothing to dispatch" in given["brief"]

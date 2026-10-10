import pytest

import features
from controllers.base import COMMANDS
from controllers.types import Environments

from engine.organization import organization
from resources.base import SYSTEM, Refused
from tests.conftest import fresh, refused


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
    with pytest.raises(Refused, match="has no domain 'design'; it has engineering"):
        found.domain("design")
    write(home / "roles" / "developer" / "role.toml", 'title = "Developer\n')
    with pytest.raises(Refused, match="cannot be read"):
        organization(tmp_path)
    write(home / "roles" / "developer" / "role.toml", 'title = "Developer"\n')
    write(home / "domain.toml", 'title = "Engineering"\nlead = "lead"\n')
    first = organization(tmp_path)
    assert organization(tmp_path) is first, "the organization is read once and handed back while none of its files has changed"
    write(home / "roles" / "developer" / "role.toml", 'title = "Developer, changed"\n')
    assert organization(tmp_path).domain("engineering").role("developer").title == "Developer, changed", "and read again as soon as one has"
    write(home / "domain.toml", 'title = "Engineering"\nlead = "architect"\n')
    with pytest.raises(Refused, match="its lead 'architect' is not one of its roles"):
        organization(tmp_path)


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
    from engine.organization import Domain, Role
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
    working = [{"n": 7, "plan": 0, "title": "Search", "env": "", "worktree": "ticket-7"}]
    assert roles == {"engineering/developer": working, "engineering/lead": []}, roles
    domain = COMMANDS["ticket"]["organization"](tickets)["domains"][0]
    assert domain["working"] == [{"role": "developer", "role_title": "Developer", **working[0]}], "a domain lists the agents working in it"
    write(home / "roles" / "developer" / "role.toml", 'cardinality = "everywhere"\n')
    assert tickets._roles() == [], "a board whose organization files cannot be read shows no roles rather than failing"


def test_a_global_role_takes_one_task_at_a_time_across_every_environment(monkeypatch):
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
    write(home / "roles" / "deployer" / "role.toml", 'title = "Deployer"\ncardinality = "global"\nruns = "agent"\n')
    launched = []
    monkeypatch.setattr("agents.terminal.detached", lambda root, cwd, place, agent, args: launched.append(place))
    Todos(first_env, actor=AGENT).complete(first["todo"], "deployed")
    assert not Todos(second_env, actor=AGENT).load(second["todo"]).blocked, "and starts once the first is done"
    assert (len(launched), bool(Todos(second_env, actor=AGENT).load(second["todo"]).data.get("role_environment"))) == (1, True), \
        "a role that runs as an agent has one started for the task that was waiting, and the task remembers where it works"


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
    monkeypatch.setattr("agents.terminal.detached", lambda root, cwd, place, agent, args: launched.append((place, args)))
    ticket = Record(record.root, "ticket-5")
    given = COMMANDS["todo"]["delegate"](Todos(ticket, actor=AGENT), "Build search", "engineering")
    place, args = launched[0]
    assert (given["agent"], place, "--worktree" in args and args[args.index("--worktree") + 1]) == ("ticket-5-developer-1", "ticket-5-developer-1", "ticket-5"), \
        "a full-agent role gets an environment of its own, working in the ticket's worktree"
    write(home / "roles" / "developer" / "role.toml", 'title = "Developer"\ncardinality = "plan"\nruns = "agent"\n')
    entered = []
    monkeypatch.setattr("features.organization.agents.tell_in", lambda record, name, provider, text: entered.append(name) or len(entered) > 1)
    plan = Todos(Record(record.root, "plan-3"), actor=AGENT)
    agents = [COMMANDS["todo"]["delegate"](plan, task, "engineering")["agent"] for task in ("Draw the header", "Draw the footer")]
    assert (agents, len(launched)) == (["plan-3-developer", "plan-3-developer"], 2), \
        "a plan role keeps one agent for the whole plan and hands it each next task"
    assert Todos(ticket, actor=AGENT).load(given["todo"]).data["role_environment"] == "ticket-5-developer-1" and "Nothing to dispatch" in given["brief"]
    write(home / "roles" / "developer" / "role.toml", 'title = "Developer"\ncardinality = "plural"\nruns = "agent"\n')
    stopped = []
    monkeypatch.setattr("features.organization.handlers.stop_in", lambda record, name: stopped.append(name))
    Todos(ticket, actor=AGENT).complete(given["todo"], "built")
    assert stopped == ["ticket-5-developer-1"], "the agent a finished task had of its own is stopped"


def test_an_environment_is_named_taken_left_swept_removed_and_brought_back_by_the_one_session_that_holds_it():
    import features
    from controllers.types import Environments, Todos
    from engine.record import Record
    from engine.sessions import Sessions
    from resources.base import AGENT, SYSTEM
    from tests.conftest import fresh, refused
    features.load()
    record = fresh()
    envs = lambda session="claude-1": Environments(record, actor=SYSTEM, session=session)
    first = envs().create("alpha")
    assert "needs a name" in refused(lambda: envs().create("  ")), "an environment is never nameless"
    assert "exists" in refused(lambda: envs().create("alpha")), "a name already taken is refused"
    assert "viewer's own addresses" in refused(lambda: envs().create("plugins")), "a word the viewer's own addresses use is not a name"
    assert "no session to bind" in refused(lambda: Environments(record, actor=SYSTEM).switch(first.n)), "taking an environment needs a session to take it"
    second = envs().create("beta")
    envs().switch(first.n)
    assert Sessions(record.root).holder("alpha") == "claude-1", "the session that took an environment holds it"
    assert "is taken by session claude-1" in refused(lambda: envs("claude-2").switch(first.n)), "another session cannot take a held environment without a reason"
    envs().switch(second.n)
    assert Sessions(record.root).read("claude-1").before == "alpha", "a session remembers where it came from"
    envs().switch(0, back=True)
    assert Sessions(record.root).environment("claude-1") == "alpha", "going back returns to the environment it came from"
    assert "came from nowhere" in refused(lambda: envs("claude-9").switch(0, back=True)), "a session that came from nowhere has nowhere to go back to"
    picked = envs().pickup(first.n)
    assert picked["environment"] == "alpha" and picked["holder"] == "claude-1", "picking up an environment says who holds it"
    assert "does not hold" in refused(lambda: envs().leave(second.n)), "a session cannot leave an environment it does not hold"
    envs().leave(first.n)
    assert Sessions(record.root).holder("alpha") == "", "leaving frees the environment"
    Todos(Record(record.root, "alpha"), actor=AGENT).create("an open job")
    swept = envs().sweep(first.n)
    assert "a sweep of 'alpha'" in swept and "--yes sweeps" in swept, "a sweep says what it would pack before it does"
    assert "has nothing to sweep" in envs().sweep(second.n, yes=True), "an environment with nothing finished has nothing to sweep"
    assert "--yes removes it anyway" in refused(lambda: envs().complete(first.n)), "an environment that still holds open rows is not removed unless that is said"
    alpha = Record(record.root, "alpha")
    finished = Todos(alpha, actor=AGENT).create("a finished job")
    Todos(alpha, actor=AGENT).complete(finished.n, "done")
    note = record.root.parent / "note.txt"
    note.write_text("kept beside the row")
    Todos(alpha, actor=AGENT).attach(finished.n, str(note))
    assert envs().sweep(first.n, yes=True).startswith("swept"), "what is finished is packed into the attic together with the files beside it"
    assert "no archived environment 'gone'" in refused(lambda: envs().unarchive("gone")), "bringing back an environment that was never archived is refused"
    Todos(Record(record.root, "beta"), actor=AGENT).create("the ledger bug")
    envs().complete(second.n, yes=True)
    assert [r["title"] for r in envs().rows.summaries() if not r["deleted"]].count("beta") == 0, "a removed environment is gone from the list"
    from engine.attic import searched
    assert [(hit.environment, hit.title) for hit in searched(record.root, "LEDGER bug")] == [("beta", "the ledger bug")], \
        "a removed environment's rows are found in the attic, named with the environment that brings them back"
    import tarfile
    from engine.attic import archive_hits, title_of
    broken, whole = record.root.parent / "broken.tar.gz", record.root.parent / "whole.tar.gz"
    broken.write_text("not an archive")
    nested = record.root.parent / "whole" / "environments"
    nested.mkdir(parents=True)
    with tarfile.open(whole, "w:gz") as tar:
        tar.add(nested.parent, arcname="whole")
    assert (archive_hits(broken, "ledger"), archive_hits(whole, "ledger"), title_of("---\n{not json\n---\nthe body")) == ([], [], ""), \
        "an archive that cannot be read, a whole project's archive and a row whose heading is broken add nothing to a search"
    again = envs().unarchive("beta")
    assert again.title == "beta", "an archived environment comes back under its own name"


def test_every_environment_is_made_with_its_kind_and_only_main_ones_are_listed_to_work_in():
    from features.agent_sessions.launch import prepared
    from engine import runtime
    from features.phone.places import shown
    from overview.summary import summarize
    from resources.types import EnvironmentKind
    features.load()
    record = fresh()
    envs = Environments(record, actor=SYSTEM)
    main = envs.create(record.env)
    prepared(record, "helper-ada", "Where helper Ada works", "helper:1", record.root.parent, EnvironmentKind.HELPER)
    prepared(record, "ticket-3", "Where ticket 3 runs", "ticket:3", record.root.parent, EnvironmentKind.TICKET)
    assert [row.kind for row in envs.rows.every()] == ["main", "helper", "ticket"], "each environment says what kind it is from the moment it is made"
    assert envs.create("helper-bo", owner="helper:2").kind == "helper", "a helper's environment made without a kind takes it from its owner, so it never shows as a main one"
    envs.delete(envs.rows.by_title("helper-bo").n, "made only to check its kind")
    assert "an environment is one of" in refused(lambda: envs.update(main.n, kind="")), "an environment can never be made untagged"
    assert "an environment is one of" in refused(lambda: envs.create("loose", kind="")), "nor made without a kind"
    runtime.set_env(record.root, record.env)
    summary = summarize(record.root)
    assert ([e["name"] for e in summary["environments"]], shown(record.root)) == ([record.env], (record.env,)), \
        "the viewer and the phone list only the environments a main agent works in"
    assert [e["owner"] for e in summary["helpers"]] == ["helper:1"], "a helper's environment is listed with the helpers"
    summary = summarize(record.root)
    assert ([e["owner"] for e in summary["tickets"]], [e["owner"] for e in summary["helpers"]]) == (["ticket:3"], ["helper:1"]), \
        "a ticket's environment is listed with the ticket agents, so the home screen shows its cell"
    from controllers.types import Todos
    from overview import summary as summing
    rebuilt = []
    original = summing.environment
    with pytest.MonkeyPatch.context() as patch:
        patch.setattr(summing, "environment", lambda found: rebuilt.append(found.env) or original(found))
        summing.PARTS.clear()
        summarize(record.root)
        first = len(rebuilt)
        summarize(record.root)
        assert len(rebuilt) == first, "an environment none of whose rows changed keeps its part of the summary, not rebuilt for every poll"
        Todos(record, actor=SYSTEM).create("something new")
        summarize(record.root)
    assert record.env in rebuilt[first:] and "ticket-3" not in rebuilt[first:], "and only the environment that changed is rebuilt"


def test_the_upgrade_tags_every_environment_from_its_owner_and_a_helpers_folder_named_one_as_a_helper():
    from controllers.base import Controller
    from features.helpers.controller import Helpers
    from migrations.m0068_environments_say_their_kind import run
    features.load()
    record = fresh()
    envs = Environments(record, actor=SYSTEM)
    Helpers(record, actor=SYSTEM).create("a job", name="Ada", provider="claude", model="sonnet", environment="helper-ada", checkout="/elsewhere/platform")
    for title, owner in (("t", ""), ("helper-ada", "helper:1"), ("role", "todo:4"), ("ticket-3", "ticket:3"), ("platform-2", ""), ("feature", "")):
        Controller.create(envs, title, owner=owner)
    run(record.root)
    assert {row.title: row.kind for row in envs.rows.every()} == {
        "t": "main", "helper-ada": "helper", "role": "subagent", "ticket-3": "ticket", "platform-2": "helper", "feature": "main"}, \
        "the owner says the kind, and an unowned environment named after a helper's checkout is that helper's"
    from migrations.m0010_project_folder import run as gathered
    old = record.root.parent / "older"
    for folder, text in ((old / "ticket", "first"), (old / "resources" / "ticket", "a copy")):
        folder.mkdir(parents=True)
        (folder / "1.md").write_text(text)
    assert gathered(old) == "project records moved into project/: ticket", "an upgrade moves project records from either old folder into project/"
    assert ((old / "project" / "ticket" / "1.md").read_text(), (old / "ticket").exists(), (old / "resources" / "ticket" / "1.md").exists()) == ("first", False, True), \
        "an emptied old folder goes, and a record already moved is never overwritten by an older copy"
    assert gathered(record.root.parent / "fresh-start") == "project records already in place", "a journal already laid out is left as it is"

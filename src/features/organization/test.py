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
    write(home / "roles" / "developer" / "role.toml", 'cardinality = "global"\n')
    with pytest.raises(Refused, match="cardinality is one of"):
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
    todos = Todos(record, actor=AGENT)
    delegate = lambda *args, **kwargs: COMMANDS["todo"]["delegate"](todos, *args, **kwargs)
    assert "needs acceptance" in refused(lambda: delegate("Build dark mode", "engineering", role="developer")), "a task must carry its role's inputs"
    first = delegate("Build dark mode", "engineering", role="developer", given="acceptance: the toggle persists")
    second = delegate("Build search", "engineering", role="developer", given="acceptance: results in 100ms")
    assert (first["waits"], second["waits"], "You are Developer in Engineering." in first["brief"], "with model sonnet" in first["brief"]) == (0, first["todo"], True, True), \
        "a role one of a kind per ticket takes its tasks one after another, and each comes with its lead's brief"
    reporter = Todos(record, actor=AGENT, agent="a1")
    assert "does not mention tests" in refused(lambda: reporter.report(first["todo"], "built it")), "a report must cover the role's outputs"
    assert reporter.report(first["todo"], "built it; tests pass").data["reported"]["how"] == "built it; tests pass"

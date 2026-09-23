import pytest

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

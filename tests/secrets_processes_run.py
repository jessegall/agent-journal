# Starts real programs, so it is not in the default run: python3 -m pytest -q tests/secrets_processes_run.py, before any commit that touches src/journal/features/secrets.
"""A secret given to a real program: the value on its input, in a variable and through a template, masked in what it prints, and the programs it is refused."""

from pathlib import Path

import pytest

from journal.app import App
from journal.config import Config
from journal.support.caller import Caller
from journal.support.actor import Actor
from journal.repositories.scope import Scope
from tests.main_journal import main_journal

AGENT = Caller.agent("main", "s1", "claude")


@pytest.fixture
def app(journal_root: Path):
    app = main_journal(Config(journal_root, port=0))
    app.runtime().start()
    with app.container.get(Scope).environment(1):
        yield app
    app.runtime().stop()


def test_secret_run_gives_a_value_to_an_allowed_program_and_masks_every_form_of_it(app, tmp_path, monkeypatch):
    from journal.models.secret import Secret
    from journal.models.secret_type import SecretType
    from journal.repositories.secrets import Secrets
    from journal.support.secret_values import SecretValues
    monkeypatch.setenv("AGENT_JOURNAL_SECRETS", str(tmp_path / "private"))
    import tempfile
    tools = Path(tempfile.mkdtemp(prefix="tools-"))
    assert not tools.resolve().is_relative_to(app.config.root.resolve()), "a program of the project's would be left off the search path"
    echoer = tools / "fakeapi"
    echoer.write_text("#!/bin/sh\nread given\necho \"got:$given\"\necho \"var:$FAKE_KEY\"\nprintf '%s' \"$given\" | base64\necho \"home:$HOME\"\n")
    echoer.chmod(0o755)
    monkeypatch.setenv("PATH", f"{tools}:/usr/bin:/bin")
    secrets = app.container.get(Secrets)
    secrets.save(Secret(title="Fake", secret_type=SecretType.API_KEY, fields=SecretType.API_KEY.first_fields("Fake"), programs=("fakeapi",)), Actor.user("u"))
    console = app.console()
    assert "no value for key here" in console.run(["secret", "run", "Fake", "--", "fakeapi"], AGENT).error
    app.container.get(SecretValues).put("FAKE_KEY", "s3cretvalue123")
    secrets.save(secrets.find(1).is_filled("key"), Actor.user("u"))
    completed = console.run(["secret", "run", "1", "--env", "--", "fakeapi"], AGENT)
    assert completed.code == 0 and "got:[secret FAKE_KEY]" in completed.text and "var:[secret FAKE_KEY]" in completed.text, completed.text
    assert "s3cretvalue123" not in completed.text and "czNjcmV0dmFsdWUxMjM" not in completed.text, "the value is masked as it is and in base64"
    assert "/runs/run-" in completed.text, "the program's home is a throwaway one inside the secrets folder"
    templated = console.run(["secret", "run", "Fake", "--stdin", "Bearer {key}", "--", "fakeapi"], AGENT)
    assert "got:Bearer [secret FAKE_KEY]" in templated.text
    assert "name the program bare" in console.run(["secret", "run", "Fake", "--", str(echoer)], AGENT).error
    assert "never passed to bash" in console.run(["secret", "run", "Fake", "--", "bash", "-c", "echo"], AGENT).error
    assert "`journal secret propose 1 ls`" in console.run(["secret", "run", "Fake", "--", "ls"], AGENT).error
    assert "proposed for secret 1" in console.run(["secret", "propose", "1", "ls"], AGENT).text and secrets.find(1).proposed == ("ls",)
    assert "never passed to python3" in console.run(["secret", "propose", "1", "python3"], AGENT).error
    assert "already" in console.run(["secret", "propose", "1", "fakeapi"], AGENT).text
    assert secrets.find(1).used_at is not None


def test_secret_run_gives_gh_the_project_token_in_its_environment_and_masks_it(app, tmp_path, monkeypatch):
    from journal.models.secret import Secret
    from journal.models.secret_type import SecretType
    from journal.repositories.secrets import Secrets
    from journal.support.secret_values import SecretValues
    import tempfile
    monkeypatch.setenv("AGENT_JOURNAL_SECRETS", str(tmp_path / "private"))
    monkeypatch.setenv("GITHUB_TOKEN", "process-token-456")
    monkeypatch.setenv("GH_TOKEN", "never-given-789")
    tools = Path(tempfile.mkdtemp(prefix="tools-"))
    fake_gh = tools / "gh"
    fake_gh.write_text("#!/bin/sh\necho \"token:$GITHUB_TOKEN\"\necho \"gh-token:$GH_TOKEN\"\necho \"args:$*\"\n")
    fake_gh.chmod(0o755)
    monkeypatch.setenv("PATH", f"{tools}:/usr/bin:/bin")
    secrets = app.container.get(Secrets)
    secrets.save(Secret(title="Signing", secret_type=SecretType.API_KEY, fields=SecretType.API_KEY.first_fields("Signing"), programs=("gh",)), Actor.user("u"))
    app.container.get(SecretValues).put("SIGNING_KEY", "signingvalue123")
    secrets.save(secrets.find(1).is_filled("key"), Actor.user("u"))
    console = app.console()
    command = ["secret", "run", "1", "--", "gh", "secret", "set", "SIGNING", "--env", "tcc-staging"]
    from_environment = console.run(command, AGENT)
    assert "token:[secret GITHUB_TOKEN]" in from_environment.text and "process-token-456" not in from_environment.text, from_environment.text
    assert "gh-token:\n" in from_environment.text and "never-given-789" not in from_environment.text, "GH_TOKEN never reaches gh"
    (app.config.root / ".env").write_text("GITHUB_TOKEN=dotenv-token-321\n")
    from_dotenv = console.run(command, AGENT)
    assert "token:[secret GITHUB_TOKEN]" in from_dotenv.text and "dotenv-token-321" not in from_dotenv.text and "args:secret set SIGNING --env tcc-staging" in from_dotenv.text, from_dotenv.text
    (app.config.root / ".env").unlink()
    monkeypatch.delenv("GITHUB_TOKEN")
    assert "gh needs GITHUB_TOKEN" in console.run(command, AGENT).error


def test_secret_run_gives_a_database_client_the_login_plain_values_with_its_fields(app, tmp_path, monkeypatch):
    from journal.models.secret import Secret
    from journal.models.secret_type import SecretType
    from journal.repositories.secrets import Secrets
    from journal.support.secret_values import SecretValues
    import tempfile
    monkeypatch.setenv("AGENT_JOURNAL_SECRETS", str(tmp_path / "private"))
    tools = Path(tempfile.mkdtemp(prefix="tools-"))
    fake = tools / "psql"
    fake.write_text("#!/bin/sh\necho \"host:$PGHOST port:$PGPORT db:$PGDATABASE user:$PGUSER pw:$PGPASSWORD\"\n")
    fake.chmod(0o755)
    monkeypatch.setenv("PATH", f"{tools}:/usr/bin:/bin")
    secrets = app.container.get(Secrets)
    secrets.save(Secret(title="Pg", secret_type=SecretType.LOGIN, fields=SecretType.LOGIN.first_fields("Pg"), programs=("psql",)), Actor.user("u"))
    stored = app.container.get(SecretValues)
    stored.put_shown("PG_USERNAME", "reader")
    stored.put("PG_PASSWORD", "pgsecret987")
    for name, value in (("PG_HOST", "db.example"), ("PG_PORT", "5432"), ("PG_DATABASE", "app")):
        stored.put_shown(name, value)
    secrets.save(secrets.find(1).is_filled("username").is_filled("password"), Actor.user("u"))
    completed = app.console().run(["secret", "run", "1", "--", "psql"], AGENT)
    assert "host:db.example port:5432 db:app user:reader pw:[secret PG_PASSWORD]" in completed.text, completed.text
    assert "pgsecret987" not in completed.text

# Starts real programs, so it is not in the default run: python3 -m pytest -q tests/secrets_processes_run.py, before any commit that touches src/journal/features/secrets.
"""A secret given to a real program: the value on its input, in a variable and through a template, masked in what it prints, and the programs it is refused."""

from pathlib import Path

import pytest

from journal.app import App
from journal.config import Config
from journal.console.where import Where
from journal.support.actor import Actor
from journal.repositories.scope import Scope

AGENT = Where("main", "s1")


@pytest.fixture
def app(journal_root: Path):
    app = App(Config(journal_root, port=0))
    app.runtime().start()
    with app.container.get(Scope).of(1):
        yield app
    app.runtime().stop()


def test_secret_run_gives_a_value_to_an_allowed_program_and_masks_every_form_of_it(app, tmp_path, monkeypatch):
    from journal.models.secret import Secret
    from journal.models.secret_kind import SecretKind
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
    secrets.save(Secret(title="Fake", kind=SecretKind.API_KEY, fields=SecretKind.API_KEY.first_fields("Fake"), programs=("fakeapi",)), Actor.user("u"))
    console = app.console()
    assert "no value for key on this machine" in console.run(["secret", "run", "Fake", "--", "fakeapi"], AGENT).err
    app.container.get(SecretValues).put("FAKE_KEY", "s3cretvalue123")
    secrets.save(secrets.find(1).filled_in("key"), Actor.user("u"))
    ran = console.run(["secret", "run", "1", "--env", "--", "fakeapi"], AGENT)
    assert ran.code == 0 and "got:[secret FAKE_KEY]" in ran.out and "var:[secret FAKE_KEY]" in ran.out, ran.out
    assert "s3cretvalue123" not in ran.out and "czNjcmV0dmFsdWUxMjM" not in ran.out, "the value is masked as it is and in base64"
    assert "/runs/run-" in ran.out, "the program's home is a throwaway one inside the secrets folder"
    templated = console.run(["secret", "run", "Fake", "--stdin", "Bearer {key}", "--", "fakeapi"], AGENT)
    assert "got:Bearer [secret FAKE_KEY]" in templated.out
    assert "name the program bare" in console.run(["secret", "run", "Fake", "--", str(echoer)], AGENT).err
    assert "never given to bash" in console.run(["secret", "run", "Fake", "--", "bash", "-c", "echo"], AGENT).err
    assert "`journal secret propose 1 ls`" in console.run(["secret", "run", "Fake", "--", "ls"], AGENT).err
    assert "proposed for secret 1" in console.run(["secret", "propose", "1", "ls"], AGENT).out and secrets.find(1).proposed == ("ls",)
    assert "never given to python3" in console.run(["secret", "propose", "1", "python3"], AGENT).err
    assert "already" in console.run(["secret", "propose", "1", "fakeapi"], AGENT).out
    assert secrets.find(1).used_at is not None

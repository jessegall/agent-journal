import stat
import time

import features
from controllers.types import Messages
from features.secrets.controller import Secrets
from features.secrets.values import ValuesFile
from resources.base import AGENT, SYSTEM, USER
from tests.conftest import fresh, refused

VALUE = "sk-test-4f9a1c7e2b"


def test_a_secret_keeps_its_value_in_a_file_of_its_own_and_nowhere_in_the_journal(tmp_path, monkeypatch):
    monkeypatch.setenv("XDG_CONFIG_HOME", str(tmp_path / "config"))
    features.load()
    record = fresh()
    asked = Secrets(record, actor=AGENT).request("Stripe test", "to run the payment tests")
    assert [raw["variable"] for raw in asked.secret_fields] == ["STRIPE_TEST_KEY"] and asked.is_waiting(), "an asked-for key waits with one hidden field"
    assert f"secret {asked.n}" in Messages(record, actor=SYSTEM).rows.every()[-1].brief, \
        "the request reaches the chat as a card that opens the secret"
    assert "only you fill in" in refused(lambda: Secrets(record, actor=AGENT).fill(asked.n, "key", VALUE)), "the agent never fills in a value"
    filled = Secrets(record, actor=USER).fill(asked.n, "key", VALUE)
    values = ValuesFile(record.root)
    assert (values.values(), filled.is_waiting(), filled.asked) == ({"STRIPE_TEST_KEY": VALUE}, False, ""), "the value is in the file and the secret no longer waits"
    assert (stat.S_IMODE(values.path.stat().st_mode), stat.S_IMODE(values.path.parent.stat().st_mode)) == (0o600, 0o700), "only the owner reads the file"
    assert not values.path.is_relative_to(record.root.parent), "the file lives outside the project, so no worktree, backup or copy carries it"
    leaked = [path for path in record.root.rglob("*") if path.is_file() and VALUE.encode() in path.read_bytes()]
    assert leaked == [], f"the value is nowhere in the journal: {leaked}"
    login = Secrets(record, actor=USER).create("Staging", kind="login")
    made = tmp_path / "password.txt"
    made.write_text("generated-pass-9x\n")
    Secrets(record, actor=AGENT).store(login.n, "password", str(made))
    assert (values.values()["STAGING_PASSWORD"], made.exists()) == ("generated-pass-9x", False), "a value the agent made is moved in, and its file removed"
    assert "is one of api key, login, custom" in refused(lambda: Secrets(record, actor=USER).create("X", kind="token")), "the kinds are named"
    assert "has no field 'pin'" in refused(lambda: Secrets(record, actor=USER).fill(login.n, "pin", "1")), "a field the secret lacks is named"


def test_a_deleted_secret_keeps_its_values_for_30_days(tmp_path, monkeypatch):
    monkeypatch.setenv("XDG_CONFIG_HOME", str(tmp_path / "config"))
    features.load()
    record = fresh()
    secrets = Secrets(record, actor=USER)
    row = secrets.create("GitHub", kind="api key")
    secrets.fill(row.n, "key", VALUE)
    secrets.delete(row.n, "no longer needed")
    assert (secrets._purge(), ValuesFile(record.root).values()) == ([], {"GITHUB_KEY": VALUE}), "a secret deleted today keeps its value"
    later = time.time() + 31 * 86400
    monkeypatch.setattr(time, "time", lambda: later)
    assert (secrets._purge(), ValuesFile(record.root).values()) == (["GITHUB_KEY"], {}), "after 30 days its values leave the file"


def test_a_command_gets_the_value_and_prints_only_its_mask(tmp_path, monkeypatch, capsys):
    from features.secrets.running import Masker
    from providers.command_effects import effects
    monkeypatch.setenv("XDG_CONFIG_HOME", str(tmp_path / "config"))
    features.load()
    record = fresh()
    row = Secrets(record, actor=USER).create("GitHub", kind="api key")
    assert "has no value yet" in refused(lambda: Secrets(record, actor=AGENT).run("GitHub", "cat")), "a secret without its value is never run"
    Secrets(record, actor=USER).fill(row.n, "key", VALUE)
    agent = Secrets(record, actor=AGENT)
    capsys.readouterr()
    agent.run("github", "cat")
    agent.run("GitHub", "base64")
    agent.run("GitHub", "printenv", "GITHUB_KEY", env=True)
    agent.run("GitHub", "cat", stdin='{"Authorization": "Bearer {key}"}')
    printed = capsys.readouterr().out
    assert VALUE not in printed and printed.count("[secret GitHub]") == 4 and '{"Authorization": "Bearer [secret GitHub]"}' in printed, \
        f"the value reaches the command on stdin or in its environment, and every form of it is masked: {printed}"
    agent.run("GitHub", "printenv", "HOME")
    assert str(record.root.parent) not in capsys.readouterr().out, "the command gets a home of its own, so it keeps no login where the agent can read it"
    masker = Masker({VALUE: "GitHub"})
    assert masker.feed(VALUE[:6].encode()) + masker.feed(VALUE[6:].encode() + b" done") + masker.flush() == b"[secret GitHub] done", \
        "a value split across two reads is still masked"
    assert "never given to bash" in refused(lambda: agent.run("GitHub", "bash", "-c", "cat")), "a shell or an interpreter never gets a secret"
    Secrets(record, actor=SYSTEM).update(row.n, programs=["gh"])
    assert "only to gh" in refused(lambda: agent.run("GitHub", "cat")), "a secret goes only to the programs it lists"
    assert "main agent only" in refused(lambda: Secrets(record, actor=AGENT, agent="sub-1").run("GitHub", "gh")), "a subagent uses a secret only when it is shared"
    assert effects("journal secret run github -- git push origin main") == ["writes"], "the work gate sees what the wrapped command does"
    assert Secrets(record, actor=SYSTEM).load(row.n).used, "the secret records when it was last used"
    from providers import PROVIDERS
    from runner.hooks import handle
    hook = lambda tool, given: handle(PROVIDERS["claude"](), record.root, record.env, {"hook_event_name": "PreToolUse", "session_id": "claude-1", "cwd": str(record.root.parent),
                                                                                        "tool_name": tool, "tool_input": given}).get("reason", "")
    path = ValuesFile(record.root).path
    assert ("never read by an agent" in hook("Read", {"file_path": str(path)}), "never read by an agent" in hook("Bash", {"command": f"cat {path}"}),
            "never read by an agent" in hook("Bash", {"command": "grep -r KEY ~/.config/agent-journal/secrets"}), hook("Bash", {"command": "ls"})) == (True, True, True, ""), \
        "the secrets file is refused to every tool that names it, and nothing else is"
    from controllers.types import Notifications, Todos
    leaked = Todos(record, actor=AGENT).create(f"try the key {VALUE} again", brief=f"curl -H 'Authorization: Bearer {VALUE}'")
    assert (leaked.title, VALUE in leaked.brief) == ("try the key [secret GitHub] again", False), "a value written into any row is replaced before it is saved"
    assert any("GitHub was written into the journal" in note.title for note in Notifications(record, actor=SYSTEM).rows.every()), "and you are told to rotate it"

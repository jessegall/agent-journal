import features
from controllers.types import Agents, Environments, Messages
from resources.base import AGENT, SYSTEM, USER
from tests.conftest import fresh


def test_a_message_wakes_the_environments_last_conversation_when_no_agent_runs(monkeypatch):
    features.load()
    started = []
    monkeypatch.setattr("features.starting_agents.handlers.detached",
                        lambda root, cwd, env, agent, args, conversation="": started.append((env, agent, conversation)) or 1)
    record = fresh()
    Environments(record, actor=SYSTEM).create(record.env)
    Agents(record, actor=SYSTEM).create("4d863ccb-old", event="SessionEnd", provider="claude", at=100.0)
    Agents(record, actor=SYSTEM).create("bea86f27-last", event="SessionEnd", provider="codex", at=200.0)
    Agents(record, actor=SYSTEM).create("claude-20640", provider="claude", at=300.0)
    Messages(record, actor=USER).create("are you there?")
    assert started == [], "with the setting off, a message starts nothing"
    record.set_setting("starting_agents", {"wake_on_message": True})
    Messages(record, actor=AGENT).create("I am writing to myself")
    assert started == [], "the agent's own message wakes nothing"
    Messages(record, actor=USER).create("are you there now?")
    assert started == [(record.env, "codex", "bea86f27-last")], "the user's message resumes the environment's last conversation on its provider"
    Messages(record, actor=USER).create("hello again")
    assert len(started) == 1, "a second message while that start is under way starts nothing more"

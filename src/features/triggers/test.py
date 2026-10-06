import features
from controllers.types import Agents, Messages
from features.triggers.controller import Triggers
from providers.payload import BashCall
from tests.conftest import fresh
from tests.kit import nudges, report


def call(command: str) -> BashCall:
    return BashCall("Bash", {"command": command}, {}, command=command)


def fired(record, command: str) -> str:
    from features import FEATURES
    from features.parts import AgentContext
    from features.triggers.handlers import WatchWhatTheAgentDoes
    feature = FEATURES["triggers"]
    agent = Agents(record, actor="system").by_session("claude-1")
    return WatchWhatTheAgentDoes().intercept(AgentContext.of(feature, record, agent), call(command))


def test_a_trigger_denies_a_command_and_nudges_on_a_word():
    features.load()
    record = fresh()
    report(record, "working", "PreToolUse")
    Triggers(record, actor="user").create("no force pushes", text="force pushing rewrites the shared history",
                                          **{"words": ["--force"], "does": "deny", "words_in": "commands"})
    Triggers(record, actor="user").create("mind the migrations", text="run the migration test after touching them",
                                          **{"words": ["migration"], "does": "nudge"})
    assert "no force pushes" in fired(record, "git push --force origin main"), "a deny refuses the call with its reason"
    assert fired(record, "grep migration engine") == "", "a nudge lets the call through"
    assert [n for n in nudges(record) if "mind the migrations" in n], "and says its line to the agent"
    cards = [(card["label"], card["tone"]) for card in Agents(record, actor="system").by_session("claude-1").data["cards"]]
    assert cards == [("Trigger no force pushes denied the call", "danger"), ("Trigger mind the migrations nudged the agent", "note")], \
        "each firing is marked in the chat with what it did, a deny in the danger tone"
    Triggers(record, actor="user").create("bump the version", text="update VERSION and the changelog before tagging",
                                          **{"words": ["tag"], "does": "instruct", "words_in": "commands"})
    assert fired(record, "git tag v2.252.0") == "", "an instruction lets the call through"
    assert [n for n in nudges(record) if "bump the version" in n], "and puts its instruction in front of the agent"
    assert Agents(record, actor="system").by_session("claude-1").data["cards"][-1]["label"] == "Trigger bump the version instructed the agent", \
        "its mark says it instructed the agent"


def test_a_trigger_fires_on_what_the_user_writes():
    features.load()
    record = fresh()
    report(record, "working", "PreToolUse")
    Triggers(record, actor="user").create("ship it", text="run the suite before the release", **{"words": ["release"]})
    Messages(record, actor="user").create("time for a release")
    assert [n for n in nudges(record) if "ship it" in n], "the user's own words fire it too"


def test_a_trigger_message_does_not_fire_the_trigger_again():
    features.load()
    record = fresh()
    report(record, "working", "PreToolUse")
    Triggers(record, actor="user").create("release reminder", brief="release checklist", **{"words": ["release"], "does": "message"})
    Messages(record, actor="user").create("release time")
    messages = Messages(record, actor="system").rows.every()
    assert len(messages) == 2
    assert messages[-1].data["trigger"] == 1


def test_a_trigger_fires_on_what_the_agent_says_in_the_chat():
    from providers.payload import Chunk
    from runner.chat_mirror import displayed
    from engine.sessions import Sessions
    features.load()
    record = fresh()
    report(record, "working", "PreToolUse", provider="claude")
    Sessions(record.root).bind("claude-1", record.env, provider="claude")
    Triggers(record, actor="user").create("no greeting", text="the test word is denied", **{"words": ["hello"], "does": "deny", "words_in": "text"})
    displayed(record.root, Chunk.from_json({"session_id": "claude-1", "hook_event_name": "MessageDisplay", "message_id": "a", "index": 0, "final": True, "delta": "Hello! Ready."}))
    cards = [(card["label"], card["tone"]) for card in Agents(record, actor="system").by_session("claude-1").data["cards"]]
    assert (cards, [n for n in nudges(record) if "no greeting" in n] != []) == ([("Trigger no greeting caught a denied word in the agent's message", "danger")], True), \
        "a denied word in the agent's own chat is marked and the agent is told"


def test_deleting_a_trigger_sets_the_sequences_it_starts_back_to_by_hand():
    from features.sequences.controller import Sequences
    record = fresh()
    triggers = Triggers(record, actor="system")
    sequences = Sequences(record, actor="system")
    trigger = triggers.create("release", **{"words": ["release"], "does": "start"})
    made = sequences.create("Release checklist", starts_on=f"trigger:{trigger.n}")
    triggers.delete(trigger.n)
    assert sequences.load(made.n).data["starts_on"] == "", "a sequence never points at a trigger that is gone"

import time

from controllers.types import Environments
from engine.sessions import Sessions
from resources.base import AGENT
from tests.conftest import fresh, refused


def test_environments_are_prepared_bound_claimed_left_and_granted_to_subagents():
    record = fresh()
    sessions = Sessions(record.root)
    one = Environments(record, actor=AGENT, session="claude-1")
    two = Environments(record, actor=AGENT, session="claude-2")

    env = one.method("prepare")("repentance")
    assert (env.title, env.scope, (record.root / "environments" / "repentance").is_dir()) == ("repentance", "project", True), \
        "prepared: a project resource, with its folder"
    assert refused(lambda: one.create("repentance")) == "environment 'repentance' exists: switch to it", "the same name again is refused"

    assert refused(lambda: Environments(record).switch(env.n)) == "no session to bind: say which with --session", \
        "a controller with no session cannot bind"
    one.switch(env.n)
    assert (sessions.environment("claude-1"), one.load(env.n).data["holder"]) == ("repentance", "claude-1"), \
        "bound: the session's file says where, and the environment says who"
    assert refused(lambda: two.switch(env.n)) == "environment 'repentance' is taken by session claude-1: claim it with a reason, or work another", \
        "held by a live session: another is refused"
    two.claim(env.n, "the terminal was closed")
    assert (sessions.environment("claude-2"), sessions.environment("claude-1"), sessions.read("claude-1")["evicted"]["why"], two.load(env.n).data["claimed"]) == \
        ("repentance", "", "the terminal was closed", {"from": "claude-1", "why": "the terminal was closed"}), \
        "claimed: the new holder, the evicted one told why"
    assert refused(lambda: two.switch(env.n)) == "", "the same session may switch again"
    two.leave(env.n)
    assert (sessions.environment("claude-2"), sessions.holder("repentance")) == ("", ""), "left: free"
    sessions.write("gone-9", environment="repentance", pid=999999, since=1.0)
    assert sessions.holder("repentance") == "", "a dead holder holds nothing"
    sessions.write("fresh-9", environment="repentance", pid=0, seen=time.time())
    assert sessions.holder("repentance") == "fresh-9", "a session that reported a moment ago holds it, pid or not"

    one.grant(env.n)
    assert (sessions.granted("claude-1", "repentance"), sessions.read("claude-1")["grants"]) == (True, ["repentance"]), "granted"
    one.grant(env.n, off=True)
    assert sessions.granted("claude-1", "repentance") is False, "taken back"
    assert (one.named("create"), one.named("complete")) == ("prepare", "remove"), "the environment's words"

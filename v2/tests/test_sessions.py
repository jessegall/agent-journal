import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from v2.controllers.types import CONTROLLERS  # noqa: E402
from v2.engine.sessions import Sessions  # noqa: E402
from v2.resources.base import AGENT  # noqa: E402
from v2.tests.kit import check, done, fresh  # noqa: E402


def refused(fn):
    try:
        fn()
        return ""
    except Exception as e:
        return str(e)


record = fresh()
sessions = Sessions(record.root)
one = CONTROLLERS["environment"](record, actor=AGENT, session="claude-1")
two = CONTROLLERS["environment"](record, actor=AGENT, session="claude-2")

# PREPARE makes the folder; a name is one word; twice is refused
env = one.method("prepare")("repentance")
check("prepared: a project resource, with its folder", (env.title, env.scope, (record.root / "environments" / "repentance").is_dir()), ("repentance", "project", True))
check("the same name again is refused", refused(lambda: one.create("repentance")), "environment 'repentance' exists: switch to it")

# SWITCH binds the session; a held environment refuses another session; CLAIM takes it with a reason and evicts
check("a controller with no session cannot bind", refused(lambda: CONTROLLERS["environment"](record).switch(env.n)), "no session to bind: say which with --session")
one.switch(env.n)
check("bound: the session's file says where, and the environment says who", (sessions.environment("claude-1"), one.load(env.n).data["holder"]), ("repentance", "claude-1"))
check("held by a live session: another is refused", refused(lambda: two.switch(env.n)), "environment 'repentance' is taken by session claude-1: claim it with a reason, or work another")
two.claim(env.n, "the terminal was closed")
check("claimed: the new holder, the evicted one told why", (sessions.environment("claude-2"), sessions.environment("claude-1"), sessions.read("claude-1")["evicted"]["why"], two.load(env.n).data["claimed"]), ("repentance", "", "the terminal was closed", {"from": "claude-1", "why": "the terminal was closed"}))
check("the same session may switch again", refused(lambda: two.switch(env.n)), "")
two.leave(env.n)
check("left: free", (sessions.environment("claude-2"), sessions.holder("repentance")), ("", ""))
sessions.bind("gone-9", "repentance", pid=999999)
check("a dead holder holds nothing", sessions.holder("repentance"), "")

# GRANTS lend an environment to a session's subagents
one.grant(env.n)
check("granted", (sessions.granted("claude-1", "repentance"), sessions.read("claude-1")["grants"]), (True, ["repentance"]))
one.grant(env.n, off=True)
check("taken back", sessions.granted("claude-1", "repentance"), False)
check("the environment's words", (one.named("create"), one.named("complete")), ("prepare", "remove"))

done()

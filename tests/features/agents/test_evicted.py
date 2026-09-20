import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from controllers.types import Environments, Works  # noqa: E402
from engine.sessions import Sessions, allowed  # noqa: E402
from features.base import held  # noqa: E402
from resources.base import AGENT  # noqa: E402
from tests.features.kit import report  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

features.unload()
features.load()

record = fresh()
sessions = Sessions(record.root)
gate = lambda s: held(record, s)
Works(record, actor=AGENT).create("open, so the work gate is quiet")
one = Environments(record, actor=AGENT, session="claude-1")
env = one.create("t")
one.switch(env.n)
report(record, "working", "PostToolUse", session="claude-1")
check("bound and working: no hold", gate("claude-1"), "")
Environments(record, actor=AGENT, session="claude-2").claim(env.n, "the terminal was closed")
report(record, "working", "PostToolUse", session="claude-1")
check("evicted: held, naming who, why and what to do", gate("claude-1"), "environment 't' was claimed by session claude-2 (the terminal was closed): switch to another, or claim it back")
one.claim(env.n, "it was mine")
report(record, "working", "PostToolUse", session="claude-1")
check("claimed back: released", gate("claude-1"), "")

# SUBAGENTS: a grant and the refused set
check("no grant: refused, saying how to lend", allowed(sessions, "claude-1", "t", "agent-7", "todo"), "environment 't' is not lent to this session's subagents: journal environment <n> grant first")
one.grant(env.n)
check("granted: a to-do is allowed", allowed(sessions, "claude-1", "t", "agent-7", "todo"), "")
check("granted: a pin is still refused", allowed(sessions, "claude-1", "t", "agent-7", "pin"), "a subagent never writes a pin: report it, and the main conversation files it")
check("no subagent named: nothing to check", allowed(sessions, "claude-1", "t", "", "pin"), "")

done()

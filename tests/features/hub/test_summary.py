import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from commands.http import dispatch  # noqa: E402
from controllers.types import Agents, Messages, Plans, Questions, Todos, Works  # noqa: E402
from engine.record import Record  # noqa: E402
from features.hub.summary import environment, summarize  # noqa: E402
from resources.base import AGENT, SYSTEM, USER  # noqa: E402
from tests.features.kit import idle, report  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

features.unload()
features.load()

record = fresh("main")
hub = features.FEATURES["hub"]
check("the hub is fixed on", (hub.enabled(record), hub.describe()["fixed"]), (True, True))

empty = environment(record)
check("an environment nobody has visited has no agent, no work and nothing counted",
      (empty["name"], empty["agent"], empty["work"], empty["last"], empty["plans"], empty["counts"]),
      ("main", None, None, None, [], {"messages": 0, "questions": 0, "todos": 0, "suggestions": 0}))

Agents(record, actor=AGENT).by_session("claude-1")
idle(record, provider="claude", model="m", context=41.5)
check("an idle agent is reported with its provider, model and context", {k: environment(record)["agent"][k] for k in ("status", "provider", "model", "context")},
      {"status": "idle", "provider": "claude", "model": "m", "context": 41.5})

Todos(record, actor=AGENT).create(title="a row", brief="why")
work = Works(record, actor=AGENT).create(title="on the row", todo=1)
report(record, "working", "PreToolUse")
got = environment(record)
check("declared work is the current work, with its to-do", (got["agent"]["status"], got["work"]), ("working", {"n": 1, "title": "on the row", "todo": 1}))
Works(record, actor=AGENT).complete(1, how="over")
got = environment(record)
check("ended work is only the last work", (got["work"], got["last"]["n"]), (None, 1))

Messages(record, actor=AGENT).create(title="for you")
Messages(record, actor=USER).create(title="for the agent")
Questions(record, actor=AGENT).create(title="which?")
check("counts are what the user waits on: messages unread by them, open questions and to-dos",
      environment(record)["counts"], {"messages": 1, "questions": 1, "todos": 1, "suggestions": 0})

plans = Plans(record, actor=AGENT)
plans.create(title="the plan", goal="all")
plans.phase(1, "First")
plans.phase(1, "Second", checkpoint=True)
Todos(record, actor=AGENT).create(title="a second row", brief="why")
plans.place(1, 1, [1])
plans.place(1, 2, [2])
plans.ready(1)
Plans(record, actor=USER).activate(1)
got = environment(record)["plans"]
check("an active plan says its phase and how many phases are done", got, [{"n": 1, "title": "the plan", "status": "active", "current": 1, "phase": "First", "phases": 2, "done": 0}])
Todos(record, actor=AGENT).complete(1, how="shipped")
check("a phase is done when its rows are", environment(record)["plans"][0]["done"], 1)
check("a draft plan is not shown", len([plans.create(title="draft", goal="g")]) and len(environment(record)["plans"]), 1)

whole = summarize(record.root)
check("the summary names the project, its root, version, start environment and every environment",
      (whole["project"], whole["root"], bool(whole["version"]), whole["start"], [e["name"] for e in whole["environments"]]),
      (record.root.parent.name, str(record.root), True, "main", ["main"]))
reply = dispatch("GET", "/api/summary", record.root, {}, {})
check("every viewer answers /api/summary", (reply.code, reply.body["environments"][0]["counts"]["questions"]), (200, 1))

done()

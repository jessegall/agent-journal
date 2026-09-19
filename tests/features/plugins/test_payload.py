import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from controllers.types import Agents, Todos  # noqa: E402
from features.plugins.payload import of, refusal  # noqa: E402
from providers.payload import Hook  # noqa: E402
from resources.base import AGENT, SYSTEM  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

features.unload()
features.load()

record = fresh()
where = Path("/p/.journal/plugins/works")
todos = Todos(record, actor=AGENT)
made = todos.create("fix the header", brief="it wraps on mobile")
agents = Agents(record, actor=SYSTEM)
agents.update(agents.by_session("claude-3").n, status="working", model="claude-opus-5", cwd="/p")

# A RECORD EVENT carries the row it is about, the environment and the agent
event = [e for e in record.events() if e.type == "todo"][-1]
said = of(record, event, "works", where)
check("the event is named type.action and keeps its number and actor", (said["v"], said["event"], said["n"], said["actor"]), (1, "todo.created", made.n, AGENT))
check("the row it is about rides along, with its ref", (said["resource"]["title"], said["resource"]["ref"], said["resource"]["brief"]), ("fix the header", made.ref, "it wraps on mobile"))
check("the environment, the project and the plugin's own folder are named", (said["env"], said["project"], said["plugin"]), (record.env, str(record.root.parent), {"name": "works", "dir": str(where)}))
check("with no session on the event, the environment's own agent is named", said["agent"]["session"], "claude-3")

# A DELETED ROW leaves the event without a resource, never without an answer
todos.delete(made.n, "not needed")
gone = of(record, [e for e in record.events() if e.type == "todo"][-1], "works", where)
check("a row that is gone still gives an event, with no resource", (gone["event"], gone["resource"]["deleted"] > 0), ("todo.deleted", True))

# A HOOK EVENT is named for the hook, and says which tool it saw
agents.saw(agents.by_session("claude-3").n, {"hook": "PostToolUse", "tool": "Edit", "file": "/p/a.py", "session": "claude-3"}, status="working")
hooked = of(record, [e for e in record.events() if e.type == "agent"][-1], "works", where)
check("a hook rides as hook.<event> with what it saw", (hooked["event"], hooked["data"]["tool"], hooked["data"]["file"], hooked["agent"]["session"]),
      ("hook.PostToolUse", "Edit", "/p/a.py", "claude-3"))

# THE REFUSAL CALL says what the agent is about to do
hook = Hook.read({"hook_event_name": "PreToolUse", "session_id": "claude-3", "tool_name": "Edit", "cwd": "/p", "tool_input": {"file_path": "/p/a.py"}})
asked = refusal(record, hook, "works", where, True)
check("the tool, the file and whether it writes are named", (asked["event"], asked["tool"], asked["agent"]["session"]),
      ("hook.PreToolUse", {"name": "Edit", "file": "/p/a.py", "command": "", "writes": True}, "claude-3"))

done()

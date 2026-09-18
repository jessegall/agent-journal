import json
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from controllers.types import Agents  # noqa: E402
from engine.actors import Agent, IDLE, STOPPED, WORKING  # noqa: E402
from engine.drivers import DRIVERS  # noqa: E402
from engine.record import Record  # noqa: E402
from providers import PROVIDERS  # noqa: E402
from providers.base import EVENTS, STATUS  # noqa: E402
from resources.base import SYSTEM  # noqa: E402
from tests.kit import check, done  # noqa: E402



for name, cls in PROVIDERS.items():                       # every provider, the same drill
    provider = cls()
    project = Path(tempfile.mkdtemp())
    root = project / ".journal"
    f = provider.wire(project, "/x/hook.py")
    got = json.loads(f.read_text())
    check(f"{name}: wires every hook event into its own config file", (f.is_relative_to(project), sorted(got["hooks"])), (True, sorted(EVENTS)))
    check(f"{name}: each hook runs the one command", all("/x/hook.py" in json.dumps(v) for v in got["hooks"].values()), True)
    record = Record(root, "main")
    agents = Agents(record, actor=SYSTEM)
    payload = {"session_id": "abc-1", "transcript_path": f"/tmp/{name}/abc-1.jsonl", "cwd": str(project)}
    for event in EVENTS:
        provider.handle(root, "main", {**payload, "hook_event_name": event, "tool_name": "Bash" if "Tool" in event else ""})
        row = agents.by_session("abc-1")
        check(f"{name}: {event} writes the agent's status {STATUS[event]}", (row.data["status"], row.data["event"], row.data["provider"]), (STATUS[event], event, name))
    check(f"{name}: one agent row per session, not one per hook", len(agents.all()), 1)
    check(f"{name}: an unknown hook writes nothing", (provider.handle(root, "main", {**payload, "hook_event_name": "Whatever"}), len(record.events())),
          ({}, 1 + len(EVENTS)))
    driver = DRIVERS[name](record, "abc-1", fd=1)
    agent = Agent(record, driver)
    check(f"{name}: the engine's agent reads the status the hook wrote", agent.state(), STOPPED)
    provider.handle(root, "main", {**payload, "hook_event_name": "Stop"})
    driver.quiet_for = lambda: 2.0
    check(f"{name}: after a Stop the agent is idle", agent.state(), IDLE)
    provider.handle(root, "main", {**payload, "hook_event_name": "PreToolUse", "tool_name": "Bash"})
    driver.quiet_for = lambda: 0.2
    check(f"{name}: after a tool call starts it is working", agent.state(), WORKING)
    provider.handle(root, "main", {**payload, "hook_event_name": "PreToolUse", "tool_name": "Bash", "tool_input": {"command": "npm run build"}})
    row = agents.by_session("abc-1").data
    check(f"{name}: a shell command is reported as running and joins the ring", (row["running"]["what"], "done" in row["running"], [c["what"] for c in row["commands"]]), ("npm run build", False, ["npm run build"]))
    provider.handle(root, "main", {**payload, "hook_event_name": "PostToolUse", "tool_name": "Bash", "tool_input": {"command": "npm run build"}})
    row = agents.by_session("abc-1").data
    check(f"{name}: its end stamps the running command done; a read reports no command", (row["running"]["done"] >= row["running"]["at"], len(row["commands"])), (True, 1))
    provider.handle(root, "main", {**payload, "hook_event_name": "PreToolUse", "tool_name": "Read", "tool_input": {"file_path": "/x"}})
    check(f"{name}: another tool leaves the ring and the last command as they were", [c["what"] for c in agents.by_session("abc-1").data["commands"]], ["npm run build"])
    agents.set(agents.by_session("abc-1").n, "status", IDLE)
    check(f"{name}: journal agent set status idle is the same funnel", agents.by_session("abc-1").data["status"], IDLE)

done()

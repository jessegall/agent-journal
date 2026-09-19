import json
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import features  # noqa: E402
from controllers.types import Agents  # noqa: E402
from engine.actors import Agent, BUSY, IDLE, STOPPED, WORKING  # noqa: E402
from engine.drivers import DRIVERS  # noqa: E402
from engine.record import Record  # noqa: E402
from features.auto.policy import QUESTION_REFUSAL  # noqa: E402
from providers import PROVIDERS  # noqa: E402
from providers.base import EVENTS, STATUS  # noqa: E402
from resources.base import SYSTEM  # noqa: E402
from tests.kit import check, done  # noqa: E402

features.unload()
features.load()



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
    check(f"{name}: after a tool call starts without declared work it is busy", agent.state(), BUSY)
    provider.handle(root, "main", {**payload, "hook_event_name": "PreToolUse", "tool_name": "Bash", "tool_input": {"command": "npm run build"}})
    row = agents.by_session("abc-1").data
    check(f"{name}: a shell command is reported as running and joins the ring", (row["running"]["what"], "done" in row["running"], [c["what"] for c in row["commands"]]), ("npm run build", False, ["npm run build"]))
    provider.handle(root, "main", {**payload, "hook_event_name": "PostToolUse", "tool_name": "Bash", "tool_input": {"command": "npm run build"}})
    row = agents.by_session("abc-1").data
    check(f"{name}: its end stamps the running command done; a read reports no command", (row["running"]["done"] >= row["running"]["at"], len(row["commands"])), (True, 1))
    agents.update(agents.by_session("abc-1").n, running={**row["running"], "changed": {"edited": 2}})
    provider.handle(root, "main", {**payload, "hook_event_name": "PreToolUse", "tool_name": "Bash", "tool_input": {"command": "npm test"}})
    check(f"{name}: a turn carries its change count across commands", agents.by_session("abc-1").running["changed"], {"edited": 2})
    provider.handle(root, "main", {**payload, "hook_event_name": "UserPromptSubmit"})
    check(f"{name}: the next turn clears the command and its change count", agents.by_session("abc-1").running, {})
    logged = (root / "runtime" / "commands.log").read_text().splitlines()
    check(f"{name}: every command starting is logged raw, as received, for the record", [line.split("\t")[1] for line in logged][-2:], ["'npm run build'", "'npm test'"])
    provider.handle(root, "main", {**payload, "hook_event_name": "PreToolUse", "tool_name": "Read", "tool_input": {"file_path": "/x"}})
    check(f"{name}: another tool leaves the ring and the last commands as they were", [c["what"] for c in agents.by_session("abc-1").data["commands"]], ["npm run build", "npm test"])
    agents.set(agents.by_session("abc-1").n, "status", IDLE)
    check(f"{name}: journal agent set status idle is the same funnel", agents.by_session("abc-1").data["status"], IDLE)
    question = {**payload, "hook_event_name": "PreToolUse", "tool_name": {"claude": "AskUserQuestion", "codex": "request_user_input"}[name]}
    check(f"{name}: a blocking question is allowed while auto is off", provider.handle(root, "main", question), {})
    record.features = {**record.features, "auto": True}
    check(f"{name}: auto refuses its blocking question tool", provider.handle(root, "main", question), {"decision": "block", "reason": QUESTION_REFUSAL})
    check(f"{name}: auto leaves an ordinary read alone", provider.handle(root, "main", {**question, "tool_name": "Read"}), {})
    if name == "codex":
        transcript = project / "rollout.jsonl"
        transcript.write_text("not json\n" + "\n".join(json.dumps(row) for row in [
            {"type": "event_msg", "payload": {"type": "token_count", "info": {"last_token_usage": {"total_tokens": 129200}, "model_context_window": 258400}}},
            {"type": "response_item", "timestamp": "2026-09-19T10:00:00Z", "payload": {"type": "custom_tool_call", "name": "exec", "input": 'const r=await tools.exec_command({cmd:"sed -n 1,80p .codex/skills/journal/SKILL.md"});'}},
        ]) + "\n")
        provider.handle(root, "main", {**payload, "transcript_path": str(transcript), "hook_event_name": "Stop"})
        check("codex: rollout context and explicit skill reads are detected", (agents.by_session("rollout").context, provider.crew(transcript)["skills"]), (50.0, ["journal"]))
        with transcript.open("a") as out:
            out.write(json.dumps({"type": "event_msg", "payload": {"type": "token_count", "info": {"last_token_usage": {"total_tokens": 193800}, "model_context_window": 258400}}}) + "\n")
        provider.handle(root, "main", {**payload, "transcript_path": str(transcript), "hook_event_name": "PreToolUse"})
        check("codex: each hook refreshes the latest rollout context", agents.by_session("rollout").context, 75.0)
        provider.handle(root, "main", {**payload, "hook_event_name": "PostToolUse", "tool_name": "Bash", "tool_response": {"session_id": 42}})
        row = agents.by_session("abc-1")
        check("codex: a yielded shell and subagent lifecycle are counted from hooks", (row.shells, row.subagents), (1, 1))

done()

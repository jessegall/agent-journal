import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from commands.http import dispatch  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

record = fresh("main")
project = record.root.parent
settings = project / ".claude" / "settings.json"
settings.parent.mkdir()
settings.write_text(json.dumps({"theme": "dark", "hooks": {"Stop": [{"hooks": [{"type": "command", "command": "echo mine"}]}]}}))

got = dispatch("GET", "/api/agent-hooks/claude", record.root, {}, {})
check("the agent's hooks are read from its own settings, with the file named", (got.code, got.body["path"], got.body["hooks"]["Stop"][0]["hooks"][0]["command"]), (200, ".claude/settings.json", "echo mine"))

edited = {"Stop": [{"hooks": [{"type": "command", "command": "echo changed"}]}], "PreToolUse": [], "PostToolUse": [{"matcher": "Edit", "hooks": [{"type": "command", "command": "npm run lint"}]}]}
saved = dispatch("POST", "/api/agent-hooks/claude", record.root, {}, {"hooks": edited})
written = json.loads(settings.read_text())
check("saving writes the hooks back, drops emptied events and keeps the other settings", (saved.code, sorted(written["hooks"]), written["hooks"]["Stop"][0]["hooks"][0]["command"], written["theme"]),
      (200, ["PostToolUse", "Stop"], "echo changed", "dark"))
bad = dispatch("POST", "/api/agent-hooks/claude", record.root, {}, {"hooks": {"Stop": [{"hooks": [{"type": "command", "command": "  "}]}]}})
check("a hook without a command is refused and nothing is written", (bad.code, json.loads(settings.read_text())["hooks"]["Stop"][0]["hooks"][0]["command"]), (400, "echo changed"))
check("an unknown provider is not found", dispatch("GET", "/api/agent-hooks/nobody", record.root, {}, {}).code, 404)

done()

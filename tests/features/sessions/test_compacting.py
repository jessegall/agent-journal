import json
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from controllers.types import Agents  # noqa: E402
from engine.actors import COMPACTING, STATES  # noqa: E402
from engine.drivers import DRIVERS  # noqa: E402
from engine.engine import Engine  # noqa: E402
from engine.hooks import EVENTS, handle  # noqa: E402
from providers import PROVIDERS  # noqa: E402
from resources.base import SYSTEM  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

features.unload()
features.load()

record = fresh()
provider = PROVIDERS["claude"]()
check("PreCompact is a wired hook event", "PreCompact" in EVENTS and "PreCompact" in provider.wiring("x")["hooks"], True)
handle(provider, record.root, record.env, {"hook_event_name": "PreToolUse", "session_id": "s-1", "tool_name": "Read"})
handle(provider, record.root, record.env, {"hook_event_name": "PreCompact", "session_id": "s-1"})
row = Agents(record, actor=SYSTEM).by_session("s-1")
check("the report says compacting, a state of its own", (row.data["status"], COMPACTING in STATES), (COMPACTING, True))
handle(provider, record.root, record.env, {"hook_event_name": "SessionStart", "session_id": "s-1", "source": "compact"})
check("the start after it is idle again", Agents(record, actor=SYSTEM).by_session("s-1").data["status"], "idle")

transcript = Path(tempfile.mkdtemp()) / "rollout.jsonl"
transcript.write_text(json.dumps({"type": "session_meta", "payload": {"source": {}}}) + "\n")
driver = DRIVERS["codex"](record, "codex-1", fd=1)
codex = PROVIDERS["codex"]()
handle(codex, record.root, record.env, {"hook_event_name": "UserPromptSubmit", "session_id": "codex-1", "transcript_path": str(transcript)})
engine = Engine(record, driver)
with transcript.open("a") as out:
    out.write(json.dumps({"type": "compacted", "payload": {}}) + "\n")
engine.crew()
check("Codex transcript compaction marks the session compacting without a native hook", Agents(record, actor=SYSTEM).by_session("rollout").status, COMPACTING)
with transcript.open("a") as out:
    out.write(json.dumps({"type": "response_item", "payload": {"type": "reasoning"}}) + "\n")
engine.crewed_at = 0
engine.crew()
check("Codex leaves compacting when native assistant activity resumes", Agents(record, actor=SYSTEM).by_session("rollout").status, "working")

done()

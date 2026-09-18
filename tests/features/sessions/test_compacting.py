import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from controllers.types import Agents  # noqa: E402
from engine.actors import COMPACTING, STATES  # noqa: E402
from providers import PROVIDERS  # noqa: E402
from providers.base import EVENTS  # noqa: E402
from resources.base import SYSTEM  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

features.unload()
features.load()

record = fresh()
provider = PROVIDERS["claude"]()
check("PreCompact is a wired hook event", "PreCompact" in EVENTS and "PreCompact" in provider.wiring("x")["hooks"], True)
provider.handle(record.root, record.env, {"hook_event_name": "PreToolUse", "session_id": "s-1", "tool_name": "Read"})
provider.handle(record.root, record.env, {"hook_event_name": "PreCompact", "session_id": "s-1"})
row = Agents(record, actor=SYSTEM).by_session("s-1")
check("the report says compacting, a state of its own", (row.data["status"], COMPACTING in STATES), (COMPACTING, True))
provider.handle(record.root, record.env, {"hook_event_name": "SessionStart", "session_id": "s-1", "source": "compact"})
check("the start after it is idle again", Agents(record, actor=SYSTEM).by_session("s-1").data["status"], "idle")

done()

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from controllers.types import Works  # noqa: E402
from features.start.feature import COMPACTED  # noqa: E402
from engine.hooks import handle, start_file  # noqa: E402
from providers import PROVIDERS  # noqa: E402
from resources.base import AGENT  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

features.unload()
features.load()

record = fresh()
Works(record, actor=AGENT).create("the header")
plain = start_file(record.root, record.env).read_text()
compacted = start_file(record.root, record.env, compacted=True).read_text()
check("every write also rewrites the compacted block, the recovery steps before the same block", compacted, COMPACTED + plain)
check("the steps name the reads that recover what the summary dropped", all(w in COMPACTED for w in ("conversation --back=1", "journal user", "journal open", "journal search", "Skill: journal")), True)

provider = PROVIDERS["claude"]()
start = lambda source: handle(provider, record.root, record.env, {"hook_event_name": "SessionStart", "session_id": "s-1", "source": source})["hookSpecificOutput"]["additionalContext"]
check("a fresh start is handed the plain block", start("startup"), plain)
check("a start after a compaction is handed the recovery steps first", start("compact"), compacted)
check("a resume is a fresh start", start("resume"), plain)

done()

import json
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from controllers.types import CONTROLLERS  # noqa: E402
from resources.base import AGENT  # noqa: E402
from tests.features.kit import idle, nudges  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

features.unload()
features.load()

transcript = Path(tempfile.mkdtemp()) / "s.jsonl"


def said(text):
    rows = [{"type": "user", "message": {"content": "go"}}, {"type": "assistant", "message": {"content": [{"type": "text", "text": text}]}}]
    transcript.write_text("\n".join(json.dumps(r) for r in rows) + "\n")


record = fresh()
said("[!reply] the header is fixed; I'll do that after this.")
idle(record, provider="claude", transcript=str(transcript))
check("work put off in words with nothing parked: named back, quoting the words", [n for n in nudges(record) if "deferred" in n], ["work deferred in words, not parked"])
check("the words are quoted in the nudge", "\"I'll do that\"" in CONTROLLERS["nudge"](record).all()[-1].brief or "after this" in CONTROLLERS["nudge"](record).all()[-1].brief, True)
CONTROLLERS["todo"](record, actor=AGENT).create("the footer, after the header")
said("[!reply] parked as to-do 1; I'll come back to it.")
idle(record, provider="claude", transcript=str(transcript))
check("a to-do parked since: nothing said", len([n for n in nudges(record) if "deferred" in n]), 1)
plain = fresh()
said("[!reply] all done.")
idle(plain, provider="claude", transcript=str(transcript))
check("nothing deferred: nothing said", [n for n in nudges(plain) if "deferred" in n], [])

done()

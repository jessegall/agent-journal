import json
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from features.tags.feature import visible  # noqa: E402
from tests.features.kit import idle, nudges  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

features.unload()
features.load()

transcript = Path(tempfile.mkdtemp()) / "s.jsonl"


def said(*texts):
    rows = [{"type": "user", "message": {"content": "go"}}] + [{"type": "assistant", "message": {"content": [{"type": "text", "text": t}]}} for t in texts]
    transcript.write_text("\n".join(json.dumps(r) for r in rows) + "\n")


record = fresh()
said("[!reply] done, pushed")
idle(record, provider="claude", transcript=str(transcript))
check("a tagged last message: nothing said", [n for n in nudges(record) if "tag" in n], [])
said("[!reply] on it", "Done, pushed.")
idle(record, provider="claude", transcript=str(transcript))
check("an untagged last message: told once, with the tags", [n for n in nudges(record) if "tag" in n], ["your last message has no tag"])
idle(record, provider="claude", transcript=str(transcript))
check("told once per idle stretch", len([n for n in nudges(record) if "tag" in n]), 2)
said("**[!info]** a build is running")
idle(record, provider="claude", transcript=str(transcript))
check("a bold tag counts", len([n for n in nudges(record) if "tag" in n]), 2)
check("display text removes the registered tag", (visible("[!info] a build is running"), visible("**[!reply]** done"), visible("plain text")), ("a build is running", "done", "plain text"))

done()

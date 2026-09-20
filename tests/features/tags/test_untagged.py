import json
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))
import features  # noqa: E402
from controllers.types import Messages  # noqa: E402
from features import FEATURES  # noqa: E402
from features.format import formatted  # noqa: E402
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
said_to_user = Messages(record, actor="agent").create("a reply", brief="[!reply] done, pushed")
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
said("[!invented] a made-up tag")
idle(record, provider="claude", transcript=str(transcript))
check("an invented leading tag is rejected", [n for n in nudges(record) if "tag" in n], ["your last message has no tag"] * 3)
said("[!reply][!invented] two leading tags")
idle(record, provider="claude", transcript=str(transcript))
check("a registered prefix does not hide an invented tag", [n for n in nudges(record) if "tag" in n], ["your last message has no tag"] * 4)
said("status [!reply] is ordinary text")
idle(record, provider="claude", transcript=str(transcript))
check("an inline tag-like phrase is rejected", [n for n in nudges(record) if "tag" in n], ["your last message has no tag"] * 5)
check("display text removes the registered tag", (visible("[!info] a build is running"), visible("**[!reply]** done"), visible("plain text")), ("a build is running", "done", "plain text"))
check("display text preserves an inline tag-like phrase", visible("status [!reply] is ordinary text"), "status [!reply] is ordinary text")
check("display text keeps a quote marker and drops the tag behind it", visible("> [!reply] done\n> and a second line\n\nExactly."), "> done\n> and a second line\n\nExactly.")
check("the tags feature is the one that strips them on the way out", [fn.__name__ for fn in FEATURES["tags"].formatters()], ["without_tags"])
check("text sent to the viewer has no tag, while the record keeps it",
      (formatted("[!reply] done, pushed", record), Messages(record).load(said_to_user.n).brief), ("done, pushed", "[!reply] done, pushed"))

done()

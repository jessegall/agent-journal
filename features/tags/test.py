import json

import pytest

import features
from controllers.types import Messages
from features import FEATURES
from features.format import formatted
from features.tags.feature import visible
from tests.kit import idle, nudges
from tests.conftest import fresh


@pytest.fixture(autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()


def test_an_untagged_last_message_is_told_once_per_idle_stretch(tmp_path):
    transcript = tmp_path / "s.jsonl"

    def said(*texts):
        rows = [{"type": "user", "message": {"content": "go"}}] + [{"type": "assistant", "message": {"content": [{"type": "text", "text": t}]}} for t in texts]
        transcript.write_text("\n".join(json.dumps(r) for r in rows) + "\n")

    record = fresh()
    said_to_user = Messages(record, actor="agent").create("a reply", brief="[!reply] done, pushed")
    said("[!reply] done, pushed")
    idle(record, provider="claude", transcript=str(transcript))
    assert [n for n in nudges(record) if "tag" in n] == [], "a tagged last message: nothing said"
    said("[!reply] on it", "Done, pushed.")
    idle(record, provider="claude", transcript=str(transcript))
    assert [n for n in nudges(record) if "tag" in n] == ["your last message has no tag"], \
        "an untagged last message: told once, with the tags"
    idle(record, provider="claude", transcript=str(transcript))
    assert len([n for n in nudges(record) if "tag" in n]) == 2, "told once per idle stretch"
    said("**[!info]** a build is running")
    idle(record, provider="claude", transcript=str(transcript))
    assert len([n for n in nudges(record) if "tag" in n]) == 2, "a bold tag counts"
    said("[!invented] a made-up tag")
    idle(record, provider="claude", transcript=str(transcript))
    assert [n for n in nudges(record) if "tag" in n] == ["your last message has no tag"] * 3, \
        "an invented leading tag is rejected"
    said("[!reply][!invented] two leading tags")
    idle(record, provider="claude", transcript=str(transcript))
    assert [n for n in nudges(record) if "tag" in n] == ["your last message has no tag"] * 4, \
        "a registered prefix does not hide an invented tag"
    said("status [!reply] is ordinary text")
    idle(record, provider="claude", transcript=str(transcript))
    assert [n for n in nudges(record) if "tag" in n] == ["your last message has no tag"] * 5, \
        "an inline tag-like phrase is rejected"
    assert (visible("[!info] a build is running"), visible("**[!reply]** done"), visible("plain text")) == \
        ("a build is running", "done", "plain text"), "display text removes the registered tag"
    assert visible("status [!reply] is ordinary text") == "status [!reply] is ordinary text", \
        "display text preserves an inline tag-like phrase"
    assert visible("> [!reply] done\n> and a second line\n\nExactly.") == "> done\n> and a second line\n\nExactly.", \
        "display text keeps a quote marker and drops the tag behind it"
    assert [fn.__name__ for fn, _ in FEATURES["tags"].formatters()] == ["without_tags"], \
        "the tags feature is the one that strips them on the way out"
    assert (formatted("[!reply] done, pushed", record), Messages(record).load(said_to_user.n).brief) == \
        ("done, pushed", "[!reply] done, pushed"), "text sent to the viewer has no tag, while the record keeps it"

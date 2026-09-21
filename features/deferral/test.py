import json

import pytest

import features
from controllers.types import Nudges, Todos
from resources.base import AGENT
from tests.kit import idle, nudges
from tests.conftest import fresh


@pytest.fixture(autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()


def test_work_deferred_in_words_with_nothing_parked_is_named_back(tmp_path):
    transcript = tmp_path / "s.jsonl"

    def said(text):
        rows = [{"type": "user", "message": {"content": "go"}}, {"type": "assistant", "message": {"content": [{"type": "text", "text": text}]}}]
        transcript.write_text("\n".join(json.dumps(r) for r in rows) + "\n")

    record = fresh()
    said("[!reply] the header is fixed; I'll do that after this.")
    idle(record, provider="claude", transcript=str(transcript))
    assert [n for n in nudges(record) if "deferred" in n] == ["work deferred in words, not parked"], \
        "work put off in words with nothing parked: named back, quoting the words"
    assert ("\"I'll do that\"" in Nudges(record).all()[-1].brief or "after this" in Nudges(record).all()[-1].brief) is True, \
        "the words are quoted in the nudge"
    Todos(record, actor=AGENT).create("the footer, after the header")
    said("[!reply] parked as to-do 1; I'll come back to it.")
    idle(record, provider="claude", transcript=str(transcript))
    assert len([n for n in nudges(record) if "deferred" in n]) == 1, "a to-do parked since: nothing said"
    plain = fresh()
    said("[!reply] all done.")
    idle(plain, provider="claude", transcript=str(transcript))
    assert [n for n in nudges(plain) if "deferred" in n] == [], "nothing deferred: nothing said"

import json

import pytest

import features
from controllers.types import Questions
from features.choices.feature import offers_choices
from engine.hooks import gate_file
from resources.base import AGENT
from tests.features.kit import idle, nudges
from tests.conftest import fresh


@pytest.fixture(autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()


def test_offers_choices_recognizes_numbered_and_lettered_options_but_not_prose():
    assert offers_choices("Which do you want?\n1. the blue one\n2. the red one") is True, \
        "a numbered list with a question offers choices"
    assert offers_choices("Should I:\nA) merge now\nB) wait for CI") is True, "lettered options too"
    assert offers_choices("Done:\n- built\n- tested") is False, "a list that asks nothing is a list"
    assert offers_choices("Shall I merge it?") is False, "a question without options is fine"
    assert offers_choices("Done:\n- built the route\n- tested it\n\nQuestion 15 is still open: should the server answer first?") is False, \
        "a summary that points at an open question by number is not offering choices"
    assert offers_choices("Done:\n- the engine can see which step is running\n- the band is taller") is False, \
        "a statement that uses 'which' asks nothing"
    assert offers_choices("Two ways:\n1. blue\n2. red\nLet me know.") is True, \
        "a list and a phrase addressed to the user still offers choices"
    assert offers_choices("See question 3.\nWhich do you want?\n1. blue\n2. red") is True, "choices beside a named question still count"


def test_choices_offered_in_prose_hold_writes_until_a_question_is_asked_properly():
    record = fresh()
    transcript = record.root / "runtime" / "t.jsonl"
    transcript.parent.mkdir(parents=True, exist_ok=True)

    def said(text):
        transcript.write_text(json.dumps({"type": "assistant", "message": {"role": "assistant", "content": [{"type": "text", "text": text}]}}) + "\n")

    def holds():
        f = gate_file(record.root, record.env, "claude-1")
        return json.loads(f.read_text()) if f.is_file() else {}

    said("[!reply] Which do you want?\n1. the blue one\n2. the red one")
    idle(record, provider="claude", transcript=str(transcript))
    assert ([n for n in nudges(record) if "choices in prose" in n], bool(holds().get("choices"))) == \
        (["your last message offers choices in prose"], True), "choices in prose: the agent is told once, and its writes are held"
    Questions(record, actor=AGENT).create("Which one?", options=[{"title": "the blue one", "description": "", "code": ""}, {"title": "the red one", "description": "", "code": ""}], pick=1)
    assert holds().get("choices", "") == "", "a question asked properly lifts the hold"

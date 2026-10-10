import json


from controllers.types import Nudges, Todos
from resources.base import AGENT
from tests.kit import idle, nudges
from tests.conftest import fresh


def test_work_deferred_in_words_with_nothing_parked_is_named_back(tmp_path):
    transcript = tmp_path / "s.jsonl"

    def text(text):
        rows = [{"type": "user", "message": {"content": "go"}}, {"type": "assistant", "message": {"content": [{"type": "text", "text": text}]}}]
        transcript.write_text("\n".join(json.dumps(r) for r in rows) + "\n")

    record = fresh()
    text("[!reply] the header is fixed; I'll do that after this.")
    idle(record, provider="claude", transcript=str(transcript))
    assert [n for n in nudges(record) if "deferred" in n] == ["work deferred in words, not parked"], \
        "work put off in words with nothing parked: named back, quoting the words"
    assert ("\"I'll do that\"" in Nudges(record).all()[-1].brief or "after this" in Nudges(record).all()[-1].brief) is True, \
        "the words are quoted in the nudge"
    Todos(record, actor=AGENT).create("the footer, after the header")
    text("[!reply] parked as to-do 1; I'll come back to it.")
    idle(record, provider="claude", transcript=str(transcript))
    assert len([n for n in nudges(record) if "deferred" in n]) == 1, "a to-do parked since: nothing said"
    plain = fresh()
    text("[!reply] all done.")
    idle(plain, provider="claude", transcript=str(transcript))
    assert [n for n in nudges(plain) if "deferred" in n] == [], "nothing deferred: nothing said"


def test_putting_work_off_is_heard_in_dutch_as_well_as_english():
    from features.put_off_work.handlers import DEFERS
    assert [bool(DEFERS.search(text)) for text in ("I'll do that after this.", "Dat doe ik straks.", "Daar kom ik later op terug.", "Ik heb het gedaan.")] == \
        [True, True, True, False], "both languages put work off in words, and saying it is done does not"


def test_a_type_keeps_only_as_many_parsed_rows_as_it_declares_and_parses_the_oldest_used_again(monkeypatch):
    from controllers.stored import RowStore
    from controllers.types import Docs
    from resources.base import SYSTEM
    from resources.types import Doc, Todo
    monkeypatch.setattr(Doc, "held", 2)
    record = fresh()
    docs = Docs(record, actor=SYSTEM)
    first, second, third = (docs.create(title).n for title in ("one", "two", "three"))
    parsed = []
    original = RowStore._parsed
    monkeypatch.setattr(RowStore, "_parsed", lambda self, n: parsed.append(n) or original(self, n))
    for n in (first, second, third, third, second, first):
        docs.rows.peek(n)
    assert parsed == [first, second, third, first], "a type that holds two parses its first row again once a third has pushed it out, and the one used last stays"
    assert (Todo.held, Todo.eager) == (None, True), "a type that is eager and holds every row says so on its resource"

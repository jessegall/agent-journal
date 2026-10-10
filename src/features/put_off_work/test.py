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
    docs.rows.rolling().clear()
    parsed = []
    original = RowStore._parsed
    monkeypatch.setattr(RowStore, "_parsed", lambda self, n: parsed.append(n) or original(self, n))
    for n in (first, second, third, third, second, first):
        docs.rows.peek(n)
    assert parsed == [first, second, third, first], "a type that holds two parses its first row again once a third has pushed it out, and the one used last stays"
    assert (Todo.held, Todo.eager) == (None, True), "a type that is eager and holds every row says so on its resource"


def test_the_totals_of_a_type_are_saved_with_its_index_and_equal_a_fresh_sum_after_a_restart_a_move_and_a_prune(tmp_path):
    import json
    from controllers import stored
    from controllers.types import Todos
    from engine.record import Record
    from resources.base import SYSTEM
    record = fresh()
    todos = Todos(record, actor=SYSTEM)
    made = [todos.create(f"row {i}").n for i in range(6)]
    todos.complete(made[0], how="done")
    todos.delete(made[1], why="put away")
    todos.rows.counts("overview")
    other = Todos(Record(record.root, "other"), actor=SYSTEM)
    todos.move(made[2], "other")
    todos.delete(made[3], why="put away")
    todos.force_delete(made[3])
    fresh_sum = lambda rows: tuple(stored.summed(rows.rows.counter(name).weigh, width, rows.rows.summaries()) for name, width in (("overview", 3), ("listable", 2)))
    kept = lambda rows: (rows.rows.counts("overview"), rows.rows.counts("listable"))
    assert (kept(todos), kept(other)) == (fresh_sum(todos), fresh_sum(other)), "totals kept by the changes equal a sum made from the rows after a complete, a delete, a move and a prune"
    stored.flush_indexes()
    folder = todos.rows.folder()
    saved = json.loads((folder / ".index" / "counters.json").read_text())
    assert saved["totals"]["overview"] == list(fresh_sum(todos)[0]), "the totals are saved beside the index"
    for table in (stored.SUMMARIES, stored.STANDING, stored.INDEXED, stored.PENDING, stored.INDEXED_AT, stored.STAMPED, stored.COUNTED, stored.DERIVED, stored.SEEDS, stored.UNCOUNTED):
        table.clear()
    restarted = Todos(record, actor=SYSTEM)
    restarted.rows.summaries()
    assert (str(folder), "overview") in stored.COUNTED and kept(restarted) == fresh_sum(restarted), "after a restart the saved totals are taken, and equal a fresh sum"
    stored.flush_indexes()
    (folder / ".index" / "index.json").write_text((folder / ".index" / "index.json").read_text() + " ")
    for table in (stored.SUMMARIES, stored.STANDING, stored.INDEXED, stored.PENDING, stored.INDEXED_AT, stored.STAMPED, stored.COUNTED, stored.DERIVED, stored.SEEDS, stored.UNCOUNTED):
        table.clear()
    foreign = Todos(record, actor=SYSTEM)
    foreign.rows.summaries()
    assert (str(folder), "overview") not in stored.COUNTED and kept(foreign) == fresh_sum(foreign), "totals saved with another index than the one standing are not believed, and are made from the rows"
    assert ([row["n"] for row in foreign.rows.unread("agent")], [row["n"] for row in foreign.rows.by("title", "row 4")]) == ([made[4], made[5]], [made[4]]), "unread and by answer from the indexes"
    stored.forget_folder(folder.parent)
    assert not [key for key in stored.COUNTED if key[0].startswith(str(folder.parent))] and str(folder) not in stored.SUMMARIES, "a folder that is removed lets go of what was held for it"

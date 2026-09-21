from resources.base import AGENT
from tests.conftest import fresh


def test_events_are_read_back_in_order_across_many_blocks_and_a_damaged_line_is_skipped():
    record = fresh()
    assert (record.events(), record.last_event()) == ([], 0), "no log: no events, and the last id is 0"
    for n in range(1, 3001):
        record.emit("todo", n, "created", AGENT, note="x" * 40)
    ids = [e.id for e in record.events()]
    assert (len(ids), ids[:2], ids[-1], ids == sorted(ids)) == (3000, [1, 2], 3000, True), \
        "every event, oldest first, read back across many blocks"
    assert [e.id for e in record.events(2995)] == [2996, 2997, 2998, 2999, 3000], "since an id: only what came after"
    assert [e.id for e in record.events(last=3)] == [2998, 2999, 3000], "the last n: the newest n, oldest first"
    assert [e.id for e in record.events(2990, last=4)] == [2997, 2998, 2999, 3000], "since and last together: whichever stops first"
    assert record.last_event() == 3000, "the last id comes from the tail"
    with (record.home / "events.jsonl").open("a") as fh:
        fh.write("not json\n")
    assert (record.last_event(), [e.id for e in record.events(2999)]) == (3000, [3000]), "a damaged line is skipped"
    assert record.emit("todo", 1, "updated", AGENT).id == 3001, "a new event after it still numbers on"

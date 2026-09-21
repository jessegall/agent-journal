from commands.http import dispatch
from controllers.base import LAST
from controllers.types import Messages
from resources.base import AGENT, USER
from tests.conftest import fresh


def stocked(n: int, handled: int = 0):
    record = fresh("main")
    messages = Messages(record, actor=USER)
    for i in range(1, n + 1):
        messages.create(f"message {i}")
    for number in range(1, handled + 1):
        Messages(record, actor=AGENT).method("processed")(number, "handled")
    return record


def listed(record, **query):
    return dispatch("GET", "/api/main/message", record.root, {k: str(v) for k, v in query.items()}, {}).body


def test_a_listing_with_nothing_asked_for_is_the_newest_twenty_five_still_open():
    record = stocked(250, handled=200)
    page = listed(record)
    assert ([r["n"] for r in page["rows"]], page["more"]) == (list(range(226, 251)), True), \
        "the newest twenty-five still open, and it says more are older"
    assert LAST == 25


def test_completed_rows_appear_only_when_they_are_asked_for():
    record = stocked(30, handled=20)
    assert [r["n"] for r in listed(record)["rows"]] == list(range(21, 31)), "ten open rows, no more"
    whole = listed(record, completed=1, last=0)
    assert (len(whole["rows"]), whole["more"]) == (30, False), "asked for, the completed rows come too"


def test_a_size_is_honoured_and_says_whether_more_are_older():
    record = stocked(250)
    page = listed(record, last=100)
    assert ([r["n"] for r in page["rows"]][0], len(page["rows"]), page["more"]) == (151, 100, True)
    assert (len(listed(record, last=1000)["rows"]), listed(record, last=1000)["more"]) == (250, False), \
        "a window past the start says there is nothing more"


def test_scrolling_back_asks_for_the_next_page_before_a_cursor():
    record = stocked(60)
    first = listed(record)
    oldest = first["rows"][0]["n"]
    next_page = listed(record, before=oldest)
    assert ([r["n"] for r in next_page["rows"]], next_page["more"]) == (list(range(11, 36)), True), \
        "the twenty-five before the cursor, and more still older"
    assert listed(record, before=next_page["rows"][0]["n"])["more"] is False, "the last page says there is no more"

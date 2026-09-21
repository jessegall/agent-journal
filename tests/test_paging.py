from commands.http import dispatch
from controllers.types import Messages
from resources.base import AGENT, USER
from tests.conftest import fresh


def test_the_newest_page_comes_back_with_open_older_messages_riding_along():
    record = fresh("main")
    messages = Messages(record, actor=USER)
    for i in range(1, 251):
        messages.create(f"message {i}")
    for n in range(1, 241):
        Messages(record, actor=AGENT).method("processed")(n, "handled")

    page = dispatch("GET", "/api/main/message", record.root, {"last": "100"}, {}).body
    numbers = [r["n"] for r in page["rows"]]
    assert (numbers[-1], len([n for n in numbers if n > 150]), page["more"]) == (250, 100, True), \
        "the newest hundred come back, and it says more are older"
    assert [n for n in numbers if n <= 150] == [], "older messages still open ride along, so waiting counts stay right"
    bigger = dispatch("GET", "/api/main/message", record.root, {"last": "200"}, {}).body
    assert (min(r["n"] for r in bigger["rows"]), bigger["more"]) == (51, True), "a bigger window reaches further back"
    everything = dispatch("GET", "/api/main/message", record.root, {"last": "1000"}, {}).body
    assert (len(everything["rows"]), everything["more"]) == (250, False), "a window past the start says there is nothing more"
    plain = dispatch("GET", "/api/main/message", record.root, {}, {}).body
    assert len(plain) == 250, "without last the list is whole, as before"


def test_open_older_messages_ride_beside_the_window_with_no_more_than_a_window_of_them():
    record = fresh("main")
    m = Messages(record, actor=USER)
    for i in range(1, 11):
        m.create(f"m {i}")
    page = dispatch("GET", "/api/main/message", record.root, {"last": "3"}, {}).body
    assert [r["n"] for r in page["rows"]] == list(range(5, 11)), \
        "open older messages are kept beside the window, no more than a window of them"


def test_a_thread_of_open_rows_still_comes_back_as_a_page():
    record = fresh("main")
    m = Messages(record, actor=USER)
    for i in range(1, 501):
        m.create(f"m {i}")
    page = dispatch("GET", "/api/main/message", record.root, {"last": "100"}, {}).body
    assert (len(page["rows"]), page["more"]) == (200, True), "a thread of open rows still comes back as a page"

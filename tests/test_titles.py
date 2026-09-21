from commands.http import dispatch
from resources.base import TITLE_MAX, titled
from tests.conftest import fresh


def test_a_title_is_cut_at_a_word_colons_made_safe_and_quotes_skipped():
    long = "Also the message sanitizers and formatters should agree on every case we have seen so far, including quotes and code"
    title = titled(long)
    assert (title.endswith("…"), len(title) <= TITLE_MAX, long.startswith(title[:-1])) == (True, True, True), \
        "a long text is cut at a word and ends in an ellipsis"
    assert (title[:-1] == long[:len(title) - 1] and long[len(title) - 1] == " ") is True, "the cut never ends on a half word"
    assert titled("fix it: now") == "fix it - now", "a short text is its own title, colons made safe"
    assert titled("> what the agent said\n\nyes, do that") == "yes, do that", \
        "a quoted line is skipped for the first line of the user's own words"
    assert (len(titled("x" * 200)), titled("x" * 200)[-1]) == (TITLE_MAX, "…"), \
        "one unbroken word longer than a title is cut with an ellipsis"
    assert titled("   ") == "untitled", "nothing to say is untitled"

    record = fresh("main")
    made = dispatch("POST", "/api/main/message", record.root, {}, {"brief": long})
    assert (made.code, made.body["title"]) == (201, title), "the viewer may send a message without a title: the server titles it"
    named = dispatch("POST", "/api/main/message", record.root, {}, {"title": "my own", "brief": long})
    assert named.body["title"] == "my own", "a title the viewer gives is kept"

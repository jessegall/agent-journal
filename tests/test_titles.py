import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from commands.http import dispatch  # noqa: E402
from resources.base import TITLE_MAX, titled  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

long = "Also the message sanitizers and formatters should agree on every case we have seen so far, including quotes and code"
title = titled(long)
check("a long text is cut at a word and ends in an ellipsis", (title.endswith("…"), len(title) <= TITLE_MAX, long.startswith(title[:-1])), (True, True, True))
check("the cut never ends on a half word", title[:-1] == long[:len(title) - 1] and long[len(title) - 1] == " ", True)
check("a short text is its own title, colons made safe", titled("fix it: now"), "fix it - now")
check("a quoted line is skipped for the first line of the user's own words", titled("> what the agent said\n\nyes, do that"), "yes, do that")
check("one unbroken word longer than a title is cut with an ellipsis", (len(titled("x" * 200)), titled("x" * 200)[-1]), (TITLE_MAX, "…"))
check("nothing to say is untitled", titled("   "), "untitled")

record = fresh("main")
made = dispatch("POST", "/api/main/message", record.root, {}, {"brief": long})
check("the viewer may send a message without a title: the server titles it", (made.code, made.body["title"]), (201, title))
named = dispatch("POST", "/api/main/message", record.root, {}, {"title": "my own", "brief": long})
check("a title the viewer gives is kept", named.body["title"], "my own")

done()

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from commands.http import dispatch  # noqa: E402
from controllers.types import Messages  # noqa: E402
from resources.base import AGENT, USER  # noqa: E402
from tests.kit import check, done, fresh  # noqa: E402

record = fresh("main")
messages = Messages(record, actor=USER)
for i in range(1, 251):
    messages.create(f"message {i}")
for n in range(1, 241):
    Messages(record, actor=AGENT).method("processed")(n, "handled")

page = dispatch("GET", "/api/main/message", record.root, {"last": "100"}, {}).body
numbers = [r["n"] for r in page["rows"]]
check("the newest hundred come back, and it says more are older", (numbers[-1], len([n for n in numbers if n > 150]), page["more"]), (250, 100, True))
check("older messages still open ride along, so waiting counts stay right", [n for n in numbers if n <= 150], [])
bigger = dispatch("GET", "/api/main/message", record.root, {"last": "200"}, {}).body
check("a bigger window reaches further back", (min(r["n"] for r in bigger["rows"]), bigger["more"]), (51, True))
everything = dispatch("GET", "/api/main/message", record.root, {"last": "1000"}, {}).body
check("a window past the start says there is nothing more", (len(everything["rows"]), everything["more"]), (250, False))
plain = dispatch("GET", "/api/main/message", record.root, {}, {}).body
check("without last the list is whole, as before", len(plain), 250)

record = fresh("main")
m = Messages(record, actor=USER)
for i in range(1, 11):
    m.create(f"m {i}")
page = dispatch("GET", "/api/main/message", record.root, {"last": "3"}, {}).body
check("open older messages are kept beside the window, no more than a window of them", [r["n"] for r in page["rows"]], list(range(5, 11)))

record = fresh("main")
m = Messages(record, actor=USER)
for i in range(1, 501):
    m.create(f"m {i}")
page = dispatch("GET", "/api/main/message", record.root, {"last": "100"}, {}).body
check("a thread of open rows still comes back as a page", (len(page["rows"]), page["more"]), (200, True))

done()

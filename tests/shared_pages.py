import json
import threading
import urllib.request
from collections.abc import Iterator
from contextlib import contextmanager
from http.server import ThreadingHTTPServer
from typing import NamedTuple

from controllers.types import Docs
from features.collections.controller import Collections
from features.plans.controller import Plans
from features.boards.controller import Boards
from features.tickets.controller import Tickets
from engine.record import Record
from features.sharing.controller import Shares
from features.sharing.server import ShareHandler
from resources.base import AGENT, USER
from tests.conftest import fresh

ASKED = {"Content-Type": "application/json", "X-Shared-Comment": "1"}
SEEN = 10


class SharedPages(NamedTuple):
    open: str
    ended: str
    missing: str
    collection: str


@contextmanager
def served() -> Iterator[SharedPages]:
    """The share server a visitor reaches: a doc that takes comments and holds a question, a link that ended, a link that never was."""
    record = fresh()
    docs, shares = Docs(record, actor=USER), Shares(record, actor=USER)
    doc = docs.create("Proposal for visitors", brief="The plan the visitor reads")
    docs.section(doc.n, "Details", "Every detail of the plan")
    share = shares.create(f"doc:{doc.n}", comments=True)
    ended = shares.create(f"doc:{doc.n}")
    shares.complete(ended.n, "done")
    ticket = Record(record.root, "ticket-1")
    ticket.home.mkdir(parents=True)
    away = Plans(ticket, actor=AGENT).create("Plan from the ticket", goal="Done elsewhere")
    group = Collections(record, actor=AGENT).create("Launch pile")
    Collections(record, actor=AGENT).add(group.n, [f"doc:{doc.n}", f"ticket-1/{away.ref}"])
    board = Boards(record, actor=USER).create("Launch board", stages=["Ideas", "Doing"], goal="Visitors log in without a reload", done_when=["The login page loads", "A wrong password is refused"])
    login = Tickets(record, actor=USER).create("Fix the login page", stage="Doing", board=board.n)
    login = Tickets(record, actor=USER).update(login.n, work_environment="ticket-1", plan=away.n)
    Collections(record, actor=AGENT).add(group.n, [login.ref, board.ref])
    pile = shares.create(f"collection:{group.n}")
    server = ThreadingHTTPServer(("127.0.0.1", 0), type("Bound", (ShareHandler,), {"shares": shares}))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{server.server_port}"
    body = json.dumps({"about": f"doc:{doc.n}", "name": "Robin", "text": "Which shift suits you?"}).encode()
    comment = json.loads(urllib.request.urlopen(urllib.request.Request(f"{base}/s/{share.token}/comment", body, ASKED, method="POST"), timeout=SEEN).read())
    Shares(record, actor=AGENT).ask(comment["n"], "Which shift?", "Day shift|Night shift")
    Shares(record, actor=AGENT).ask(comment["n"], "Which room?", "Front room|Back room")
    try:
        yield SharedPages(f"{base}/s/{share.token}/", f"{base}/s/{ended.token}/", f"{base}/s/{'0' * len(share.token)}/", f"{base}/s/{pile.token}/")
    finally:
        server.shutdown()

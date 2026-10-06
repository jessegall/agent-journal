import json
import threading
import urllib.request
from collections.abc import Iterator
from contextlib import contextmanager
from http.server import ThreadingHTTPServer
from typing import NamedTuple

from controllers.types import Docs
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
    server = ThreadingHTTPServer(("127.0.0.1", 0), type("Bound", (ShareHandler,), {"shares": shares}))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{server.server_port}"
    body = json.dumps({"about": f"doc:{doc.n}", "name": "Robin", "text": "Which shift suits you?"}).encode()
    comment = json.loads(urllib.request.urlopen(urllib.request.Request(f"{base}/s/{share.token}/comment", body, ASKED, method="POST"), timeout=SEEN).read())
    Shares(record, actor=AGENT).ask(comment["n"], "Which shift?", "Day shift|Night shift")
    Shares(record, actor=AGENT).ask(comment["n"], "Which room?", "Front room|Back room")
    try:
        yield SharedPages(f"{base}/s/{share.token}/", f"{base}/s/{ended.token}/", f"{base}/s/{'0' * len(share.token)}/")
    finally:
        server.shutdown()

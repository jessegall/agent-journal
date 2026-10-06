import threading
from collections.abc import Iterator
from contextlib import contextmanager
from http.server import ThreadingHTTPServer
from typing import NamedTuple

from controllers.features import Features
from controllers.types import Questions, Todos
from engine.viewer import SERVING
from features.phone.controller import Phones
from features.sharing.controller import Shares
from features.sharing.details import SharingDetails
from features.sharing.server import ShareHandler
from resources.base import AGENT, SYSTEM, USER
from serve import Handler, JournalServer
from tests.conftest import fresh


class PhonePage(NamedTuple):
    pair: str


@contextmanager
def served() -> Iterator[PhonePage]:
    """The computer a phone reaches: its page, its desktop server, a code that pairs it once, a to-do, and questions waiting for an answer."""
    import features
    features.load()
    record = fresh()
    Features(record, actor=USER).configure(SharingDetails.name, "host", "t.example")
    server = ThreadingHTTPServer(("127.0.0.1", 0), type("Bound", (ShareHandler,), {"shares": Shares(record, actor=SYSTEM)}))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    desk = JournalServer(("127.0.0.1", 0), type("Desk", (Handler,), {"root": record.root}))
    threading.Thread(target=desk.serve_forever, daemon=True).start()
    SERVING[str(record.root.resolve())] = f"http://127.0.0.1:{desk.server_port}/"
    Todos(record, actor=AGENT).create("Water the plants", brief="A to-do the phone lists")
    for title, abstract, choices in (
        ("Which road?", "The phone answers it by a tap", ("Coast road", "Hill road")),
        ("Which hat?", "The phone answers it in its own words", ("Red hat", "Blue hat")),
        ("Which bridge?", "The computer refuses the answer", ("Old bridge", "New bridge")),
    ):
        Questions(record, actor=AGENT).create(title, abstract=abstract, options=[{"title": choice, "brief": "an option"} for choice in choices], pick=1)
    code = Phones(record, actor=USER).connect(7)["link"].split("#", 1)[1]
    try:
        yield PhonePage(f"http://127.0.0.1:{server.server_port}/p/#{code}")
    finally:
        SERVING.pop(str(record.root.resolve()))
        desk.shutdown()
        server.shutdown()

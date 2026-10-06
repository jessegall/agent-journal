import threading
from collections.abc import Iterator
from contextlib import contextmanager
from http.server import ThreadingHTTPServer
from typing import NamedTuple

from controllers.features import Features
from controllers.types import Docs, Environments, Facts, Questions, Todos
from features.collections.controller import Collections
from features.plans.controller import Plans
from features.suggestions.controller import Suggestions
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
    """The computer a phone reaches: its page, its desktop server, a code that pairs it once, two environments, a project file, a to-do in a plan, questions and a suggestion waiting for an answer, and a document on a shelf, and to-dos in lanes."""
    import features
    features.load()
    record = fresh()
    Features(record, actor=USER).configure(SharingDetails.name, "host", "t.example")
    server = ThreadingHTTPServer(("127.0.0.1", 0), type("Bound", (ShareHandler,), {"shares": Shares(record, actor=SYSTEM)}))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    desk = JournalServer(("127.0.0.1", 0), type("Desk", (Handler,), {"root": record.root}))
    threading.Thread(target=desk.serve_forever, daemon=True).start()
    SERVING[str(record.root.resolve())] = f"http://127.0.0.1:{desk.server_port}/"
    for name in (record.env, "garden"):
        Environments(record, actor=AGENT).create(name)
    (record.root.parent / "roses.txt").write_text("Red roses\nWhite roses\nYellow roses\n")
    todos = Todos(record, actor=AGENT)
    plants = todos.create("Water the plants", brief="A to-do the phone lists")
    plan = Plans(record, actor=AGENT).create("Keep the garden", abstract="A plan the phone lists with its phases")
    Plans(record, actor=AGENT).phase(plan.n, "Watering", when="the plants are watered")
    Plans(record, actor=AGENT).place(plan.n, 1, [plants.n])
    Suggestions(record, actor=AGENT).create("Plant more roses", abstract="A suggestion the phone answers")
    notes = Docs(record, actor=AGENT).create("Garden notes", abstract="A document on a shelf")
    Collections(record, actor=AGENT).add(Collections(record, actor=AGENT).create("Garden").n, [notes.ref])
    Facts(record, actor=AGENT).create("The roses face south", brief="A fact the phone can close", keywords=["roses"])
    todos.block(todos.create("Fix the gate", brief="A to-do held by a reason").n, "waits for the hinges")
    todos.create("Paint the shed", brief="A to-do the phone moves between lanes", priority="high")
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

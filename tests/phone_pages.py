import threading
from collections.abc import Iterator
from contextlib import contextmanager
from http.server import ThreadingHTTPServer
from typing import NamedTuple

from controllers.features import Features
from controllers.agents import Agents
from controllers.types import Docs, Environments, Facts, Messages, Questions, Todos, Works
from features.collections.controller import Collections
from features.plans.controller import Plans
from features.suggestions.controller import Suggestions
from features.templates.shipped import ship
from engine.viewer import SERVING
from features.phone.controller import Phones
from features.sharing.controller import Shares
from features.sharing.details import SharingDetails
from features.sharing.server import ShareHandler
from resources.base import AGENT, SYSTEM, USER
from serve import Handler, JournalServer
from tests.conftest import fresh
from tests.kit import commit, git


class PhonePage(NamedTuple):
    pair: str
    desk: str


def add_committed_roses(record) -> None:
    """A git commit in the project, a closed to-do whose work changed a file in it, and a message that names the commit."""
    project = record.root.resolve().parent
    git(project, "init", "-q", "-b", "main")
    git(project, "config", "user.email", "phone@example.com")
    git(project, "config", "user.name", "Phone")
    sha = commit(project, "roses.txt", "Red roses\nWhite roses\nYellow roses\n")
    roses = Todos(record, actor=AGENT).create("Plant the roses", brief="A to-do whose work changed a file and made a commit")
    work = Works(record, actor=AGENT).create("Plant the roses", todo=roses.n)
    Works(record, actor=SYSTEM).update(work.n, changed=[{"path": "roses.txt", "added": 3, "removed": 0, "created": True}],
                                       commits=[{"sha": sha, "subject": "write roses.txt"}])
    Works(record, actor=AGENT).complete(work.n, "planted")
    Todos(record, actor=AGENT).complete(roses.n, "planted")
    Messages(record, actor=USER).create("The roses", brief=f"The roses went in with commit {sha}")


@contextmanager
def served() -> Iterator[PhonePage]:
    """The computer a phone reaches: its page, its desktop server, a code that pairs it once, two environments, a project file in a git commit with a closed to-do whose work made it and a message naming it, a to-do in a plan, questions and a suggestion waiting for an answer, a document on a shelf with two versions, the shipped templates, to-dos in lanes, and an agent with a loaded skill and a repeating prompt."""
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
    todos = Todos(record, actor=AGENT)
    plants = todos.create("Water the plants", brief="A to-do the phone lists")
    plan = Plans(record, actor=AGENT).create("Keep the garden", abstract="A plan the phone lists with its phases")
    Plans(record, actor=AGENT).phase(plan.n, "Watering", when="the plants are watered")
    Plans(record, actor=AGENT).place(plan.n, 1, [plants.n])
    Suggestions(record, actor=AGENT).create("Plant more roses", abstract="A suggestion the phone answers")
    ship(record)
    docs = Docs(record, actor=AGENT)
    notes = docs.create("Garden notes", abstract="A document on a shelf")
    docs.section(notes.n, "Soil", "Loam")
    docs.stamp(notes.n, open_until=0)
    docs.section(notes.n, "Soil", "Clay")
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
    Agents(record, actor=SYSTEM).create("claude-garden", status="idle", provider="claude", model="claude-opus-5-5", effort="high", context=40,
                                        skills=["journal"], loops={"loop-1": {"schedule": "*/10 * * * *", "prompt": "Water the roses", "at": 0}})
    add_committed_roses(record)
    code = Phones(record, actor=USER).connect(7)["link"].split("#", 1)[1]
    try:
        yield PhonePage(f"http://localhost:{server.server_port}/p/#{code}", f"http://127.0.0.1:{desk.server_port}/#/{record.env}")
    finally:
        SERVING.pop(str(record.root.resolve()))
        desk.shutdown()
        server.shutdown()

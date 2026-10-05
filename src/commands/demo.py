import json
from collections.abc import Iterator
from pathlib import Path

import features
from commands.http import dispatch
from engine.record import Record
from engine.stored import read_json, write_json
from engine.transaction import apart
from engine.wording import digest
from features.phone.controller import CARDS, Phones
from features.phone.resource import Phone
from features.phone.routes import read_body
from features.session_recording.demo import BRANCHES, Throwaway, frames, leaks
from features.session_recording.scrub import Scrubber
from resources.base import SYSTEM, Event, Refused

EVERYTHING = 100000
EVENTS = 1000
NEVER = 4e9
DEMO_KEY = "demo"
PHONE = "phone."
APP = {"manifest": "/api/manifest", "identity": "/api/identity", "pages": "/api/pages", "summary": "/api/summary", "agents": "/api/agents"}
ENVIRONMENT = {"settings": "settings", "bar": "bar", "family": "family"}
SETUP = ("feature", "record", "sequence", "trigger", "template")


def shown(event: Event) -> bool:
    return event.type not in SETUP or "setting" in event.data


def demo_built(folder: Path, into: Path, environment: str = "", name: str = "") -> str:
    demo = branched(folder, environment, name or folder.resolve().name)
    write_json(into, demo)
    return f"wrote {len(demo['moments'])} moments and {len(demo['answers'])} answers into {into}"


def ask(root: Path, path: str, query: dict | None = None) -> object:
    reply = dispatch("GET", path, root, query or {}, {})
    if reply.code != 200:
        raise Refused(f"the server answered {reply.code} to GET {path}: {reply.body}")
    return reply.body


def server_answers(root: Path, env: str) -> Iterator[tuple[str, object]]:
    manifest = ask(root, APP["manifest"])
    yield from ((name, ask(root, path)) for name, path in APP.items())
    yield from ((name, ask(root, f"/api/{env}/{path}")) for name, path in ENVIRONMENT.items())
    events = [Event(**raw) for raw in ask(root, f"/api/{env}/events", {"since": "0", "last": str(EVENTS)})]
    yield "events", [event.to_json() for event in events if shown(event)]
    rows = {kind: ask(root, f"/api/{env}/{kind}", {"completed": "1", "last": str(EVERYTHING)}) for kind in manifest["types"]}
    yield from ((f"rows.{kind}", listed) for kind, listed in rows.items())
    yield from edits(root, env, [agent["n"] for agent in rows["agent"]["rows"]])
    yield from phoned(root, env)


def edits(root: Path, env: str, agents: list[int]) -> Iterator[tuple[str, object]]:
    for n in agents:
        feed = ask(root, f"/api/{env}/agent/{n}/edits", {"since": "0", "last": str(EVERYTHING)})
        yield f"edits.{n}", feed
        yield f"edited.{n}", {card["id"]: ask(root, f"/api/{env}/agent/{n}/edits/file", {"id": card["id"], "side": "after"}) for card in feed["edits"]}


def phoned(root: Path, env: str) -> Iterator[tuple[str, object]]:
    phones = Phones(Record(root, env), actor=SYSTEM)
    connected = phones.connected()
    try:
        reads = dict(phone_reads(root, phones, connected[-1] if connected else phones.stand_in(DEMO_KEY, NEVER)))
    except Refused:
        return
    yield from reads.items()


def phone_reads(root: Path, phones: Phones, phone: Phone) -> Iterator[tuple[str, object]]:
    feed = read_body(phones, phone, ["feed"], {})
    yield "phone.feed", feed
    yield from ((f"phone.{path}", read_body(phones, phone, [path], {})) for path in ("state", "bar"))
    places = read_body(phones, phone, ["places"], {})
    recorded = str(root.resolve())
    yield "phone.places", {**places, "at": recorded, "places": [place for place in places["places"] if Path(place["root"]).resolve() == root.resolve()]}
    lists = {kind: read_body(phones, phone, ["list"], {"type": [kind]}) for kind in CARDS}
    yield from ((f"phone.list.{kind}", listed) for kind, listed in lists.items())
    named = [*feed["items"], *feed["waiting"], *(row for listed in lists.values() for row in listed["rows"])]
    for ref in dict.fromkeys(item["ref"] for item in named if "ref" in item):
        kind, _, n = ref.partition(":")
        try:
            yield f"phone.row.{ref}", read_body(phones, phone, ["row", kind, n], {})
        except Refused:
            continue


def branched(folder: Path, env: str, name: str) -> dict:
    with apart():
        return grown(folder, env, name)


def grown(folder: Path, env: str, name: str) -> dict:
    demo = built(folder, env, name)
    listed = folder / BRANCHES / "branches.json"
    if not listed.is_file():
        return demo
    branches = {}
    for label, sub in read_json(listed, dict, {}).items():
        branch = built(folder / BRANCHES / sub, env, name)
        demo["answers"].update(branch["answers"])
        branches[label] = branch["moments"]
    return {**demo, "branches": branches}


def built(folder: Path, env: str = "", name: str | None = None) -> dict:
    scrubber = Scrubber()
    found = leaks(folder, scrubber)
    if found:
        raise Refused("the recording still holds the machine, run journal record scrub first: " + "; ".join(found[:5]))
    features.load()
    world = Throwaway(folder / "blobs", name or folder.resolve().name)
    stored: dict[str, object] = {}
    phoned: dict[str, str] = {}
    moments = []
    try:
        for frame in frames(folder):
            world.restore(frame)
            env = env or world.environments()[0]
            answers = {}
            for name, answer in server_answers(world.root, env):
                text = json.dumps(answer, sort_keys=True)
                answers[name] = digest(text, 12)
                stored[answers[name]] = json.loads(text)
            phoned = {name: id for name, id in answers.items() if name.startswith(PHONE)} or phoned
            moments.append({"at": frame.at, "events": len(frame.events), "answers": {**phoned, **answers}})
        shipped = Scrubber(world.folders())
        demo = json.loads(shipped.text(json.dumps({"answers": stored, "moments": moments})))
    finally:
        world.cleared()
    remaining = shipped.leaks(json.dumps(demo))
    if remaining:
        raise Refused("the demo's data still holds the machine: " + "; ".join(remaining[:5]))
    return demo

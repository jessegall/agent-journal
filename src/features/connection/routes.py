from dataclasses import asdict, dataclass

from controllers.requests import run
from engine import runtime
from resources.fields import Loaded
from engine.handover import give, taken
from engine.machines import Lease
from engine.offline import Applied, Write
from engine.record import Record
from features.connection.linking import local_hello
from features.routing import Reply, Request, handles
from resources.base import PROJECT


@dataclass(frozen=True)
class Handed(Loaded):
    """An environment a copy hands to this journal, or asks back for, and the lease it moves under."""

    env: str
    machine: str
    epoch: int = 0


@dataclass(frozen=True)
class EnvironmentAsked(Loaded):
    env: str


@dataclass(frozen=True)
class EventsAsked(Loaded):
    """The events of one scope a copy has not taken in yet; the environment's own scope is the empty one."""

    env: str
    scope: str = ""
    since: int = 0


@handles("GET", "/api/sync/hello")
def get_sync_hello(req: Request) -> Reply:
    return Reply(200, local_hello(req.record()).to_json())


@handles("POST", "/api/sync/handover")
def post_sync_handover(req: Request) -> Reply:
    """Takes an environment under the lease the copy names; the same lease sent again after a lost answer is taken once."""
    handed = Handed.from_json(req.body)
    record = Record(req.root, handed.env)
    return Reply(200, asdict(taken(record, "", Lease(handed.machine, handed.epoch))))


@handles("POST", "/api/sync/handback")
def post_sync_handback(req: Request) -> Reply:
    """Lets an environment go to the copy that asks; asked again after a lost answer, it names the lease it already gave."""
    handed = Handed.from_json(req.body)
    record = Record(req.root, handed.env)
    current = record.lease("")
    if current.machine == handed.machine:
        return Reply(200, asdict(current))
    return Reply(200, asdict(give(record, "", handed.machine)))


@handles("POST", "/api/sync/holder")
def post_sync_holder(req: Request) -> Reply:
    """Which machine writes an environment, and from which epoch: how a copy settles a handover whose answer it lost."""
    return Reply(200, asdict(Record(req.root, EnvironmentAsked.from_json(req.body).env).lease("")))


@handles("POST", "/api/sync/write")
def post_sync_write(req: Request) -> Reply:
    """A write a copy made into a scope this journal holds, applied once however often it arrives."""
    Applied(runtime.folder(req.root)).apply(Write.from_json(req.body), lambda held: run(req.root, held.asked))
    return Reply(200, {"applied": True})


@handles("POST", "/api/sync/events")
def post_sync_events(req: Request) -> Reply:
    asked = EventsAsked.from_json(req.body)
    record = Record(req.root, asked.env)
    found = record.event_log.project.events(asked.since) if asked.scope == PROJECT else record.event_log.own(asked.since)
    return Reply(200, {"events": [asdict(event) for event in found]})

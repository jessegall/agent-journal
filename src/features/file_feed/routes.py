from dataclasses import asdict, dataclass
from engine.fields import Loaded
from features.file_feed.feed import NoSuchEdit, PAGE, Side, edited_file, edits_before, edits_since, notes
from features.routing import Reply, Request, handles
from resources.base import Missing, Refused


@dataclass(frozen=True)
class EditsQuery(Loaded):
    since: float = 0.0
    last: int = PAGE


@dataclass(frozen=True)
class OlderEditsQuery(Loaded):
    before: float
    last: int = PAGE


@dataclass(frozen=True)
class EditedFileQuery(Loaded):
    id: str
    side: str = Side.AFTER


@handles("GET", "/api/{env}/changes")
def get_changes(req: Request) -> Reply:
    return Reply(200, {"changes": [asdict(note) for note in reversed(notes(req.record()))]})


@handles("GET", "/api/{env}/agent/{n}/edits")
def get_edits(req: Request) -> Reply:
    asked = req.query_as(EditsQuery)
    return Reply(200, asdict(edits_since(req.record(), int(req.params["n"]), asked.since, asked.last)))


@handles("GET", "/api/{env}/agent/{n}/edits/older")
def get_older_edits(req: Request) -> Reply:
    asked = req.query_as(OlderEditsQuery)
    return Reply(200, asdict(edits_before(req.record(), int(req.params["n"]), asked.before, asked.last)))


@handles("GET", "/api/{env}/agent/{n}/edits/file")
def get_edited_file(req: Request) -> Reply:
    asked = req.query_as(EditedFileQuery)
    if asked.side not in Side:
        raise Refused(f"side is {Side.BEFORE} or {Side.AFTER}")
    try:
        return Reply(200, asdict(edited_file(req.record(), int(req.params["n"]), asked.id, Side(asked.side))))
    except NoSuchEdit as error:
        raise Missing(str(error)) from error

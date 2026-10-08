from dataclasses import dataclass
from controllers.invoke import invoked
from controllers.types import Agents
from engine.fields import Loaded
from features.file_feed.feed import PAGE, Side
from features.routing import Reply, Request, handles


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
    return Reply(200, invoked(req.as_user(Agents), "changes"))


@handles("GET", "/api/{env}/agent/{n}/edits")
def get_edits(req: Request) -> Reply:
    asked = req.query_as(EditsQuery)
    return Reply(200, invoked(req.as_user(Agents), "edits", (int(req.params["n"]),), {"since": asked.since, "last": asked.last}))


@handles("GET", "/api/{env}/agent/{n}/edits/older")
def get_older_edits(req: Request) -> Reply:
    asked = req.query_as(OlderEditsQuery)
    return Reply(200, invoked(req.as_user(Agents), "older_edits", (int(req.params["n"]),), {"before": asked.before, "last": asked.last}))


@handles("GET", "/api/{env}/agent/{n}/edits/file")
def get_edited_file(req: Request) -> Reply:
    asked = req.query_as(EditedFileQuery)
    return Reply(200, invoked(req.as_user(Agents), "edited_file", (int(req.params["n"]),), {"id": asked.id, "side": asked.side}))

import json
from dataclasses import dataclass, field
from typing import ClassVar

from resources.fields import Loaded
from resources.base import Refused

TEAMS = "query { teams { nodes { id key name } } }"
ISSUES = """query($after: String, $filter: IssueFilter) {
  issues(first: 50, after: $after, filter: $filter, orderBy: updatedAt) {
    nodes { id identifier title description url updatedAt state { id } team { id } creator { name } assignee { isMe }
            comments { nodes { id body createdAt user { name } } } }
    pageInfo { hasNextPage endCursor }
  }
}"""
WORKFLOW = "query { workflowStates { nodes { id name team { id } } } }"
SET_STATE = "mutation($id: String!, $stateId: String!) { issueUpdate(id: $id, input: {stateId: $stateId}) { success } }"
ADD_COMMENT = "mutation($issueId: String!, $body: String!) { commentCreate(input: {issueId: $issueId, body: $body}) { success } }"
KNOWN = """query($filter: IssueFilter) {
  issues(first: 100, filter: $filter, includeArchived: true) { nodes { id identifier archivedAt team { id } assignee { isMe } } }
}"""


@dataclass(frozen=True)
class Team(Loaded):
    id: str = ""
    key: str = ""
    name: str = ""


@dataclass(frozen=True)
class Teams(Loaded):
    nodes: tuple[Team, ...] = ()


@dataclass(frozen=True)
class Person(Loaded):
    aliases: ClassVar[dict] = {"is_me": ("isMe",)}
    name: str = ""
    is_me: bool = False


@dataclass(frozen=True)
class Reference(Loaded):
    id: str = ""


@dataclass(frozen=True)
class Comment(Loaded):
    id: str = ""
    body: str = ""
    user: Person = field(default_factory=Person)


@dataclass(frozen=True)
class Comments(Loaded):
    nodes: tuple[Comment, ...] = ()


@dataclass(frozen=True)
class Issue(Loaded):
    aliases: ClassVar[dict] = {"updated": ("updatedAt",), "archived": ("archivedAt",)}
    id: str = ""
    identifier: str = ""
    title: str = ""
    description: str = ""
    url: str = ""
    updated: str = ""
    archived: str = ""
    state: Reference = field(default_factory=Reference)
    team: Reference = field(default_factory=Reference)
    creator: Person = field(default_factory=Person)
    assignee: Person = field(default_factory=Person)
    comments: Comments = field(default_factory=Comments)


@dataclass(frozen=True)
class WorkflowState(Loaded):
    id: str = ""
    name: str = ""
    team: Reference = field(default_factory=Reference)


@dataclass(frozen=True)
class WorkflowStates(Loaded):
    nodes: tuple[WorkflowState, ...] = ()


@dataclass(frozen=True)
class Paging(Loaded):
    aliases: ClassVar[dict] = {"more": ("hasNextPage",), "after": ("endCursor",)}
    more: bool = False
    after: str = ""


@dataclass(frozen=True)
class Issues(Loaded):
    aliases: ClassVar[dict] = {"paging": ("pageInfo",)}
    nodes: tuple[Issue, ...] = ()
    paging: Paging = field(default_factory=Paging)


@dataclass(frozen=True)
class Data(Loaded):
    aliases: ClassVar[dict] = {"workflow": ("workflowStates",)}
    teams: Teams = field(default_factory=Teams)
    workflow: WorkflowStates = field(default_factory=WorkflowStates)
    issues: Issues = field(default_factory=Issues)


@dataclass(frozen=True)
class Failure(Loaded):
    message: str = ""


@dataclass(frozen=True)
class Reply(Loaded):
    data: Data = field(default_factory=Data)
    errors: tuple[Failure, ...] = ()


def reply_of(text: str) -> Reply:
    """What Linear answered, read into typed values; an answer that is not JSON or that carries errors is refused."""
    try:
        raw = json.loads(text)
    except ValueError as error:
        raise Refused("Linear answered something that is not JSON") from error
    reply = Reply.from_json(raw)
    if reply.errors:
        raise Refused(f"Linear refused the request: {reply.errors[0].message[:200]}")
    return reply

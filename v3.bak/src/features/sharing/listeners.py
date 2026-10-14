import json
import re
from typing import TypedDict

from engine.journal_calls import calls
from resources.sharing import INDEX, SHORTEST_SNIPPET
from events import Fact
from events.agents import CommandRan
from events.comments import CommentCreated
from events.visitors import TrustedVisitorCommented, VisitorCommented, VisitorCommentRead
from features.sharing.guard import only_agree
from receiving import Listener
from resources.types import AgentRow, Comment
from serving import ReadRemembered, ReadRows


class SpotVisitorCommentRead(Listener[CommandRan]):
    def listen(self, event: CommandRan, remembered: ReadRemembered) -> list[Fact]:
        read = [] if only_agree(event.command) else read_now(remembered.get(INDEX, []), event.command, event.output)
        return [VisitorCommentRead(agent=event.agent, comments=tuple(read))] if read else []


class SpotVisitorComment(Listener[CommentCreated]):
    def listen(self, event: CommentCreated, comments: ReadRows[Comment], agents: ReadRows[AgentRow]) -> list[Fact]:
        comment, agent = comments.peek(event.n), agents.primary_to_read()
        if not comment.data.get("visitor") or not agent:
            return []
        kind = TrustedVisitorCommented if comment.data.get("trusted") else VisitorCommented
        return [kind(agent=agent.n, comment=comment.n, name=comment.data["visitor"], about=comment.refs[0].replace(":", " "))]


READERS = re.compile(r"(?:^|[\s;&|(])(?:cat|less|more|head|tail|sed|awk|grep|rg|bat|nl|strings|xxd|od|cut|sort|uniq|python3?|jq)\b")


class Visit(TypedDict):
    n: int
    snippet: str
    path: str


def shown(entry: Visit, command: str, output: str) -> bool:
    snippet = entry["snippet"]
    if len(snippet) >= SHORTEST_SNIPPET and (snippet in output or json.dumps(snippet)[1:-1] in output):
        return True
    if any(call.matches("comment", "read", "show") and call.arguments[:1] == (str(entry["n"]),) for call in calls(command)):
        return True
    return entry["path"] in command and READERS.search(command) is not None


def read_now(index: list[Visit], command: str, output: str) -> list[int]:
    return sorted({entry["n"] for entry in index if shown(entry, command, output)})

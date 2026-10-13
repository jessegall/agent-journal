from controllers.sharing.visitors import INDEX, read_now
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

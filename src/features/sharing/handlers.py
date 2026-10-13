from resources.sharing import hold
from events import Fact
from events.visitors import TrustedVisitorCommented, VisitorCommented, VisitorCommentRead
from receiving import Handler
from resources.types import AgentRow
from serving import Chat, Rows


class HoldUntilAgreed(Handler[VisitorCommentRead]):
    def handle(self, event: VisitorCommentRead, agents: Rows[AgentRow]) -> list[Fact]:
        hold(agents, agents.load(event.agent), event.comments)
        return []


class NameVisitorComment(Handler[VisitorCommented]):
    def handle(self, event: VisitorCommented, chat: Chat) -> list[Fact]:
        chat.nudge("commented", name=event.name, about=event.about, n=event.comment)
        return []


class NameTrustedVisitorComment(Handler[TrustedVisitorCommented]):
    def handle(self, event: TrustedVisitorCommented, chat: Chat) -> list[Fact]:
        chat.nudge("trusted", name=event.name, about=event.about, n=event.comment)
        return []

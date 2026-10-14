from events import Fact
from events.pull_requests import PullRequestEnded, PullRequestOpened
from features.pull_requests.details import OPEN
from receiving import Handler
from resources.types import Notice
from serving import Chat, Rows


class PinThePullRequest(Handler[PullRequestOpened]):
    def handle(self, event: PullRequestOpened, chat: Chat) -> list[Fact]:
        chat.notice(OPEN, number=event.number, link=event.url, label="Open the pull request", pull=event.number, tone="note")
        return []


class TakeThePinAway(Handler[PullRequestEnded]):
    def handle(self, event: PullRequestEnded, notices: Rows[Notice]) -> list[Fact]:
        notices.complete(event.notice, how=event.how)
        return []

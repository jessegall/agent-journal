from events import Fact
from events.agents import ClockTicked
from events.integrations import ReplyApproved
from receiving import Handler
from serving import OwnWork


class CheckOnClock(Handler[ClockTicked]):
    def handle(self, event: ClockTicked, work: OwnWork) -> list[Fact]:
        work.ticked()
        return []


class SendApprovedReply(Handler[ReplyApproved]):
    def handle(self, event: ReplyApproved, work: OwnWork) -> list[Fact]:
        work.send_reply(event.ticket, event.text)
        return []

from events import Fact
from events.agents import ClockTicked
from events.integrations import ReplyApproved
from receiving import Handler
from serving import OwnWork


class CheckOnClock(Handler[ClockTicked]):
    def handle(self, event: ClockTicked, work: OwnWork) -> list[Fact]:
        work.ticked()
        return []


def sending_approved(approved: type[ReplyApproved]) -> Handler:
    """The handler of one service's approved reply, since a handler receives the one fact class it is registered on."""

    class SendApprovedReply(Handler[approved]):
        def handle(self, event: approved, work: OwnWork) -> list[Fact]:
            work.send_reply(event.ticket, event.text)
            return []

    SendApprovedReply.__name__ = SendApprovedReply.__qualname__ = f"Send{approved.__name__}"
    return SendApprovedReply()

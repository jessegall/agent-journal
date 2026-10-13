from events import Fact
from events.integrations import CheckDue, ReplyApproved
from receiving import Handler
from serving import OwnWork


def checking_when_due(due: type[CheckDue]) -> Handler:
    """The handler of one service's due check, since a handler receives the one fact class it is registered on."""

    class CheckWhenDue(Handler[due]):
        def handle(self, event: due, work: OwnWork) -> list[Fact]:
            work.ticked()
            return []

    CheckWhenDue.__name__ = CheckWhenDue.__qualname__ = f"Check{due.__name__}"
    return CheckWhenDue()


def sending_approved(approved: type[ReplyApproved]) -> Handler:
    """The handler of one service's approved reply, since a handler receives the one fact class it is registered on."""

    class SendApprovedReply(Handler[approved]):
        def handle(self, event: approved, work: OwnWork) -> list[Fact]:
            work.send_reply(event.ticket, event.text)
            return []

    SendApprovedReply.__name__ = SendApprovedReply.__qualname__ = f"Send{approved.__name__}"
    return SendApprovedReply()

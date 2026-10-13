from events import Fact
from events.integrations import LinearStageMoved
from receiving import Handler
from serving import OwnWork


class MoveIssue(Handler[LinearStageMoved]):
    def handle(self, event: LinearStageMoved, work: OwnWork) -> list[Fact]:
        work.move_issue(event.ticket)
        return []

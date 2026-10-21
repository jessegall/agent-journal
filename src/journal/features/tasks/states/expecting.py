from dataclasses import dataclass, replace

from journal.engine.states.wait import Wait
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.ticked import Ticked
from journal.events.rows.row_settled import RowSettled

MEANWHILE_AFTER = 60.0
LOOK_EVERY = 300.0


@dataclass(frozen=True)
class Expecting(Wait):
    """The agent waits for something outside its hands, named in words, and on the rows that end it, table:id each: the wait is over by itself once every one of them has settled, and the agent is told what each outcomes to. Stopping is quiet; its own next tool use is working again and pops it. In auto mode the next open task is named once after a minute, and every five quiet minutes the agent is asked to look at what it waits for."""

    name = "expecting"
    title = "Waiting"
    what: str = ""
    ends_on: str = ""
    since: float = 0.0
    reminded_at: float = 0.0
    meanwhile_said: bool = False
    outcomes: str = ""

    def awaiting(self) -> tuple[str, str]:
        return self.what, self.ends_on

    def waits_on(self) -> list[str]:
        return [ref for ref in self.ends_on.split(",") if ref]

    def on_ticked(self, event: Ticked, settings: Settings) -> Transition:
        from journal.features.tasks.feature import Tasks
        next_open = event.snapshot.of(Tasks).next_open
        if settings.of(Tasks.AUTO) and not self.meanwhile_said and event.at - self.since >= MEANWHILE_AFTER and next_open is not None:
            return self.changed(replace(self, meanwhile_said=True), Tasks.NEXT_TASK_MEANWHILE.create(what=self.what, n=next_open.id, title=next_open.title))
        if event.at - max(self.since, self.reminded_at) >= LOOK_EVERY:
            return self.changed(replace(self, reminded_at=event.at), Tasks.CHECK_WHAT_YOU_AWAITED.create(what=self.what, minutes=int((event.at - self.since) // 60)))
        return self.unchanged()

    def on_row_settled(self, event: RowSettled, settings: Settings) -> Transition:
        from journal.features.tasks.feature import Tasks
        if event.ref not in self.waits_on():
            return self.unchanged()
        left = [ref for ref in self.waits_on() if ref != event.ref]
        outcomes = "; ".join(part for part in (self.outcomes, event.outcome) if part)
        if left:
            return self.changed(replace(self, ends_on=",".join(left), outcomes=outcomes))
        return self.pop(Tasks.WAIT_OVER.create(what=self.what, outcome=outcomes))

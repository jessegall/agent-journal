from dataclasses import dataclass

from journal.engine.states.paused import Paused


@dataclass(frozen=True)
class Expecting(Paused):
    """The agent waits for something outside its hands, named in words, and on the rows that end it, kind:N each: the wait is over by itself once all of them have settled. Stopping is quiet; its own next tool use is working again and takes it back, through the workflow Expecting; every five quiet minutes it is asked to look."""

    name = "expecting"
    title = "Waiting"
    what: str = ""
    ends_on: str = ""
    """The rows that end the wait, kind:N, comma-separated; none for a wait a workflow started."""

    def awaiting(self) -> tuple[str, str]:
        return self.what, self.ends_on

    def waits_on(self) -> list[str]:
        return [name for name in self.ends_on.split(",") if name]



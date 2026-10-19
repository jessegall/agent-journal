from dataclasses import dataclass

from journal.engine.states.paused import Paused



@dataclass(frozen=True)
class Expecting(Paused):
    """The agent waits for something outside its hands, named in words. Stopping is quiet; its own next tool use is working again and takes it back, through the workflow Expecting; every five quiet minutes it is asked to look."""

    name = "expecting"
    title = "Waiting"
    what: str = ""

    def awaiting(self) -> tuple[str, str]:
        return self.what, ""



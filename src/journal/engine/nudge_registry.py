from journal.engine.nudge import Nudge
from journal.support.rejection import Rejection


class NudgeRegistry:
    """The one place a nudge is made: a feature hands it the words at boot and gets the nudge's id back, a state answers with the id, and the nudger says only an id the registry holds, so the list is where every line of the journal is found."""

    def __init__(self) -> None:
        self.nudges: dict[str, Nudge] = {}

    def register(self, nudge: Nudge) -> str:
        self.nudges[nudge.key] = nudge
        return nudge.key

    def named(self, nudge_id: str) -> Nudge:
        if nudge_id not in self.nudges:
            raise Rejection(f"no nudge is registered as {nudge_id}: a line is said only by a nudge the registry holds, journal nudge list names them")
        return self.nudges[nudge_id]

    def all(self) -> list[Nudge]:
        return sorted(self.nudges.values(), key=lambda nudge: nudge.key)

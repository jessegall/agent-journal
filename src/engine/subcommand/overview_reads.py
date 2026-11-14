from engine.actor.actor import Actor


class OverviewReads:
    """The overviews an agent read in its context window: the check of a read before it runs and the note of it
    after it printed; with no module keeping reads, every read passes."""

    def check(self, actor: Actor, command_name: str, target: str, is_required: bool) -> None:
        return None

    def note(self, actor: Actor, command_name: str, target: str) -> None:
        return None

from journal.features.chart.context import Context
from journal.features.chart.fillers import Fillers
from journal.events.decision import Decision


class DryActions:
    """The actions as a dry run performs them: nothing is said, held, typed or started; each tells what it would do."""

    def __init__(self, fillers: Fillers, ledger: dict | None = None) -> None:
        self.fillers, self.ledger = fillers, {} if ledger is None else ledger

    def perform(self, key: str, text: str, ctx: Context) -> Decision:
        from journal.features.chart.actions import NAMED
        if key == "stop_here":
            return Decision.tell("would run no later workflows of the event")
        if key in ("count_start", "count_one"):
            self.count(key, ctx.counted(text.strip()))
        named = NAMED.match(text)
        words = named.group(2) if named else text
        return Decision.tell(f"would {key.replace('_', ' ')}{f' as {named.group(1)}' if named else ''}: {self.fillers.fill(words, ctx)}")

    def count(self, key: str, name: str) -> None:
        """A dry count: a start sets the name at nought, a count one adds one, so a check after it reads what the live walk would."""
        kind, value = self.ledger.get(name, ("add", 0))
        self.ledger[name] = ("set", 0) if key == "count_start" else (kind, value + 1)

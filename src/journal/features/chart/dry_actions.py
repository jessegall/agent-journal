from journal.features.chart.context import Context
from journal.features.chart.fillers import Fillers
from journal.hooks.decision import Decision


class DryActions:
    """The actions as a dry run performs them: nothing is said, held, typed or started; each tells what it would do."""

    def __init__(self, fillers: Fillers) -> None:
        self.fillers = fillers

    def perform(self, key: str, text: str, ctx: Context) -> Decision:
        from journal.features.chart.actions import NAMED
        if key == "stop_here":
            return Decision.tell("would stop here: no later workflow of the event runs")
        named = NAMED.match(text)
        words = named.group(2) if named else text
        return Decision.tell(f"would {key.replace('_', ' ')}{f' as {named.group(1)}' if named else ''}: {self.fillers.fill(words, ctx)}")

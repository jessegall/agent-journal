from journal.features.chart.context import Context
from journal.features.chart.fillers import Fillers
from journal.hooks.decision import Decision


class DryActions:
    """The actions as a dry run performs them: nothing is said, held, typed or started; each tells what it would do."""

    def __init__(self, fillers: Fillers) -> None:
        self.fillers = fillers

    def perform(self, key: str, text: str, ctx: Context) -> Decision:
        return Decision.tell(f"would {key.replace('_', ' ')}: {self.fillers.fill(text, ctx)}")

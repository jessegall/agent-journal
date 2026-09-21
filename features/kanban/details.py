from features.base import FeatureDetails
from features.settings import Setting


class KanbanDetails(FeatureDetails):
    name = "kanban"

    title = "Kanban board"

    abstract = "The to-dos of an environment as lanes of cards, moved by drag or by journal todo shift"

    help = """
        Every open to-do is a card in one of five lanes, worked out from its state and never
        stored: To do, Held (blocked, waiting on another row, or held by its plan), Doing (work
        is open on it), Needs you (a question waits on it) and Done (closed in the last
        kanban.done_days days).

        journal todo board [--plan n] [--agent id] prints the board. journal todo shift <n>
        <lane> [--why] [--how] moves a card through the same actions the rest of the journal
        uses: blocking, unblocking, closing and reopening a to-do.
    """

    settings = [
        Setting(
            name="done_days",
            default=7,
            title="Show done cards for",
            abstract="A done card stays on the board this many days after it closed",
            unit="days",
        ),
    ]

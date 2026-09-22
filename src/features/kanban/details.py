from features.base import FeatureDetails
from features.settings import Setting


class KanbanDetails(FeatureDetails):
    name = "kanban"
    when = "to-dos are moved between lanes or the board is read"

    title = "Kanban board"

    abstract = "The to-dos of an environment as lanes of cards, moved by drag or by journal todo shift"

    help = """
        To see the to-dos as lanes, run journal todo board [--plan n] [--agent id]. To move a card, run journal todo shift <n>
        <lane> [--why "<why>"] [--how "<how>"]: it goes through the same actions the rest of the journal uses (blocking,
        unblocking, closing, reopening, and starting a to-do dropped on Doing, through the same gate as journal todo start).

        Every open to-do is a card in one of five lanes, worked out from its state and never stored: To do, Held (blocked,
        waiting on another row, or held by its plan), Doing (work is open on it), Needs you (a question waits on it) and Done
        (closed in the last kanban.done_days days). The Board page in the viewer shows the lanes side by side; the user drags
        cards between them or moves them from a card's menu.
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

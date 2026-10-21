from journal.features.delivery.listeners.confirm_read import ConfirmRead
from journal.features.delivery.listeners.confirm_typed import ConfirmTyped
from journal.features.delivery.listeners.line_batch_release import LineBatchRelease
from journal.features.delivery.listeners.line_retyping import LineRetyping
from journal.features.feature import Feature
from journal.support.option import Option
from journal.support.typed_lines import BATCH_SECONDS


class Delivery(Feature):
    name = "delivery"
    title = "Delivery"
    help = "A line the journal types is confirmed by the prompt that brings it back; one that has not come back while the agent sits between turns is typed again, six times at most, and the chat says so. Lines go at most once a window, the rest held and typed as one."
    BATCH_SECONDS = Option("delivery.batch_seconds", "Type lines at most every", "Seconds after a line is typed before the next may go; lines that come meanwhile are held and typed together as one line. 0 types each at once", BATCH_SECONDS, unit="seconds")
    options = (BATCH_SECONDS,)
    listeners = (ConfirmTyped, ConfirmRead, LineRetyping, LineBatchRelease)

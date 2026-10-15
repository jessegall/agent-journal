from journal.features.feature import Feature
from journal.features.option import Option


class Avatar(Feature):
    """The figure in the chat, which the viewer draws; the journal keeps only its switch and when it is shown."""

    name = "avatar"
    title = "Show a figure in the chat"
    help = "A small figure beside the chat shows what the agent is doing, in the voice it speaks."
    SHOWN = Option("avatar.shown", "Show it", "Always, only while the agent works, or never", "always", kind="choice", choices=("always", "working", "never"))
    options = (SHOWN,)

from journal.features.feature import Feature
from journal.features.thinking.listeners.clear_thought import ClearThought
from journal.features.thinking.listeners.keep_thought import KeepThought
from journal.features.thinking.listeners.reply_from_thought import ReplyFromThought


class Thinking(Feature):
    name = "thinking"
    title = "Thinking"
    help = "The agent's latest thought stands in the working bubble while it works, each replacing the last; a visible message clears it. A reply the agent wrote in its thinking, which the user would never see, is posted as the reply."
    listeners = (KeepThought, ReplyFromThought, ClearThought)

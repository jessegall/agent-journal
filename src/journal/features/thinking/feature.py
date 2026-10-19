from journal.features.feature import Feature
from journal.features.thinking.listeners.keep_thought import KeepThought
from journal.features.thinking.listeners.reply_from_thought import ReplyFromThought


class Thinking(Feature):
    name = "thinking"
    title = "Thinking"
    help = "Each of the agent's thoughts is kept as a message in the chat, marked a thought, which the chat's Shown menu can hide; the latest stands in the working bubble until the agent says something. A reply the agent wrote in its thinking, which the user would never see, is posted as the reply."
    listeners = (KeepThought, ReplyFromThought)

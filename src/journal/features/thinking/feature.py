from journal.features.feature import Feature
from journal.features.thinking.listeners.thought_record import ThoughtRecord
from journal.features.thinking.listeners.thought_reply import ThoughtReply


class Thinking(Feature):
    name = "thinking"
    title = "Thinking"
    help = "Each of the agent's thoughts is kept as a message in the chat, marked a thought, which the chat's Shown menu can hide; the latest stands in the working bubble until the agent says something. A reply the agent wrote in its thinking, which the user would never see, is posted as the reply."
    listeners = (ThoughtRecord, ThoughtReply)

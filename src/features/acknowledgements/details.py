from features.base import FeatureDetails, Line
from features.groups import Group

KEPT_OUT = "kept out"


class AcknowledgementsDetails(FeatureDetails):
    explains = "The agent's replies to the journal's own lines are hidden from the chat when they change nothing. You can show them from the Shown menu."
    name = "acknowledgements"
    group = Group.CHAT
    label = "Hide replies to the journal's own lines"
    hint = "The chat's Shown menu brings them back"
    has_skill = False

    title = "Hide replies to journal lines"

    abstract = "Agent replies to a journal line that change nothing are left out of the chat. The chat's Shown menu brings them back."

    help = """
        When the journal hands the agent a line and the agent answers it without changing
        anything, such as Noted or a remark about what the line meant, that answer is kept as a
        message but left out of the chat. Turn on Acknowledgements under the chat's Shown menu to
        see them.

        It never hides an answer to a message from you, a question, a comment, a failure, a turn
        that changed files, a reply that asks you something, or a line that asks the agent about
        a stall, a block or a decision; those always reach the chat.
    """

    lines = [
        Line(
            name=KEPT_OUT,
            title="your answer to a journal line was kept out of the chat",
            brief="a journal line is an instruction, not a message: act on it and write nothing, unless the user needs to know something such as a failure, finished work or a decision that waits on them",
        ),
    ]

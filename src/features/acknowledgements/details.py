from features.base import FeatureDetails
from features.groups import Group


class AcknowledgementsDetails(FeatureDetails):
    name = "acknowledgements"
    group = Group.CHAT
    label = "Hide turns that only acknowledge"
    hint = "The chat's Shown menu brings them back"
    has_skill = False

    title = "Hidden acknowledgements"

    abstract = "A turn that only acknowledges a journal line stays out of the chat; the chat's Shown menu brings them back"

    help = """
        When the journal hands the agent a line and the agent's whole answer is an
        acknowledgement, such as Noted or Carrying on, that answer is kept as a message but
        left out of the chat. Turn on Acknowledgements under the chat's Shown menu to see them.

        It never hides an answer to a message from you, a question, a comment, a failure, or a
        line that asks the agent about a stall, a block or a decision; those always reach the chat.
    """

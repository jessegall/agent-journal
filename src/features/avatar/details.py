from declaring.details import FeatureDetails
from declaring.groups import Group
from resources.base import PROJECT


class AvatarDetails(FeatureDetails):
    explains = "The chat shows a small figure of the voice you chose, which moves with what the agent is doing. It is off until you switch it on."
    name = "avatar"
    group = Group.CHAT
    scope = PROJECT
    label = "Show a figure in the chat"
    has_skill = False
    default = False

    title = "Avatar"

    abstract = "A small figure of your voice sits in the chat and moves with what the agent is doing; off, nothing is drawn."

    help = """
        The figure of the voice you chose sits in the chat and moves with what the agent is doing.
        The voice itself is chosen on the Voice page; this switch only decides whether its figure is drawn.
    """

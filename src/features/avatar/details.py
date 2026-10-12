from declaring.details import FeatureDetails
from declaring.groups import Group


class AvatarDetails(FeatureDetails):
    explains = "The chat can show the voice's figure standing in the room. It is off until you switch it on."
    name = "avatar"
    group = Group.CHAT
    label = "Show the voice's figure"
    has_skill = False
    default = False

    title = "Avatar"

    abstract = "The voice stands in the room and animates what the agent is doing; off, nothing is drawn and nothing animates"

    help = """
        The figure of the voice you chose stands in the chat and moves with what the agent is doing.
        The voice itself is chosen on the Voice page; this switch only decides whether its figure is drawn.
    """

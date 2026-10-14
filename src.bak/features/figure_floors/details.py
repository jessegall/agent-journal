from declaring.details import FeatureDetails
from declaring.groups import Group
from resources.base import PROJECT


class FigureFloorsDetails(FeatureDetails):
    explains = "Draws every floor the chat's figure stands on as a labelled line over the chat, for working on how it moves."
    name = "figure_floors"
    group = Group.DEVELOPER
    scope = PROJECT
    label = "Draw the floors the avatar stands on"
    has_skill = False
    default = False

    title = "Avatar floors"

    abstract = "A line over each floor the figure can stand on, labelled with what it is: the docked bars, the compose box, a bubble, a tab"

    help = """
        The chat's figure lives on floors the journal reads from the chat every frame: the bars docked over the compose box,
        the compose box itself, the tops of the bubbles in view, the page's tabs, and the foot of the chat. Switched on, each
        floor is drawn as an outlined line labelled with its kind, so you can see what the figure stands on and falls to.
    """

from features.base import FeatureDetails
from features.groups import Group


class OpenViewerDetails(FeatureDetails):
    explains = 'The viewer opens when the agent starts, or its existing tab comes forward. You can turn this off in Settings.'
    name = "open_viewer"
    group = Group.ALWAYS
    label = "Open the viewer at launch"
    hint = "Or bring its open tab to the front"
    has_skill = False

    title = "Open the viewer at launch"

    aliases = ("tabfocus",)

    abstract = "When the agent starts, the viewer opens in your browser, or its open tab comes to the front."

    help = """
        Always on: the tab opens when the session starts, after any startup or resume menu is
        answered; macOS focuses a matching tab in a running browser; other systems and missing
        tabs use the normal browser opener.
    """

    fixed = True

from features.base import FeatureDetails


class TabFocusDetails(FeatureDetails):
    name = "open_viewer"
    has_skill = False

    title = "Open the viewer at start"

    aliases = ("tabfocus",)

    abstract = """
        A journal launch shows its viewer tab once the agent's session has started, focusing an
        existing tab instead of opening another
    """

    help = """
        Always on: the tab opens when the session starts, after any startup or resume menu is
        answered; macOS focuses a matching tab in a running browser; other systems and missing
        tabs use the normal browser opener.
    """

    fixed = True

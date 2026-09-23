from features.base import FeatureDetails, Line

UNPINNED = "unpinned"


class PinnedLinksDetails(FeatureDetails):
    name = "pinned_links"
    when = "you point the user at a design, a page or anything else outside the journal"

    title = "Pinned links"

    abstract = "A link the agent gives the user in the chat is pinned over the chat, so it is not lost as the chat scrolls"

    help = """
        Whenever you point the user at something outside the journal - a design, a hosted page,
        a document, any link they will come back to - pin it over the chat with
        journal notice create "<what it is>" --set link="<url>" --set label="<Open the design>" --set tone=note,
        as pull requests are pinned by themselves. A link in your chat text that no pin carries
        earns one reminder per link with the command to pin it. The user closes a pin when they
        are done with it.
    """

    lines = [
        Line(
            name=UNPINNED,
            title="a link you gave in the chat is not pinned; if the user will come back to it, pin it",
            brief='{{url}} - journal notice create "<what it is>" --set link="{{url}}" --set label="<Open ...>" --set tone=note',
        ),
    ]

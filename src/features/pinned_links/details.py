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

        The same goes for what a subagent makes: when you dispatch one to produce something the
        user will open - a design, a prototype, a report, a page - tell it in the dispatch to end
        its report with the link or the row, and pin that as soon as it reports, before you say
        anything else about its work. Work a subagent builds straight into the viewer has no link
        of its own: pin it anyway, with the viewer address of the page it changed, so the user can
        open and review it.

        A subagent that is lent an environment pins its own links the same way, with journal --env
        <name> --agent <its id> notice create: they show over its chat in the inspector, beside the
        links it wrote, and stay out of the main chat's pins.
    """

    lines = [
        Line(
            name=UNPINNED,
            title="a link you gave in the chat is not pinned; if the user will come back to it, pin it",
            brief='{{url}} - journal notice create "<what it is>" --set link="{{url}}" --set label="<Open ...>" --set tone=note',
        ),
    ]

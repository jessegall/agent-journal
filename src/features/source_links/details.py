from features.base import FeatureDetails, Line
from features.settings import Setting


class TrackingDetails(FeatureDetails):
    name = "source_links"

    title = "Source links"

    abstract = "A plan, doc or report that cites nothing it was built on is named back to the agent"

    help = """
        A plan, doc or report created soon after you read a report or doc, and citing none
        of them, earns a private nudge naming the link to make.
    """

    aliases = ("became", "tracking")

    settings = [
        Setting(
            name="within",
            default=30,
            title="Count what was read in the last",
            abstract="A report or doc read this recently is one the new row could have been built on",
            unit="minutes",
        ),
    ]

    lines = [
        Line(
            name="uncited",
            title="{{type}} {{n}} cites nothing it was built on",
            brief='you read {{read}} just now: journal {{type}} link {{n}} "<ref>" for whichever it came from',
        ),
    ]

from features.base import FeatureDetails, Line
from features.settings import Setting
from features.groups import Group


class SourceLinksDetails(FeatureDetails):
    name = "source_links"
    group = Group.RECORDS
    label = "Ask for source links"
    hint = "On new plans, documents and reports"
    has_skill = False

    title = "Source links"

    abstract = "If you create a plan, doc or report without linking what you read to build it, the agent is told which link to add"

    help = """
        A plan, doc or report created soon after you read a report or doc, and citing none
        of them, earns a private nudge naming the link to make.
    """

    aliases = ("became", "tracking")

    settings = [
        Setting(
            name="within",
            default=30,
            title="Count what the agent read in the last",
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

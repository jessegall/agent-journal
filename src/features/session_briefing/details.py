from features.base import FeatureDetails, Line
from features.groups import Group


class SessionBriefingDetails(FeatureDetails):
    name = "session_briefing"
    group = Group.AGENT
    label = "Brief each new session"
    has_skill = False

    title = "Brief each new session"

    aliases = ("start",)

    abstract = "Each new session is handed a summary of the journal, kept up to date as anything in it changes."

    help = """
        The hook hands the file over at SessionStart; nothing is computed inside the hook.

        The first time a session starts, the journal types a line into your terminal,
        never the channel, asking it to say something in the chat so the journal's messages
        reach it.
    """

    lines = [
        Line(
            name="ready",
            title="the journal is ready on {{env}}",
            brief="say hello in the chat in plain words, so the journal's messages reach you",
        ),
    ]

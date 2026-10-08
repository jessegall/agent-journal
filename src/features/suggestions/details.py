from features.base import FeatureDetails
from features.groups import Group
from features.settings import Setting


class SuggestionsDetails(FeatureDetails):
    explains = 'The agent can make a suggestion for later work. You can accept, change, or decline it.'
    name = "suggestions"
    group = Group.RECORDS
    label = "Turn accepted suggestions into to-dos"
    when = "you would propose a change nobody asked for"

    title = "Suggestions"

    settings = [
        Setting(
            name="window_after",
            default=3,
            title="Open an unanswered suggestion in a window after",
            abstract="Each suggestion opens only once. Set 0 to never open it.",
            unit="hours",
        ),
        Setting(
            name="start_grace",
            default=10,
            title="Wait after the journal starts before opening one",
            abstract="Applies to a suggestion whose hours ran out before the start, or while the journal was off.",
            unit="minutes",
        ),
    ]

    abstract = "An accepted or adjusted suggestion becomes a to-do that cites it; a decline files nothing"

    help = """
        When you see a change worth making that nobody asked for, do not mention it in your reply: file it with
        journal suggestion suggest "<the change>" --brief "<what you saw, what it costs now and later>". Nothing waits on it.

        It shows in the chat as a card, and one still unanswered after suggestions.window_after hours opens once in a
        window, but only suggestions.start_grace minutes after the journal started. The user accepts, adjusts or declines it in the viewer. An accept or an adjust files a to-do that carries the
        suggestion's title and brief, or the user's own words when adjusted, and auto mode works it like any other. A decline
        is a ruling: never propose the same change again in other words. If something has changed since, say so with
        --set despite=true --set because="<what changed>". At most five wait at a time; withdraw one that stopped being true
        with journal suggestion withdraw <n> --why "<why>".
    """

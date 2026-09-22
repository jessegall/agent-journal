from features.base import FeatureDetails


class SuggestionsDetails(FeatureDetails):
    name = "suggestions"
    when = "you would propose a change nobody asked for"

    title = "Suggestions"


    abstract = "An accepted or adjusted suggestion becomes a to-do that cites it; a decline files nothing"

    help = """
        When you see a change worth making that nobody asked for, do not mention it in your reply: file it with
        journal suggestion suggest "<the change>" --brief "<what you saw, what it costs now and later>". Nothing waits on it.

        The user accepts, adjusts or declines it in the viewer. An accept or an adjust files a to-do that carries the
        suggestion's title and brief, or the user's own words when adjusted, and auto mode works it like any other. A decline
        is a ruling: never propose the same change again in other words. If something has changed since, say so with
        --set despite=true --set because="<what changed>". At most five wait at a time; withdraw one that stopped being true
        with journal suggestion withdraw <n> --why "<why>".
    """

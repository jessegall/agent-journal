from features.base import FeatureDetails


class BrowserDetails(FeatureDetails):
    name = "browser"

    title = "Driving the user's tab"

    abstract = "The agent asks the tab the user is driving for a picture, its text or a click, and the extension answers"

    help = """
        The user turns driving on with the wheel in the chat window's bar; journal browser ask
        shot|url|text|dom|console|click|type|goto|eval|scroll waits up to 30 seconds for the
        answer.
    """

    fixed = True

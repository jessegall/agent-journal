from features.base import FeatureDetails


class BrowserDetails(FeatureDetails):
    name = "browser_control"
    when = "you need to see or act in the tab the user is driving"

    title = "Controlling your browser tab"

    aliases = ("browser",)

    speaks_while_waiting = True

    abstract = "The agent asks the tab the user is driving for a picture, its text or a click, and the extension answers"

    help = """
        The user turns driving on with the wheel in the chat window's bar; journal browser ask
        shot|url|text|dom|console|click|type|goto|eval|scroll waits up to 30 seconds for the
        answer.
    """

    fixed = True

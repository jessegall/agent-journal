from features.base import FeatureDetails
from features.groups import Group


class BrowserControlDetails(FeatureDetails):
    name = "browser_control"
    group = Group.ALWAYS
    label = "Let the agent use your browser tab"
    when = "you need to see or act in the tab the user is driving"

    title = "Browser tab control"

    aliases = ("browser",)

    speaks_while_waiting = True

    abstract = "The agent can ask the browser tab you are using for a screenshot, its text or a click. The Chrome extension carries it out."

    help = """
        When you need to see or act in the tab the user is driving, ask it: journal browser ask shot for a picture, ask text,
        ask url, ask dom or ask console to read it, ask click "<selector>", ask type "<selector>" "<words>", ask goto <url>,
        ask eval "<js>" or ask scroll top|bottom|<selector> to act. Each waits up to 30 seconds for the extension's answer.

        It works only while the user drives a tab, which they turn on with the wheel in the chat window's bar; otherwise the
        ask is refused and says so.
    """

    fixed = True

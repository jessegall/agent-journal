from features.base import FeatureDetails
from features.settings import Setting
from features.groups import Group

NAME = "critique"


class CritiqueDetails(FeatureDetails):
    explains = 'The agent can ask reviewers to examine a design from different angles. You can read their findings in one report.'
    name = NAME
    group = Group.DEVELOPER
    label = "Run design critique rounds"
    skill_of = "reports"
    when = "a new design needs its critique round, or the designer revised it and the critics should look again"

    title = "Run design critique rounds"

    abstract = """
        One command sends critics through the app, each with a lens of their own, and gathers what
        they find into one report for the designer
    """

    help = """
        journal critique round "<what changed>" [--critics 3] [--lenses first-time,native,words]
        [--model sonnet] starts a round on the app at the critique.app setting: it runs the
        project's critique.seed command first when one is set, refuses when the app does not
        answer, and writes the round's page (how to open the app logged in, with the login at
        critique.login and Playwright from critique.browsers) and one brief per lens. Critics only
        look, so dispatch one read-only subagent per lens with its brief; as each answers, put its
        findings in the round's report with journal report section, then hand that report to the
        designer, who decides. journal critique recheck <n> "<what was revised>" says how to send
        the same critics back; journal critique finish <n> closes the round. The lenses:
        first-time, access, native, words, edges.
    """

    settings = [
        Setting(name="app", default="", title="Address of the app the critics open"),
        Setting(name="login", default="", title="Login file the critics' browser starts with"),
        Setting(name="seed", default="", title="Command that loads the demo data"),
        Setting(name="browsers", default="", title="Folder with Playwright installed"),
    ]


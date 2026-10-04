from features.base import FeatureDetails
from features.settings import Setting

NAME = "critique"


class CritiqueDetails(FeatureDetails):
    name = NAME
    skill_of = "reports"
    when = "a new design needs its critique round, or the designer revised it and the critics should look again"

    title = "Critique rounds"

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
        Setting(name="app", default="", title="The address the critics open, such as the phone app of a demo journal"),
        Setting(name="login", default="", title="A browser storage file the critics start logged in with"),
        Setting(name="seed", default="", title="The project's own command that puts demo data in place before a round"),
        Setting(name="browsers", default="", title="A folder with Playwright installed, for the critics' browsers"),
    ]


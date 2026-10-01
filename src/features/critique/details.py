from features.base import FeatureDetails, Line
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
        [--provider claude --model sonnet] starts a round on the app at the critique.app setting:
        it runs the project's critique.seed command first when one is set, refuses when the app
        does not answer, and sends one helper per lens with the house brief and the round's page
        (how to open the app logged in, with the login at critique.login and Playwright from
        critique.browsers). Each critic's report becomes a part of the round's report, and you are
        told once all are in; hand that report to the designer, who decides. journal critique
        recheck <n> "<what was revised>" sends the same critics back; journal critique finish <n>
        stops them. The lenses: first-time, access, native, words, edges.
    """

    settings = [
        Setting(name="app", default="", title="The address the critics open, such as the phone app of a demo journal"),
        Setting(name="login", default="", title="A browser storage file the critics start logged in with"),
        Setting(name="seed", default="", title="The project's own command that puts demo data in place before a round"),
        Setting(name="browsers", default="", title="A folder with Playwright installed, for the critics' browsers"),
    ]

    lines = [
        Line(name="gathered", title="critique round {{n}} is complete: every critic reported into report {{report}} - hand it to the designer"),
    ]

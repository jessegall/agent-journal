import subprocess

import controllers.types as types_module
import resources.types as resources_module
from controllers.base import Controller
from controllers.types import Reports
from engine import runtime
from features.critique.details import CritiqueDetails
from features.critique.lenses import DEFAULT, LENSES
from features.critique.resource import Critique
from features.helpers.controller import Helpers
from features.sharing.controller import answers
from resources.base import SYSTEM, Refused

SEED_SECONDS = 300


def page(app: str, login: str, browsers: str) -> str:
    started = (f"Start WebKit from {browsers} with Playwright: webkit.launch(), then browser.newContext({{...devices['iPhone 15 Pro'], "
               f"storageState: '{login}'}}) so you are logged in." if browsers else "Use the browser tool you have.")
    return (f"# Critique round\n\nThe app: {app}\n\n{started}\n\nRules: open only {app} and nothing else; never another port, never a "
            f"journal command, never an edit to the project. Take screenshots into a folder of your own and look at them; that is how "
            f"you see what a person sees.\n")


def brief(what: str, lens, folder) -> str:
    return (f"You are {lens.critic}, a design critic. What changed: {what}\n\nYour lens: {lens.looks}.\n\nRead {folder}/round.md first: "
            f"it says how to open the app and what you may not do. Use the app as a person would, through your lens only. At most eight "
            f"findings, most important first, each with what you saw, why it matters and a concrete fix, in plain words; end with the "
            f"paths of your screenshots. The designer decides what to take. Report with journal helper report \"<your findings>\".")


class Critiques(Controller):
    resource = Critique

    def round(self, what: str, critics: int = 0, lenses: str = "", provider: str = "claude", model: str = "sonnet") -> str:
        chosen = [name.strip() for name in lenses.split(",") if name.strip()] or list(DEFAULT)
        unknown = [name for name in chosen if name not in LENSES]
        if unknown:
            raise Refused(f"no lens {', '.join(unknown)}; the lenses are {', '.join(LENSES)}")
        chosen = chosen[:critics] if critics else chosen
        settings = CritiqueDetails.values(self.record)
        if not settings.app:
            raise Refused('name the app the critics open first: journal settings, critique.app "<address>"')
        if settings.seed:
            subprocess.run(["/bin/sh", "-c", settings.seed], cwd=self.record.root.parent, timeout=SEED_SECONDS, capture_output=True)
        if not answers(settings.app):
            raise Refused(f"the app at {settings.app} does not answer; start it, then ask for the round again")
        report = Reports(self.record, actor=self.actor).create(f"What the critics found about {what}"[:80], brief=f"Critique round on: {what}")
        row = self.create(f"Critique round on {what}"[:80], report=report.n)
        folder = runtime.folder(self.record.root) / "critiques" / str(row.n)
        folder.mkdir(parents=True, exist_ok=True)
        (folder / "round.md").write_text(page(settings.app, settings.login, settings.browsers))
        helpers = Helpers(self.record, actor=self.actor)
        sent = []
        for name in chosen:
            lens = LENSES[name]
            critic = helpers._dispatched(lens.critic, f"Critique {what} through the {name} lens"[:80], provider, model, brief(what, lens, folder))
            sent.append({"helper": critic.n, "lens": name, "name": lens.critic})
        self.update(row.n, critics=sent)
        return f"critique round {row.n}: {len(sent)} critics out ({', '.join(c['name'] for c in sent)}); their findings gather in report {report.n}"

    def recheck(self, n: int, revised: str) -> str:
        row = self._unfinished(n, "finished")
        helpers = Helpers(self.record, actor=SYSTEM)
        for critic in row.critics:
            helpers.say(critic["helper"], f"The designer revised it: {revised}. Look again through your lens and report again with journal helper report.")
        self.update(n, reported=[])
        return f"the {len(row.critics)} critics of round {n} look again"

    def complete(self, n: int, how: str = "", **data):
        row = self._unfinished(n, "finished")
        helpers = Helpers(self.record, actor=SYSTEM)
        for critic in row.critics:
            try:
                helpers.stop(critic["helper"])
            except Refused:
                continue
        return super().complete(n, how or "the round is over and its critics are stopped", **data)


resources_module.register(Critique)
types_module.register(Critiques)

import subprocess

import controllers.types as types_module
import resources.types as resources_module
from controllers.base import Controller
from controllers.types import Agents, Reports
from providers import dispatch_model
from engine import runtime
from features.critique.details import CritiqueDetails
from features.critique.lenses import DEFAULT, LENSES
from features.critique.resource import Critique
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
            f"paths of your screenshots. The designer decides what to take. Your findings are your answer: end with them.")


class Critiques(Controller):
    resource = Critique

    def round(self, what: str, critics: int = 0, lenses: str = "", model: str = "sonnet") -> str:
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
        caller = Agents(self.record, actor=SYSTEM)._titled(self.session) if self.session else None
        model = dispatch_model(caller.provider, model) if caller else model
        sent = []
        for name in chosen:
            lens = LENSES[name]
            (folder / f"{name}.md").write_text(brief(what, lens, folder))
            sent.append({"lens": name, "name": lens.critic, "brief": str(folder / f"{name}.md")})
        self.update(row.n, critics=sent)
        briefs = "; ".join(f"{c['name']} ({c['lens']}) with the brief in {c['brief']}" for c in sent)
        return (f"critique round {row.n}: dispatch one read-only subagent per lens on model {model}, named for its critic: {briefs}. "
                f"As each answers, put its findings in report {report.n} with journal report section {report.n} \"<critic>, <lens>\" "
                f"\"<findings>\"; once all are in, hand report {report.n} to the designer, who decides.")

    def recheck(self, n: int, revised: str) -> str:
        row = self._unfinished(n, "finished")
        names = ", ".join(c["name"] for c in row.critics)
        return (f"send the same critics of round {n} back ({names}): continue each subagent with \"The designer revised it: {revised}. "
                f"Look again through your lens and answer with your findings.\", and add their new findings to report {row.report}")

    def complete(self, n: int, how: str = "", **data):
        self._unfinished(n, "finished")
        return super().complete(n, how or "the round is over", **data)


resources_module.register(Critique)
types_module.register(Critiques)

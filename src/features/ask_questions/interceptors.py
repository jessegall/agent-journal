import json

from engine.journal_calls import calls, pieces
from engine.reach import Reach
from features.ask_questions.choices import restates
from features.parts import ActionInterceptor, AgentContext, Context, ToolInterceptor
from resources.base import AGENT, titled
from resources.shapes import normalize_options
from controllers.types import Questions

FILED = "filed"
UNPICKED = "unpicked"


def option_titles(options) -> list[str]:
    if not isinstance(options, list):
        return []
    return [option["title"] if isinstance(option, dict) else str(option) for option in normalize_options(options)]


def given_pick(given) -> int | None:
    if given is None:
        return None
    text = str(given).strip()
    return int(text) if text.isdigit() else None


def unpicked(titles, pick: int | None) -> bool:
    return len(titles) > 1 and (pick is None or not 1 <= pick <= len(titles))


def given_options(given) -> list[str]:
    return option_titles(json.loads(given) if isinstance(given, str) and given.strip().startswith("[") else given)


class AskInTheJournal(ToolInterceptor):
    reach = Reach.MAIN

    def intercept(self, context: AgentContext, call) -> str:
        if not context.provider.question(call):
            return ""
        asked = context.provider.asked_questions(call)
        missing = next((one for one in asked if unpicked(one.labels, one.pick)), None)
        if missing:
            return context.feature.line_text(UNPICKED, question=missing.text)
        questions = context.journal.acting(AGENT).get(Questions)
        numbers = [questions.create(titled(one.text), brief=one.text, options=one.options, pick=one.pick).n for one in asked]
        return context.feature.line_text(FILED, numbers=", ".join(map(str, numbers)) or "none")


class QuestionInterceptor(ActionInterceptor):
    def intercept(self, feature_context: Context, controller, title: str = "", abstract: str = "", brief: str = "", **data):
        if controller.type != "question":
            return None
        self.asked(controller, f"{title}\n{abstract}\n{brief}", given_options(data.get("options")), given_pick(data.get("pick")))
        return None

    def asked(self, controller, text: str, titles: list[str], pick: int | None) -> None:
        raise NotImplementedError


class OptionsOnlyInTheirButtons(QuestionInterceptor):
    def asked(self, controller, text: str, titles: list[str], pick: int | None) -> None:
        if restates(text, titles):
            controller._refuse("the options already carry their own titles and text, so the question does not list them again: "
                               "take the A/B/C or numbered option lines, or the option names, out of its title, abstract and brief")


class NamesItsPick(QuestionInterceptor):
    def asked(self, controller, text: str, titles: list[str], pick: int | None) -> None:
        if controller.actor == AGENT and unpicked(titles, pick):
            controller._refuse(f"name the option you would pick with --set pick=<1 to {len(titles)}>: the card marks it as the agent's pick")


class AskOnItsOwn(ToolInterceptor):
    reach = Reach.MAIN

    def intercept(self, context: AgentContext, call) -> str:
        shell = call.shell_command
        if not shell or not any(made.names("question", "ask") for made in calls(shell)) or len(pieces(shell)) < 2:
            return ""
        return "ask a question as a command of its own, never chained or piped with others, so it goes out once and on purpose"


class AskedOnce(QuestionInterceptor):
    def asked(self, controller, text: str, titles: list[str], pick: int | None) -> None:
        title = titled(text.split("\n", 1)[0])
        open_one = controller.rows.by_title(title, standing=True)
        if open_one:
            controller._refuse(f"question {open_one.n} already asks this and is still open: wait for its answer")

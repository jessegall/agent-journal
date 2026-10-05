import json

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


def given_options(given) -> list[str]:
    return option_titles(json.loads(given) if isinstance(given, str) and given.strip().startswith("[") else given)


class AskInTheJournal(ToolInterceptor):
    reach = Reach.MAIN

    def intercept(self, context: AgentContext, call) -> str:
        if not context.provider.question(call):
            return ""
        asked = context.provider.asked_questions(call)
        unpicked = next((one for one in asked if len(one.options) > 1 and not one.pick), None)
        if unpicked:
            return context.feature.line_text(UNPICKED, question=unpicked.text)
        questions = context.journal.acting(AGENT).get(Questions)
        numbers = [questions.create(titled(one.text), brief=one.text, options=one.options, pick=one.pick).n for one in asked]
        return context.feature.line_text(FILED, numbers=", ".join(map(str, numbers)) or "none")


class OptionsOnlyInTheirButtons(ActionInterceptor):
    def intercept(self, context: Context, controller, title: str = "", abstract: str = "", brief: str = "", **data):
        if controller.type != "question":
            return None
        titles = given_options(data.get("options"))
        if restates(f"{title}\n{abstract}\n{brief}", titles):
            controller._refuse("the options already carry their own titles and text, so the question does not list them again: "
                               "take the A/B/C or numbered option lines, or the option names, out of its title, abstract and brief")
        return None


class NamesItsPick(ActionInterceptor):
    def intercept(self, context: Context, controller, title: str = "", abstract: str = "", brief: str = "", **data):
        if controller.type != "question" or controller.actor != AGENT:
            return None
        titles = given_options(data.get("options"))
        pick = str(data.get("pick", "")).strip()
        if len(titles) > 1 and not (pick.isdigit() and 1 <= int(pick) <= len(titles)):
            controller._refuse(f"name the option you would pick with --set pick=<1 to {len(titles)}>: the card marks it as the agent's pick")
        return None

import json

from engine.reach import Reach
from features.ask_questions.choices import restates
from features.parts import ActionInterceptor, AgentContext, Context, ToolInterceptor
from resources.base import AGENT, titled
from resources.shapes import normalize_options
from controllers.types import Questions

FILED = "filed"


def option_titles(options) -> list[str]:
    if not isinstance(options, list):
        return []
    return [option["title"] if isinstance(option, dict) else str(option) for option in normalize_options(options)]


class AskInTheJournal(ToolInterceptor):
    reach = Reach.MAIN

    def intercept(self, context: AgentContext, call) -> str:
        if not context.provider.question(call):
            return ""
        questions = context.journal.acting(AGENT).get(Questions)
        numbers = [questions.create(titled(asked.text), brief=asked.text, options=asked.options).n
                   for asked in context.provider.asked_questions(call)]
        return context.feature.line_text(FILED, numbers=", ".join(map(str, numbers)) or "none")


class OptionsOnlyInTheirButtons(ActionInterceptor):
    def intercept(self, context: Context, controller, title: str = "", abstract: str = "", brief: str = "", **data):
        if controller.type != "question":
            return None
        given = data.get("options")
        options = json.loads(given) if isinstance(given, str) and given.strip().startswith("[") else given
        titles = option_titles(options)
        if restates(f"{title}\n{abstract}\n{brief}", titles):
            controller._refuse("the options already carry their own titles and text, so the question does not list them again: "
                               "take the A/B/C or numbered option lines, or the option names, out of its title, abstract and brief")
        return None

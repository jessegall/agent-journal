import json
from dataclasses import dataclass

from engine.fields import Loaded
from features.ask_questions.choices import restates
from features.parts import ActionInterceptor, AgentContext, Context, ToolInterceptor
from resources.base import AGENT, titled

FILED = "filed"



def option_title(option) -> str:
    return Option.from_json(option).title if isinstance(option, dict) else str(option)

class AskInTheJournal(ToolInterceptor):
    def intercept(self, context: AgentContext, call) -> str:
        if not context.provider.question(call):
            return ""
        questions = context.journal.acting(AGENT).questions
        numbers = [questions.create(titled(asked.text), brief=asked.text, options=asked.options).n
                   for asked in context.provider.asked_questions(call)]
        title, brief = context.feature.line(FILED, {"numbers": ", ".join(map(str, numbers)) or "none"})
        return f"{title} - {brief}"


@dataclass(frozen=True)
class Option(Loaded):
    aliases = {"title": ("title", "label")}
    title: str = ""


class OptionsOnlyInTheirButtons(ActionInterceptor):
    def intercept(self, context: Context, controller, title: str = "", abstract: str = "", brief: str = "", **data):
        if controller.type != "question":
            return None
        given = data.get("options")
        options = json.loads(given) if isinstance(given, str) and given.strip().startswith("[") else given
        titles = [option_title(option) for option in options] if isinstance(options, list) else []
        if restates(f"{title}\n{abstract}\n{brief}", titles):
            controller._refuse("the options already carry their own titles and text, so the question does not list them again: "
                               "take the A/B/C or numbered option lines, or the option names, out of its title, abstract and brief")
        return None

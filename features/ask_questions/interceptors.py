from features.parts import Context, ToolInterceptor
from resources.base import AGENT, titled

FILED = "filed"


class AskInTheJournal(ToolInterceptor):
    def intercept(self, context: Context, call) -> str:
        if not context.provider.question(call):
            return ""
        questions = context.journal.acting(AGENT).questions
        numbers = [questions.create(titled(asked.text), brief=asked.text, options=asked.options).n
                   for asked in context.provider.asked_questions(call)]
        title, brief = context.feature.line(FILED, {"numbers": ", ".join(map(str, numbers)) or "none"})
        return f"{title} - {brief}"

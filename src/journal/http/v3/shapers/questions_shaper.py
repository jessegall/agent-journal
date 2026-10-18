from journal.http.v3.shapers.shaper import Shaper
from journal.http.v3.v3_row import AGENT, USER, V3Row, seconds
from journal.repositories.questions import Questions


class QuestionsShaper(Shaper):
    type = "question"

    def __init__(self, questions: Questions) -> None:
        self.questions = questions

    def rows(self) -> list[V3Row]:
        return [self.row(q) for q in self.questions.in_()]

    @staticmethod
    def row(q) -> V3Row:
        answered = q.answer is not None
        options = [{"title": o, "description": ""} for o in q.options]
        chosen = next((i + 1 for i, o in enumerate(q.options) if answered and o == q.answer), 0)
        return V3Row.of("question", q, title=q.text, seen=[AGENT, USER] if answered else [AGENT], outcome=q.answer, completed=seconds(q.updated_at) if answered else 0.0,
                        data={"options": options, "pick": 1, "chosen": chosen, "kept": False, "answered_by": USER if answered else "", "reason": "", "final": False, "dismissed": False})

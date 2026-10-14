from journal.features.feature import Feature
from journal.features.nudge import Nudge
from journal.features.questions.states.waiting import Waiting


class Questions(Feature):
    name = "questions"
    title = "Questions"
    states = (Waiting,)

    ANSWERED = Nudge(name, "answered", "question {{n}} is answered: act on the answer")
    SETTLED = Nudge(name, "settled", "question {{n}} has waited a day for an answer")
    PROSE = Nudge(name, "prose", "your last message offers choices in prose: ask them as a question")
    nudges = (ANSWERED, SETTLED, PROSE)

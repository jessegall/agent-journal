from journal.features.feature import Feature
from journal.features.nudge import Nudge
from journal.features.questions.commands.question_command import QuestionCommand
from journal.features.questions.states.waiting import Waiting


class Questions(Feature):
    name = "questions"
    title = "Questions"
    states = (Waiting,)
    commands = (QuestionCommand,)

    ANSWERED = Nudge(name, "answered", "question {{n}} is answered: {{answer}}", "act on the answer", repeat_after=0)
    nudges = (ANSWERED,)

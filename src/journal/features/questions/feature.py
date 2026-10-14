from journal.features.feature import Feature
from journal.features.nudge import Nudge
from journal.features.skill import Skill
from journal.features.questions.commands.question_command import QuestionCommand
from journal.features.questions.states.waiting import Waiting


class Questions(Feature):
    name = "questions"
    title = "Questions"
    states = (Waiting,)
    commands = (QuestionCommand,)

    ANSWERED = Nudge(name, "answered", "question {{n}} is answered: {{answer}}", "act on the answer", repeat_after=0)
    nudges = (ANSWERED,)

    skill = Skill("questions", 'Ask the user a question and wait for the answer; load it before offering the user choices', """
# Questions

A choice only the user can make is asked as a question, not written into a reply.

- `journal question ask "<the question>" --options "a, b, c"`; you are then waiting, and stopping is fine.
- The answer arrives as a line: act on it. A reply from the user in the chat answers it too.
- `journal question list` shows what is open. Never offer choices in prose and carry on; ask.
""", keywords=('question', 'questions', 'choose', 'options', 'decide'), required_in=('waiting',))

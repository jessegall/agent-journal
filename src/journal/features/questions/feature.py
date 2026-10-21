from journal.features.feature import Feature
from journal.engine.nudge import Nudge
from journal.support.skill import Skill
from journal.features.questions.commands.question_command import QuestionCommand
from journal.features.questions.listeners.question_card import QuestionCard
from journal.features.questions.support.questions_conduct import QuestionsConduct
from journal.features.questions.support.questions_data_reader import QuestionsDataReader
from journal.features.questions.support.questions_data import QuestionsData
from journal.features.questions.states.waiting import Waiting


class Questions(Feature[QuestionsData]):
    name = "questions"
    title = "Questions"
    help = "The agent asks you a question and waits; your answer sends it back to work."
    states = (Waiting,)
    commands = (QuestionCommand,)
    listeners = (QuestionCard,)
    conduct = (QuestionsConduct,)
    data = (QuestionsDataReader,)

    QUESTION_ANSWERED = Nudge(name, "question_answered", "question {{n}} is answered", "`journal question show {{n}}` reads it whole, with the messages linked to it; act on the answer", repeat_after=0)
    JOURNAL_QUESTION_TOOL = Nudge(name, "ask_through_the_journal", "a question goes through the journal, not your own question tool", "`journal question ask \"<one line>\" --options \"a\" \"b\"`; the user answers in the viewer and the answer reaches you", repeat_after=0)
    nudges = (QUESTION_ANSWERED, JOURNAL_QUESTION_TOOL)

    skill = Skill("questions", 'Ask the user a question and wait for the answer; load it before offering the user choices', """
# Questions

A choice only the user can make is asked as a question, not written into a reply.

- `journal question ask "<the question>" --options "a" "b" "c"`, each choice quoted on its own so a comma stays inside it; you are then waiting, and stopping is fine.
- Each option names who acts, the agent or the user, never I, we or you, which the reader cannot place.
- The answer arrives as a line naming `journal question show <n>`: read it there, whole, with the messages linked to it,
  and act on it. A reply from the user in the chat answers it too.
- `journal question list` shows what is open. Never offer choices in prose and carry on; ask.
""", keywords=('question', 'questions', 'choose', 'options', 'decide'), required_in=('waiting',))

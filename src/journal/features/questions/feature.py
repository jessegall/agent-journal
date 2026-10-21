from journal.support.entry import Entry
from journal.features.feature import Feature
from journal.engine.nudge import Nudge
from journal.models.node_kind import NodeKind
from journal.support.skill import Skill
from journal.features.questions.commands.question_command import QuestionCommand
from journal.features.questions.listeners.mark_question import MarkQuestion
from journal.features.questions.support.questions_conduct import QuestionsConduct
from journal.features.questions.support.questions_snapshot_reader import QuestionsSnapshotReader
from journal.features.questions.states.waiting import Waiting


class Questions(Feature):
    name = "questions"
    title = "Questions"
    help = "The agent asks you a question and waits; your answer sends it back to work."
    states = (Waiting,)
    commands = (QuestionCommand,)
    listeners = (MarkQuestion,)
    conduct = (QuestionsConduct,)
    snapshot = (QuestionsSnapshotReader,)
    checks = (
        Entry(NodeKind.CHECK, 'question_answered', 'Question answered?', 'the row is a question the user just answered'),
        Entry(NodeKind.CHECK, 'agent_waits_on_the_question', 'Agent waits on this question?', 'the agent waits on the question of this row'),
        Entry(NodeKind.CHECK, 'open_question', 'Has an open question?', 'a question to the user here waits for its answer'),
    )

    QUESTION_ANSWERED = Nudge(name, "question_answered", "question {{n}} is answered", "`journal question show {{n}}` reads it whole, with the messages linked to it; act on the answer", repeat_after=0)
    ASK_THROUGH_THE_JOURNAL = Nudge(name, "ask_through_the_journal", "a question goes through the journal, not your own question tool", "`journal question ask \"<one line>\" --options \"a\" \"b\"`; the user answers in the viewer and the answer reaches you", repeat_after=0)
    nudges = (QUESTION_ANSWERED, ASK_THROUGH_THE_JOURNAL)

    skill = Skill("questions", 'Ask the user a question and wait for the answer; load it before offering the user choices', """
# Questions

A choice only the user can make is asked as a question, not written into a reply.

- `journal question ask "<the question>" --options "a" "b" "c"`, each choice quoted on its own so a comma stays inside it; you are then waiting, and stopping is fine.
- Each option names who acts, the agent or the user, never I, we or you, which the reader cannot place.
- The answer arrives as a line naming `journal question show <n>`: read it there, whole, with the messages linked to it,
  and act on it. A reply from the user in the chat answers it too.
- `journal question list` shows what is open. Never offer choices in prose and carry on; ask.
""", keywords=('question', 'questions', 'choose', 'options', 'decide'), required_in=('waiting',))

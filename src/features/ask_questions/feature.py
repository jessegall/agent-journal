import json

from expects.staged import in_a_transcript
from controllers.types import Questions
from events.agents import AgentReported, ToolCallAnswered
from events.answers import Allowed, Refused as Declined
from events.asking import RowWriting, ToolCallAsked
from events.resources import AnyEvent
from events.messages import MessageCreated
from events.questions import AnswerGiven, AnswerOnScreen, AskingSettled, ProseOffersChoices, QuestionCompleted, QuestionCreated, QuestionSettled, QuestionsToFile
from expects import Answered, Dispatches, Given, Held, Kept, Nudged, Ran, Refused, Updated, answering, exited, nothing
from resources.base import AGENT, USER, Ref
from resources.put_questions import PutQuestion
from resources.types import AgentRow, Question, Todo
from framework.base import Feature
from framework.watched import FACTS, state_facts
from resources.base import SYSTEM
from framework.journal import Journal
from features.ask_questions.answers import answers_added
from features.ask_questions.details import AskQuestionsDetails
from features.ask_questions.answering import AskInTheJournal, AskOnItsOwn
from features.ask_questions.handlers import AnswerOnTheScreen, AskInsteadOfProse, DismissSettledQuestion, FileQuestions, MarkTheAnswer, ReleaseOnceSettled, ask
from features.ask_questions.listeners import SpotAnswer, SpotAnswerOnScreen, SpotProse, SpotQuestionAsked, SpotQuestionToolRefused, SpotSettledRows, SpotUserWrote
from features.ask_questions.refusing import AskedOnce, NamesItsPick, OneAskPerRow, OptionsOnlyInTheirButtons, OptionsWhenEnumerable, WaitsOnTheUserByAQuestion
from features.ask_questions.waiting import open_a_day
from framework.sending import Nudge


OFFERED = (
    "Which do you want?\n1. the blue one\n2. the red one",
    "Should I:\nA) merge now\nB) wait for CI",
    "Wil je liever:\n1. één lange gids\n2. een pagina per onderwerp",
    "Two ways:\n1. blue\n2. red\nLet me know.",
    "See question 3.\nWhich do you want?\n1. blue\n2. red",
    "I found two ways.\n\n- keep it\n- drop it\n\nWhich do you prefer?",
)
NOT_OFFERED = (
    "Done:\n- built\n- tested",
    "Shall I merge it?",
    "Done:\n- built the route\n- tested it\n\nQuestion 15 is still open: should the server answer first?",
    "Done:\n- the engine can see which step is running\n- the band is taller",
    "Questions 60-63 are yours in the viewer:\n- 60, where it lives?\n- 61, what Doing does?",
    "I asked \"is there an agent?\" and:\n- one\n- two",
    "**Did the hook fire?** I checked.\n\n- **Does it fire?** Yes, for every real message, and the server passed each one on to the chat, whole.\n"
    "- **Why some went missing:** they were written into hidden thinking, never as messages at all.",
    "Status:\n- built the page\n- tested it\n\nDesign: https://claude.ai/design/p/abc?file=X",
)
CLAUDE = AgentRow(n=1, title="claude-1", data={"provider": "claude"})
BRANCH = Question(n=3, title="which branch?", completed=1.0, outcome="main")
FILED_LINE = "asked in the journal - the user answers it in the viewer and the answer reaches you as an event; carry on with what does not depend on it"
NO_PICK = ("question which branch? names no pick - label the option you would pick (Recommended) and ask again; "
           "the card marks it as the agent's pick")
PROSE_HELD = ("your last message offered the user choices in prose: ask them through journal question ask --set options=… --set pick=<n> "
              "before any other write")
OPTIONS = [{"title": "main"}, {"title": "dev"}]
RELEASE = [{"title": "Release now", "text": "Push and tag."}, {"title": "Fix first", "text": "Work the fault first."}]
LISTED_AGAIN = ("the options already carry their own titles and text, so the question does not list them again: take the A/B/C or numbered option "
                "lines, or the option names, out of its title, abstract and brief")
ALONE = "ask a question as a command of its own, never chained or piped with others, so it goes out once and on purpose"
ASKING = "journal question ask"
ALONE_ASK = f"{ASKING} 'which?'"
CHAINED = f"{ALONE_ASK} && ls"
TWO = [{"title": "main", "description": "the usual"}, {"title": "dev", "description": "for tries"}]


def asked_call(*labels: tuple[str, str]) -> str:
    return json.dumps({"questions": [{"question": "which branch?", "options": [{"label": label, "description": text} for label, text in labels]}]}, sort_keys=True)


def asking(tool: str, input: str, subagent: bool = False) -> ToolCallAsked:
    return ToolCallAsked(tool=tool, input=input, command=input if tool == "Bash" else "", session="claude-1", subagent=subagent)


def writing(actor: str = "system", title: str = "", abstract: str = "", brief: str = "", **data) -> RowWriting:
    """A question about to be created, as the controller's create hands it on: its title, abstract and brief always, and what else was set."""
    return RowWriting(type="question", action="create", actor=actor, fields=(("title", title), ("abstract", abstract), ("brief", brief), *data.items()))


def blocking(actor: str, why: str) -> RowWriting:
    return RowWriting(type="todo", action="block", actor=actor, fields=(("n", 7), ("why", why)))




class AskQuestions(Feature):
    details = AskQuestionsDetails
    nudges = (Nudge("settled", behaviour="settled", about=open_a_day,
                    guarantee="When a question has waited a day for an answer, the agent is told, so a question is not left hanging for ever."),)

    def register(self, journal: Journal) -> None:
        FACTS.register(self, *state_facts("question", "open", lambda context: [q for q in Questions(context.record, actor=SYSTEM).rows.standing() if not q.hidden]))
        journal.events.listen(AgentReported, SpotProse(), expects=[
            Given(AgentReported(agent=1), rows=[CLAUDE], transcript=in_a_transcript("Should I use files or SQLite?\n\n1. Files\n2. SQLite")) >> Dispatches(ProseOffersChoices(agent=1).due("asking")),
            Given(AgentReported(agent=1), rows=[CLAUDE], transcript=in_a_transcript("The build is green.")) >> Dispatches(nothing),
            *(Given(AgentReported(agent=1), rows=[CLAUDE], transcript=in_a_transcript(prose)) >> Dispatches(ProseOffersChoices(agent=1).due("asking")) for prose in OFFERED),
            *(Given(AgentReported(agent=1), rows=[CLAUDE], transcript=in_a_transcript(prose)) >> Dispatches(nothing) for prose in NOT_OFFERED),
        ])
        journal.events.listen(QuestionCreated, SpotQuestionAsked(), expects=[
            Given(QuestionCreated(n=3), rows=[CLAUDE, Question(n=3, title="which branch?")]) >> Dispatches(AskingSettled(agent=1)),
            Given(QuestionCreated(n=3), rows=[Question(n=3, title="which branch?")]) >> Dispatches(nothing),
        ])
        journal.events.listen(MessageCreated, SpotUserWrote(), expects=[
            Given(MessageCreated(n=3, type="message", actor="user"), rows=[CLAUDE]) >> Dispatches(AskingSettled(agent=1)),
            Given(MessageCreated(n=3, type="message", actor="user"), rows=[CLAUDE, AgentRow(n=2, title="claude-2", data={"provider": "claude"}), AgentRow(n=3, title="claude-3", data={"status": "stopped"})])
                >> Dispatches(AskingSettled(agent=1)) & Dispatches(AskingSettled(agent=2)),
            Given(MessageCreated(n=3, type="message", actor="agent"), rows=[CLAUDE]) >> Dispatches(nothing),
        ])
        journal.events.listen(QuestionCompleted, SpotAnswer(), expects=[
            Given(QuestionCompleted(n=3, type="question", actor="user"), rows=[CLAUDE, BRANCH]) >> Dispatches(AnswerGiven(agent=1, n=3, answer="main", ref="question:3")),
            Given(QuestionCompleted(n=3, type="question", actor="agent"), rows=[CLAUDE, BRANCH]) >> Dispatches(nothing),
            Given(QuestionCompleted(n=3, type="question", actor="user"), rows=[CLAUDE, Question(n=3, title="which branch?", completed=1.0, outcome="main", data={"hidden": True})])
                >> Dispatches(nothing),
            Given(QuestionCompleted(n=3, type="question", actor="user"), rows=[BRANCH]) >> Dispatches(nothing),
        ])
        journal.events.listen(QuestionCompleted, SpotAnswerOnScreen(), expects=[
            Given(QuestionCompleted(n=3, type="question", actor="user"), rows=[CLAUDE, BRANCH]) >> Dispatches(AnswerOnScreen(agent=1, option=0, text="main", options=0)),
            Given(QuestionCompleted(n=3, type="question", actor="user"), rows=[BRANCH]) >> Dispatches(nothing),
        ])
        journal.events.listen(AnyEvent, SpotSettledRows(), expects=[
            Given(AnyEvent(n=7, type="todo", action="completed"), rows=[Todo(n=7, title="the header"), Question(n=3, title="keep the header?", refs=["todo:7"])])
                >> Dispatches(QuestionSettled(n=3, why=f"{Ref('todo', 7).spoken}, which it was about, is closed")),
            Given(AnyEvent(n=7, type="todo", action="updated"), rows=[Todo(n=7, title="the header"), Question(n=3, title="keep the header?", refs=["todo:7"])]) >> Dispatches(nothing),
            Given(AnyEvent(n=8, type="todo", action="completed"), rows=[Todo(n=8, title="the footer"), Question(n=3, title="keep the header?", refs=["todo:7"])]) >> Dispatches(nothing),
        ])
        journal.events.listen(ToolCallAnswered, SpotQuestionToolRefused(), expects=[
            Given(ToolCallAnswered(agent=1, tool="AskUserQuestion", input=asked_call(("main (Recommended)", "the usual"), ("dev", "for tries")), why=FILED_LINE), rows=[CLAUDE])
                >> Dispatches(QuestionsToFile(agent=1, asked=(PutQuestion("which branch?", json.dumps(TWO), 1),))),
            Given(ToolCallAnswered(agent=1, tool="AskUserQuestion", input=asked_call(("main (Recommended)", ""), ("dev", "")), why=FILED_LINE, subagent=True), rows=[CLAUDE]) >> Dispatches(nothing),
            Given(ToolCallAnswered(agent=1, tool="AskUserQuestion", input=asked_call(("main (Recommended)", ""), ("dev", "")), why="held"), rows=[CLAUDE]) >> Dispatches(nothing),
        ])
        journal.events.handle(ProseOffersChoices, AskInsteadOfProse(), expects=[
            Given(ProseOffersChoices(agent=1), rows=[CLAUDE]) >> Nudged("prose") & Held(PROSE_HELD),
        ])
        journal.events.handle(AskingSettled, ReleaseOnceSettled(), expects=[
            Given(AskingSettled(agent=1), rows=[CLAUDE], held=PROSE_HELD) >> Dispatches(nothing),
        ])
        journal.events.handle(AnswerGiven, MarkTheAnswer(), expects=[
            Given(AnswerGiven(agent=1, n=3, answer="main", ref="question:3"), rows=[CLAUDE, BRANCH])
                >> Updated(AgentRow(n=1), cards=[{"label": "You answered question 3"}]) & Nudged("answered", n=3, answer="main"),
        ])
        journal.events.handle(AnswerOnScreen, AnswerOnTheScreen(), expects=[
            Given(AnswerOnScreen(agent=1, option=1, text="main", options=2), rows=[CLAUDE]) >> Ran(("answer prompt", 1, "main")),
            Given(AnswerOnScreen(agent=1, option=0, text="the repo", options=2), rows=[CLAUDE]) >> Ran(("answer prompt", 0, "the repo")),
        ])
        journal.events.handle(QuestionSettled, DismissSettledQuestion(), expects=[
            Given(QuestionSettled(n=3, why="to-do 7, which it was about, is closed"), rows=[Question(n=3, title="keep the header?", refs=["todo:7"])]) >> Updated(Question(n=3), dismissed=True),
        ])
        journal.events.handle(QuestionsToFile, FileQuestions(), expects=[
            Given(QuestionsToFile(agent=1, asked=(PutQuestion("which branch?", json.dumps(TWO), 1),)),
                  rows=[CLAUDE], commands=answering({ask(PutQuestion("which branch?", json.dumps(TWO), 1)): exited(0, "question 4")})) >> Nudged("filed as", numbers="4"),
        ])
        journal.agent.append_to_line("question.completed", answers_added)
        journal.events.answer(ToolCallAsked, AskInTheJournal(), expects=[
            Given(asking("AskUserQuestion", asked_call(("main", ""), ("dev", ""))), rows=[CLAUDE]) >> Answered(Declined(NO_PICK)),
            Given(asking("AskUserQuestion", asked_call(("main (Recommended)", ""), ("dev", ""))), rows=[CLAUDE]) >> Answered(Declined(FILED_LINE)),
            Given(asking("AskUserQuestion", asked_call(("main (Recommended)", ""), ("dev", "")), subagent=True), rows=[CLAUDE]) >> Answered(Allowed()),
            Given(asking("Bash", "ls"), rows=[CLAUDE]) >> Answered(Allowed()),
        ])
        journal.events.answer(ToolCallAsked, AskOnItsOwn(), expects=[
            Given(asking("Bash", CHAINED), rows=[CLAUDE]) >> Answered(Declined(ALONE)),
            Given(asking("Bash", ALONE_ASK), rows=[CLAUDE]) >> Answered(Allowed()),
            Given(asking("Bash", "ls && pwd"), rows=[CLAUDE]) >> Answered(Allowed()),
        ])
        journal.commands.refuse(RowWriting, OptionsOnlyInTheirButtons(), expects=[
            Given(writing(title="which branch?", brief="A) main\nB) dev", options=OPTIONS)) >> Refused(LISTED_AGAIN),
            Given(writing(title="Release now or later", brief="Two ways:\nA: release it now\nB: fix the fault first", options=RELEASE)) >> Refused(LISTED_AGAIN),
            Given(writing(title="Release now or later", brief="The fault is open.\n- Release now: push and tag\n- Fix first: work the fault", options=RELEASE))
                >> Refused(LISTED_AGAIN),
            Given(writing(title="Release now or later", brief="The dashboard fault is still open; Release now ships it anyway.", options=RELEASE)) >> Kept(),
            Given(writing(title="which branch?", options=OPTIONS)) >> Kept(),
        ])
        journal.commands.refuse(RowWriting, NamesItsPick(), expects=[
            Given(writing(AGENT, title="which branch?", options=OPTIONS)) >> Refused("name the option you would pick with --set pick=<1 to 2>: the card marks it as the agent's pick"),
            Given(writing(AGENT, title="which branch?", options=OPTIONS, pick=1)) >> Kept(),
            Given(writing(title="which branch?", options=OPTIONS)) >> Kept(),
        ])
        journal.commands.refuse(RowWriting, AskedOnce(), expects=[
            Given(writing(title="which branch?"), rows=[Question(n=2, title="which branch?")]) >> Refused("question 2 already asks this and is still open: wait for its answer"),
            Given(writing(title="which branch?"), rows=[Question(n=2, title="which tag?")]) >> Kept(),
        ])
        journal.commands.refuse(RowWriting, OneAskPerRow(), expects=[
            Given(writing(title="go ahead?", about="todo:7"), rows=[Todo(n=7, title="the header", data={"buttons": [{"label": "Go ahead", "choice": True}]})])
                >> Refused("todo 7 already asks this through its buttons: wait for that answer, or take its buttons off first"),
            Given(writing(title="go ahead?", about="todo:7"), rows=[Todo(n=7, title="the header")]) >> Kept(),
            Given(writing(title="go ahead?")) >> Kept(),
        ])
        journal.commands.refuse(RowWriting, OptionsWhenEnumerable(), expects=[
            Given(writing(AGENT, title="Should I merge?"))
                >> Refused("this question has answers you can list (a yes or no, a which, or alternatives joined by or): give them with "
                           "--set options='[{\"title\": \"...\", \"text\": \"...\"}]' --set pick=<n>, or decide it yourself when an earlier answer settles it; "
                           "a question is open only for a name, a secret or a free description, and then says so with --set free=name|secret|description"),
            Given(writing(AGENT, title="Should I merge?", free="name")) >> Kept(),
            Given(writing(AGENT, title="What is the repository called")) >> Kept(),
        ])
        journal.commands.refuse(RowWriting, WaitsOnTheUserByAQuestion(), expects=[
            Given(blocking(AGENT, "waits on PR 25 until you say to release it")) >> Refused(
                "a to-do that waits on the user carries a question they can answer, not a block: journal todo ask 7 \"<the decision>\" "
                "--set options='[{\"title\": \"...\", \"text\": \"...\"}]' --set pick=<n>, and the answer reaches you when it is given; "
                "a block is for what happens outside, such as a release or another machine"),
            Given(blocking(AGENT, "measure on the 3.0 server once it is installed here")) >> Kept(),
            Given(blocking(USER, "waits on your call")) >> Kept(),
        ])

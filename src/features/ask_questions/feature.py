from controllers.types import Questions
from engine.events.agents import AgentReported
from engine.events.resources import AnyEvent, MessageCreated, QuestionAnswered, ResourceCreated
from expects import Given, Kept, Nudged, Refused, Unchanged, Updated, Wrote
from providers.payload import AskCall, BashCall
from resources.base import AGENT
from resources.types import AgentRow, Question, Todo
from features.base import Feature
from features.triggers.watched import FACTS, state_facts
from resources.base import SYSTEM
from features.journal import Journal
from features.ask_questions.answers import answers_added
from features.ask_questions.details import AskQuestionsDetails
from features.ask_questions.handlers import QuestionAsked, AnswerOnTheScreen, AskInsteadOfProse, DismissSettledQuestions, MarkTheAnswer, ReleaseOnceAnswered, ReleaseOnceAsked, open_a_day
from features.sending import Nudge
from features.ask_questions.interceptors import AskedOnce, AskInTheJournal, AskOnItsOwn, NamesItsPick, OneAskPerRow, OptionsOnlyInTheirButtons, OptionsWhenEnumerable


ASKED = AskCall.from_payload("AskUserQuestion", {"questions": [{"question": "which branch?", "options": [{"label": "main"}, {"label": "dev"}]}]}, {})
ASKED_WITH_PICK = AskCall.from_payload("AskUserQuestion", {"questions": [{"question": "which branch?", "options": [{"label": "main (Recommended)"}, {"label": "dev"}]}]}, {})


class AskQuestions(Feature):
    details = AskQuestionsDetails
    nudges = (Nudge("settled", behaviour="settled", about=open_a_day,
                    guarantee="When a question has waited a day for an answer, the agent is told, so a question is not left hanging for ever."),)

    def register(self, journal: Journal) -> None:
        FACTS.register(self, *state_facts("question", "open", lambda context: [q for q in Questions(context.record, actor=SYSTEM).rows.standing() if not q.hidden]))
        journal.events.handler(AskInsteadOfProse(), expects=[
            Given(AgentReported(agent=1), rows=[AgentRow(n=1, title="claude-1")]) >> Unchanged(),
        ])
        journal.events.handler(ReleaseOnceAsked(), expects=[
            Given(QuestionAsked(n=3), rows=[AgentRow(n=1, title="claude-1"), Question(n=3, title="which branch?")]) >> Unchanged(),
        ])
        journal.events.handler(ReleaseOnceAnswered(), expects=[
            Given(MessageCreated(n=3, type="message", actor="user"), rows=[AgentRow(n=1, title="claude-1")]) >> Unchanged(),
        ])
        journal.events.handler(MarkTheAnswer(), expects=[
            Given(QuestionAnswered(n=3, type="question", actor="user"), rows=[AgentRow(n=1, title="claude-1"), Question(n=3, title="which branch?", completed=1.0, outcome="main")])
                >> Updated(AgentRow(n=1), cards=[{"label": "You answered question 3"}]) & Nudged("answered", n=3, answer="main"),
            Given(QuestionAnswered(n=3, type="question", actor="agent"), rows=[AgentRow(n=1, title="claude-1"), Question(n=3, title="which branch?", completed=1.0, outcome="main")])
                >> Unchanged(),
            Given(QuestionAnswered(n=3, type="question", actor="user"), rows=[AgentRow(n=1, title="claude-1"), Question(n=3, title="which branch?", completed=1.0, outcome="main", data={"hidden": True})])
                >> Unchanged(),
        ])
        journal.events.handler(AnswerOnTheScreen(), expects=[
            Given(QuestionAnswered(n=3, type="question", actor="user"), rows=[Question(n=3, title="which branch?", completed=1.0, outcome="main")]) >> Unchanged(),
        ])
        journal.events.handler(DismissSettledQuestions(), expects=[
            Given(AnyEvent(n=7, type="todo", action="completed"), rows=[Todo(n=7, title="the header"), Question(n=3, title="keep the header?", refs=["todo:7"])])
                >> Updated(Question(n=3), dismissed=True),
            Given(AnyEvent(n=7, type="todo", action="updated"), rows=[Todo(n=7, title="the header"), Question(n=3, title="keep the header?", refs=["todo:7"])]) >> Unchanged(),
            Given(AnyEvent(n=8, type="todo", action="completed"), rows=[Todo(n=8, title="the footer"), Question(n=3, title="keep the header?", refs=["todo:7"])]) >> Unchanged(),
        ])
        journal.agent.append_to_line("question.completed", answers_added)
        journal.agent.interceptor(AskInTheJournal(), expects=[
            Given(ASKED, rows=[AgentRow(n=1, title="claude-1", data={"provider": "claude"})])
                >> Refused("question which branch? names no pick - label the option you would pick (Recommended) and ask again; the card marks it as the agent's pick") & Unchanged(),
            Given(ASKED_WITH_PICK, rows=[AgentRow(n=1, title="claude-1", data={"provider": "claude"})])
                >> Refused("asked in the journal as question 1 - the user answers it in the viewer and the answer reaches you as an event; carry on with what does not depend on it") & Wrote(Question(title="which branch?", data={"pick": 1})),
            Given(BashCall.from_payload("Bash", {"command": "ls"}, {}), rows=[AgentRow(n=1, title="claude-1", data={"provider": "claude"})]) >> Kept(),
        ])
        journal.agent.interceptor(AskOnItsOwn(), expects=[
            Given(BashCall.from_payload("Bash", {"command": "journal question ask 'which?' && ls"}, {}), rows=[AgentRow(n=1, title="claude-1")])
                >> Refused("ask a question as a command of its own, never chained or piped with others, so it goes out once and on purpose"),
            Given(BashCall.from_payload("Bash", {"command": "journal question ask 'which?'"}, {}), rows=[AgentRow(n=1, title="claude-1")]) >> Kept(),
            Given(BashCall.from_payload("Bash", {"command": "ls && pwd"}, {}), rows=[AgentRow(n=1, title="claude-1")]) >> Kept(),
        ])
        journal.commands.intercept("create", OptionsOnlyInTheirButtons(), expects=[
            Given((Questions, {}, {"title": "which branch?", "brief": "A) main\nB) dev", "options": [{"title": "main"}, {"title": "dev"}]}))
                >> Refused("the options already carry their own titles and text, so the question does not list them again: take the A/B/C or numbered option lines, or the option names, out of its title, abstract and brief"),
            Given((Questions, {}, {"title": "which branch?", "options": [{"title": "main"}, {"title": "dev"}]})) >> Kept(),
        ])
        journal.commands.intercept("create", NamesItsPick(), expects=[
            Given((Questions, {"actor": AGENT}, {"title": "which branch?", "options": [{"title": "main"}, {"title": "dev"}]}))
                >> Refused("name the option you would pick with --set pick=<1 to 2>: the card marks it as the agent's pick"),
            Given((Questions, {"actor": AGENT}, {"title": "which branch?", "options": [{"title": "main"}, {"title": "dev"}], "pick": 1})) >> Kept(),
            Given((Questions, {}, {"title": "which branch?", "options": [{"title": "main"}, {"title": "dev"}]})) >> Kept(),
        ])
        journal.commands.intercept("create", AskedOnce(), expects=[
            Given((Questions, {}, {"title": "which branch?"}), rows=[Question(n=2, title="which branch?")])
                >> Refused("question 2 already asks this and is still open: wait for its answer"),
            Given((Questions, {}, {"title": "which branch?"}), rows=[Question(n=2, title="which tag?")]) >> Kept(),
        ])
        journal.commands.intercept("create", OneAskPerRow(), expects=[
            Given((Questions, {}, {"title": "go ahead?", "about": "todo:7"}), rows=[Todo(n=7, title="the header", data={"buttons": [{"label": "Go ahead", "choice": True}]})])
                >> Refused("todo 7 already asks this through its buttons: wait for that answer, or take its buttons off first"),
            Given((Questions, {}, {"title": "go ahead?", "about": "todo:7"}), rows=[Todo(n=7, title="the header")]) >> Kept(),
            Given((Questions, {}, {"title": "go ahead?"})) >> Kept(),
        ])
        journal.commands.intercept("create", OptionsWhenEnumerable(), expects=[
            Given((Questions, {"actor": AGENT}, {"title": "Should I merge?"}))
                >> Refused("this question has answers you can list (a yes or no, a which, or alternatives joined by or): give them with "
                           "--set options='[{\"title\": \"...\", \"text\": \"...\"}]' --set pick=<n>, or decide it yourself when an earlier answer settles it; "
                           "a question is open only for a name, a secret or a free description, and then says so with --set free=name|secret|description"),
            Given((Questions, {"actor": AGENT}, {"title": "Should I merge?", "free": "name"})) >> Kept(),
            Given((Questions, {"actor": AGENT}, {"title": "What is the repository called"})) >> Kept(),
        ])

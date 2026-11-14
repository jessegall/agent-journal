from datetime import timedelta

from suites.coding.modules.workers.ticks.ask_watch import AskWatch
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.ask_ledger import ask
from tests.stories.suites.coding.modules.workers.ask_pass_on import MERGER_QUESTION_LINE
from tests.stories.suites.coding.modules.workers.merger_cases import case  # noqa: F401

MARKS = "chat-mark list --environment main --limit 40"
MERGER_CARD = "The merger asks the main agent"
JOURNAL_CARD = "The journal passes on a stuck worker"


def test_152_a_question_the_merger_passes_on_shows_as_the_card_of_the_merger(case):
    ask(case)
    case.story.expect_success("merger next", actor=case.merger)
    case.story.expect_success(f"{MERGER_QUESTION_LINE} --worker {agent_number(case.story, case.worker.id)}", actor=case.merger)
    case.story.run_listeners()
    marks = case.story.run(MARKS).output_text
    case.story.expect_rows(MERGER_CARD in marks, JOURNAL_CARD not in marks, detail=marks)


def test_152_a_question_the_journal_passes_on_itself_shows_as_the_card_of_the_journal(case):
    ask(case)
    case.story.advance(timedelta(minutes=31))
    AskWatch()(case.story.container)
    case.story.run_listeners()
    marks = case.story.run(MARKS).output_text
    case.story.expect_rows(JOURNAL_CARD in marks, MERGER_CARD not in marks, detail=marks)

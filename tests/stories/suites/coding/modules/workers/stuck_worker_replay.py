from datetime import timedelta

from suites.coding.models.enums.ask_topic import AskTopic
from suites.coding.modules.workers.models.enums.ask_outcome import AskOutcome
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.suites.coding.modules.workers.ask_ledger import QUESTION, SECOND_QUESTION, ask, questions
from tests.stories.suites.coding.modules.workers.ask_pass_on import messages, watch
from tests.stories.suites.coding.modules.workers.merger_cases import case  # noqa: F401


def test_one_walk_a_worker_asks_the_merger_answers_then_asks_again_and_the_journal_passes_it_on_and_the_main_agent_answers(case):
    story = case.story
    ask(case)
    first = questions(story)[0]
    story.expect_success("merger next", actor=case.merger)
    story.expect_success(f'merger answer {first.id} "Use the compiler in tools/bin"', actor=case.merger)
    story.expect_rows("Use the compiler in tools/bin" in case.worker_lines(), detail=case.worker_lines())
    ask(case, SECOND_QUESTION, AskTopic.TESTS)
    story.advance(timedelta(minutes=31))
    watch(case)
    text = messages(case)
    story.expect_rows(text.count("What: ") == 1, SECOND_QUESTION in text, QUESTION not in text, questions(story)[1].outcome is AskOutcome.FORWARDED, detail=text)
    story.expect_success(f'message send "Fill the fixture from the sample" --to agent:{agent_number(story, case.worker.id)}', actor=story.agent)
    story.expect_rows("Fill the fixture from the sample" in case.worker_lines(), [line.outcome for line in questions(story)] == [AskOutcome.ANSWERED, AskOutcome.FORWARDED], detail=case.worker_lines())

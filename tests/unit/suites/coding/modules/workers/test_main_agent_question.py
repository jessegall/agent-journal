from suites.coding.modules.workers.commands.forward_worker_questions.forward_worker_questions_handler import OPTIONS, RECOMMENDATION
from suites.coding.modules.workers.support.main_agent_question import MainAgentQuestion

MERGER_QUESTION = MainAgentQuestion("worker 7 cannot build", "I answered twice", ("answer the worker", "release the worker"), "answer the worker")


def test_a_question_has_its_four_parts_in_order():
    assert MERGER_QUESTION.text().splitlines() == ["What: worker 7 cannot build", "Tried: I answered twice", "Options: 1) answer the worker 2) release the worker",
                                        "Recommendation: answer the worker"]


def test_the_facts_follow_the_four_parts_one_line_each():
    question = MainAgentQuestion("worker 7 has 2 unanswered question(s)", "the merger read it 2 times and settled nothing", OPTIONS, RECOMMENDATION,
                                 ("worker 7 asks about tool on task 3: The sandbox has no compiler", "worker 7 asks about tests on task 3: The fixture file is empty"))
    lines = question.text().splitlines()
    assert lines[2] == "Options: 1) answer the worker 2) change the plan 3) release the worker"
    assert lines[3] == "Recommendation: read the worker's facts first"
    assert lines[4:] == ["worker 7 asks about tool on task 3: The sandbox has no compiler", "worker 7 asks about tests on task 3: The fixture file is empty"]


def test_the_journals_question_and_the_mergers_question_have_the_same_shape():
    journal = MainAgentQuestion("x", "y", OPTIONS, RECOMMENDATION)
    assert [line.split(":")[0] for line in journal.text().splitlines()] == [line.split(":")[0] for line in MERGER_QUESTION.text().splitlines()]

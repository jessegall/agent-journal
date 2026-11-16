from engine.driver.agent_message import AgentMessage
from engine.driver.message_template import MessageTemplate
from engine.driver.rule_answer import RuleAnswer
from engine.driver.rule_answers import RuleAnswers
from engine.driver.rule_record import RuleRecord
from engine.enums.agent_message_type import AgentMessageType
from engine.testing.expectations.expect_row import expect_row

QUEUED = MessageTemplate("shop.queued", AgentMessageType.STEERING, "task {task} is still queued for worker {worker}", plural_text="tasks {task} are still queued for worker {worker}")
STALE = MessageTemplate("shop.stale", AgentMessageType.STEERING, "cart {cart} is stale")
CHARGED = MessageTemplate("shop.charged", AgentMessageType.STEERING, "charge {cart}", required_command="shop charge {cart}")
FREE_TEXT = MessageTemplate("shop.free", AgentMessageType.STEERING, "{text}")


def read_answers(*agent_messages: AgentMessage) -> RuleAnswers:
    return rule_answers(*[[agent_message] for agent_message in agent_messages])


def rule_answers(*rules: list[AgentMessage]) -> RuleAnswers:
    records = [RuleRecord(f"rule_{number}", answer.outcome, answer) for number, answer in enumerate(RuleAnswer.with_agent_messages(*agent_messages) for agent_messages in rules)]
    return RuleAnswers(records)


def expect_key_agent_message_type(answers, expected) -> None:
    actual = [(agent_message.key, agent_message.type) for agent_message in answers.delivered_agent_messages]
    assert actual == expected, actual


def expect_labelled_lines_answers(answers, expected) -> None:
    actual = answers.labelled_lines
    assert actual == expected, actual


def expect_delivered_agent_messages_answers(agent_message, expected) -> None:
    actual = read_answers(agent_message).delivered_agent_messages
    assert actual == expected, actual


def expect_lines_answers(agent_message, expected) -> None:
    actual = read_answers(agent_message).lines
    assert actual == expected, actual


def test_three_agent_messages_of_one_kind_make_one_line_naming_all_three():
    answers = read_answers(QUEUED.agent_message(task=5817, worker=425), QUEUED.agent_message(task=5836, worker=425), QUEUED.agent_message(task=5853, worker=425))
    expect_row(answers, lines=["tasks 5817, 5836, 5853 are still queued for worker 425"])


def test_two_kinds_make_two_lines_and_one_of_a_kind_stays_as_it_is():
    answers = read_answers(QUEUED.agent_message(task=5817, worker=425), STALE.agent_message(cart=7), QUEUED.agent_message(task=5836, worker=425), QUEUED.agent_message(task=5853, worker=425))
    expect_row(answers, lines=["tasks 5817, 5836, 5853 are still queued for worker 425", "cart 7 is stale"])


def test_a_single_agent_message_is_left_whole():
    agent_message = QUEUED.agent_message(task=5817, worker=425)
    expect_delivered_agent_messages_answers(agent_message, [agent_message])
    expect_lines_answers(agent_message, ["task 5817 is still queued for worker 425"])


def test_a_kind_without_words_for_many_says_its_one_line_with_the_values_joined():
    answers = read_answers(STALE.agent_message(cart=7), STALE.agent_message(cart=8))
    expect_row(answers, lines=["cart 7, 8 is stale"])


def test_agent_messages_of_one_kind_from_different_rules_collapse_and_name_the_first_rule():
    answers = rule_answers([QUEUED.agent_message(task=1, worker=425)], [QUEUED.agent_message(task=2, worker=425)])
    expect_row(answers, rule_lines=[("rule_0", "tasks 1, 2 are still queued for worker 425")])


def test_tasks_for_different_workers_stay_separate():
    answers = read_answers(QUEUED.agent_message(task=1, worker=4), QUEUED.agent_message(task=2, worker=5), QUEUED.agent_message(task=3, worker=4))
    expect_row(answers, lines=["tasks 1, 3 are still queued for worker 4", "task 2 is still queued for worker 5"])


def test_the_collapsed_line_keeps_its_key_type_and_labelled_words():
    answers = read_answers(QUEUED.agent_message(task=1, worker=425), QUEUED.agent_message(task=2, worker=425))
    expect_key_agent_message_type(answers, [("shop.queued", AgentMessageType.STEERING)])
    expect_labelled_lines_answers(answers, ["journal: tasks 1, 2 are still queued for worker 425"])


def test_a_line_that_names_a_command_to_run_is_never_merged():
    answers = read_answers(CHARGED.agent_message(cart=1), CHARGED.agent_message(cart=2))
    expect_row(answers, lines=["charge 1", "charge 2"])


def test_a_line_someone_wrote_is_never_merged():
    answers = read_answers(FREE_TEXT.agent_message(text="first"), FREE_TEXT.agent_message(text="second"))
    expect_row(answers, lines=["first", "second"])


def test_a_line_said_twice_with_the_same_words_stays_one_line():
    answers = read_answers(STALE.agent_message(cart=7), STALE.agent_message(cart=7))
    expect_row(answers, lines=["cart 7 is stale"])


def test_a_collapsed_line_that_was_skipped_is_not_delivered():
    rules = read_answers(QUEUED.agent_message(task=1, worker=4), QUEUED.agent_message(task=2, worker=4)).rules
    answers = RuleAnswers(rules, skipped_lines=frozenset({("shop.queued", "tasks 1, 2 are still queued for worker 4")}))
    expect_row(answers, lines=[])
    expect_row(answers, delivered_agent_messages=[])

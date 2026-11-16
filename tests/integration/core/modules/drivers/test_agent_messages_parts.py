
from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType
from engine.testing.expectations.expect_row import expect_row
from tests.stories.support.story_checks import expect_outcome_with, expect_value

TEST_ROWS_REASON = "the test reads every row it checks"


def expect_delivery_count(rows, expected) -> None:
    actual = sorted(((row.text, row.delivery_count) for row in rows))
    assert actual == expected, actual


def expect_turn_limited_agent_message(declared, expected) -> None:
    actual = declared.agent_message().turn_limited
    assert actual is expected, actual


def expect_item_agent_message_type(expected) -> None:
    actual = [item.value for item in AgentMessageType]
    assert actual == expected, actual


def expect_agent_message(agent_message, expected) -> None:
    actual = len(agent_message.text)
    assert actual == expected, actual


def expect_endswith_agent_message(agent_message, text) -> None:
    actual = agent_message.text.endswith(text)
    assert actual, actual


def test_a_declared_agent_message_fills_its_fields_and_keeps_its_key_and_type():
    agent_message = MessageTemplate("shop.total", AgentMessageType.STEERING, "the total is {total}").agent_message(total=12)
    expect_row(agent_message, key="shop.total", type=AgentMessageType.STEERING, text="the total is 12", labelled="journal: the total is 12")


def test_a_agent_message_longer_than_its_longest_is_cut_in_its_middle_so_its_end_stays():
    agent_message = MessageTemplate("shop.long", AgentMessageType.STEERING, "{text} {other} do this").agent_message(text="x" * 70, other="y" * 70)
    expect_agent_message(agent_message, 120)
    expect_endswith_agent_message(agent_message, "do this")
    expect_outcome_with(agent_message, "…")


def test_a_steering_line_and_a_refusal_are_cut_at_120_characters_and_only_info_may_be_longer():
    template = "{text} " + "w" * 700
    lengths = {agent_message_type: len(MessageTemplate("shop.kind", agent_message_type, template).agent_message(text="x").text) for agent_message_type in AgentMessageType}
    expect_value(lengths, {AgentMessageType.NOTICE: 702, AgentMessageType.STEERING: 120, AgentMessageType.REFUSAL: 120, AgentMessageType.SAFETY_REFUSAL: 120})


def test_each_type_can_be_declared():
    expect_item_agent_message_type(["info", "steering", "refusal", "safety_refusal"])


def test_a_reminder_on_a_clock_is_said_again_in_the_same_turn():
    declared = MessageTemplate("shop.reminder", AgentMessageType.STEERING, "check the cart", turn_limited=False)
    expect_turn_limited_agent_message(declared, False)

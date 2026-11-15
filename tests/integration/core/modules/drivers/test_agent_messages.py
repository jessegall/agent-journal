
from unittest.mock import patch

from engine.actor.actor import Actor
from engine.command.context import Context
from engine.database.database import Database
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.driver.agent_message import AgentMessage
from engine.enums.agent_message_type import AgentMessageType
from engine.driver.rule_answer import RuleAnswer
from engine.driver.rule_answers import RuleAnswers
from engine.driver.rule_record import RuleRecord
from engine.registry.registry import Registry
from core.modules.drivers.support.message_log import MessageLog
from core.modules.messages.commands.read_message.read_message import ReadMessage
from core.modules.drivers.models.message_record import MessageRecord
from core.modules.drivers.support.message_records import MessageRecords
from core.modules.processes.support.reader_request_notices import ReaderRequestNotices
from core.modules.processes.agent_messages.reader_request_message import ReaderRequestMessage
from core.modules.processes.agent_messages.run_name_message import RunNameMessage
from tests.stories.core.support.coding_fixtures import StartedTaskBuilder
from tests.stories.core.support.fixtures import UserJoined
from engine.testing.expectations.expect_row import expect_row
from tests.stories.support.story_checks import expect_answers, expect_value



def test_module_sync_registers_every_declared_agent_message_under_its_module(played):
    story = played(UserJoined)
    entry = next(entry for entry in story.container.get(Registry).agent_messages if entry.key == RunNameMessage.declared().key)
    expect_row(entry, module="journal.core.processes", type="steering", text=RunNameMessage.declared().text)


def test_no_two_agent_messages_share_a_key(played):
    keys = [entry.key for entry in played(UserJoined).container.get(Registry).agent_messages]
    expect_answers(keys, len(set(keys)))


def test_a_clock_agent_message_going_back_to_an_older_text_keeps_one_row_for_that_text(played):
    story = played(StartedTaskBuilder)
    log = story.container.get(MessageLog)
    context = Context(Actor.core(), story.clock.timestamp(), ReadMessage(1))

    def write(agent_message: AgentMessage) -> None:
        answer = RuleAnswer.with_agent_messages(agent_message)
        with story.container.get(Database).transaction():
            log.write(story.agent.id, RuleAnswers([RuleRecord("sample", answer.outcome, answer)]), context)

    write(AgentMessage("sample.clock", AgentMessageType.STEERING, "first text", turn_limited=False))
    write(AgentMessage("sample.clock", AgentMessageType.STEERING, "second text", turn_limited=False))
    write(AgentMessage("sample.clock", AgentMessageType.STEERING, "first text", interval=Interval(Seconds(60)), turn_limited=False))
    rows = story.story_rows(MessageRecord, session_agent_id=story.agent.id, key="sample.clock")
    expect_delivery_count(rows, [("first text", 2), ("second text", 1)])


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


def test_many_agent_messages_read_records_together(played):
    story = played(StartedTaskBuilder)
    log = story.container.get(MessageLog)
    database = story.container.get(Database)
    agent_messages = [AgentMessage(f"sample.{number}", AgentMessageType.STEERING, f"Line {number}") for number in range(12)]
    answer = RuleAnswer.with_agent_messages(*agent_messages)
    answers = RuleAnswers([RuleRecord("sample", answer.outcome, answer)])
    context = Context(Actor.core(), story.clock.timestamp(), ReadMessage(1))
    with patch.object(database, "rows", wraps=database.rows) as reads:
        log.skipped_lines(story.agent.id, answers, context.timestamp)
        with database.transaction():
            log.write(story.agent.id, answers, context)
    record_reads = [call for call in reads.call_args_list if "SELECT * FROM agent_message_records" in call.args[0].sql]
    expect_value(len(record_reads), 1)


def test_a_hook_reads_only_the_records_of_its_own_lines(played):
    story = played(StartedTaskBuilder)
    log = story.container.get(MessageLog)
    remaining_agent_messages = [AgentMessage(f"sample.other.{number}", AgentMessageType.STEERING, f"Line {number}") for number in range(30)]
    selected_agent_message = AgentMessage("sample.own", AgentMessageType.STEERING, "Own line")
    answer = RuleAnswer.with_agent_messages(*remaining_agent_messages, selected_agent_message)
    context = Context(Actor.core(), story.clock.timestamp(), ReadMessage(1))
    with story.container.get(Database).transaction():
        log.write(story.agent.id, RuleAnswers([RuleRecord("sample", answer.outcome, answer)]), context)
    rows = story.container.get(MessageRecords).agent_message_rows(story.agent.id, [selected_agent_message])
    expect_value([row.key for row in rows], ["sample.own"])


def test_a_line_on_a_clock_finds_its_newest_record_though_its_text_changed(played):
    story = played(StartedTaskBuilder)
    log = story.container.get(MessageLog)
    interval = Interval(Seconds(300))
    first = AgentMessage("sample.clock", AgentMessageType.STEERING, "Used 10", interval=interval)
    changed = AgentMessage("sample.clock", AgentMessageType.STEERING, "Used 20", interval=interval)
    answer = RuleAnswer.with_agent_messages(first)
    context = Context(Actor.core(), story.clock.timestamp(), ReadMessage(1))
    with story.container.get(Database).transaction():
        log.write(story.agent.id, RuleAnswers([RuleRecord("sample", answer.outcome, answer)]), context)
    rows = story.container.get(MessageRecords).agent_message_rows(story.agent.id, [changed])
    expect_value([row.text for row in rows], ["Used 10"])


def test_a_reader_request_notice_sees_its_last_reminder(played):
    story = played(StartedTaskBuilder)
    log = story.container.get(MessageLog)
    answer = RuleAnswer.with_agent_messages(AgentMessage(f"{ReaderRequestMessage.declared().key}.7", AgentMessageType.STEERING, "Add a reader"))
    context = Context(Actor.core(), story.clock.timestamp(), ReadMessage(1))
    with story.container.get(Database).transaction():
        log.write(story.agent.id, RuleAnswers([RuleRecord("sample", answer.outcome, answer)]), context)
    expect_value(story.container.get(ReaderRequestNotices).has_recent_notice(story.agent.id, 7, story.clock.timestamp()), True)



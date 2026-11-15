import sqlite3

from unittest.mock import patch

from engine.actor.actor import Actor
from engine.command.context import Context
from engine.database.database import Database
from engine.driver.driver_rules import DriverRules
from engine.journal.journal_home import JournalHome
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.driver.nudge import Nudge
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType
from engine.driver.rule_answer import RuleAnswer
from engine.driver.rule_answers import RuleAnswers
from engine.driver.rule_record import RuleRecord
from engine.registry.registry import Registry
from core.modules.drivers.support.nudge_log import NudgeLog
from core.modules.messages.commands.read_message.read_message import ReadMessage
from core.modules.drivers.models.nudge_record import NudgeRecord
from core.modules.drivers.support.nudge_records import NudgeRecords
from core.modules.processes.support.reader_request_notices import ReaderRequestNotices
from core.modules.processes.nudges.reader_request_nudge import ReaderRequestNudge
from core.modules.processes.nudges.run_name_nudge import RunNameNudge
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import StartedTaskBuilder
from tests.stories.core.support.fixtures import UserJoined
from engine.testing.expectations.expect_row import expect_row
from tests.stories.support.story_checks import expect_answers, expect_outcome_with, expect_value, expect_value_with



def test_module_sync_registers_every_declared_nudge_under_its_module(played):
    story = played(UserJoined)
    entry = next(entry for entry in story.container.get(Registry).nudges if entry.key == RunNameNudge.declared().key)
    expect_row(entry, module="journal.core.processes", type="steering", text=RunNameNudge.declared().text)


def test_no_two_nudges_share_a_key(played):
    keys = [entry.key for entry in played(UserJoined).container.get(Registry).nudges]
    expect_answers(keys, len(set(keys)))


def test_a_clock_nudge_going_back_to_an_older_text_keeps_one_row_for_that_text(played):
    story = played(StartedTaskBuilder)
    log = story.container.get(NudgeLog)
    context = Context(Actor.core(), story.clock.timestamp(), ReadMessage(1))

    def write(nudge: Nudge) -> None:
        answer = RuleAnswer.with_nudges(nudge)
        with story.container.get(Database).transaction():
            log.write(story.agent.id, RuleAnswers(["lead"], [RuleRecord("sample", "lead", answer.outcome, answer)]), context)

    write(Nudge("sample.clock", NudgeType.STEERING, "first text", turn_limited=False))
    write(Nudge("sample.clock", NudgeType.STEERING, "second text", turn_limited=False))
    write(Nudge("sample.clock", NudgeType.STEERING, "first text", interval=Interval(Seconds(60)), turn_limited=False))
    rows = story.story_rows(NudgeRecord, session_agent_id=story.agent.id, key="sample.clock")
    expect_delivery_count(rows, [("first text", 2), ("second text", 1)])


def expect_delivery_count(rows, expected) -> None:
    actual = sorted(((row.text, row.delivery_count) for row in rows))
    assert actual == expected, actual


def expect_turn_limited_nudge(declared, expected) -> None:
    actual = declared.nudge().turn_limited
    assert actual is expected, actual


def expect_item_nudge_type(expected) -> None:
    actual = [item.value for item in NudgeType]
    assert actual == expected, actual


def expect_nudge(nudge, expected) -> None:
    actual = len(nudge.text)
    assert actual == expected, actual


def expect_endswith_nudge(nudge, text) -> None:
    actual = nudge.text.endswith(text)
    assert actual, actual


def test_many_nudges_read_records_together(played):
    story = played(StartedTaskBuilder)
    log = story.container.get(NudgeLog)
    database = story.container.get(Database)
    nudges = [Nudge(f"sample.{number}", NudgeType.STEERING, f"Line {number}") for number in range(12)]
    answer = RuleAnswer.with_nudges(*nudges)
    answers = RuleAnswers(["lead"], [RuleRecord("sample", "lead", answer.outcome, answer)])
    context = Context(Actor.core(), story.clock.timestamp(), ReadMessage(1))
    with patch.object(database, "rows", wraps=database.rows) as reads:
        log.skipped_lines(story.agent.id, answers, context.timestamp)
        with database.transaction():
            log.write(story.agent.id, answers, context)
    record_reads = [call for call in reads.call_args_list if "SELECT * FROM nudge_records" in call.args[0].sql]
    expect_value(len(record_reads), 1)


def test_a_hook_reads_only_the_records_of_its_own_lines(played):
    story = played(StartedTaskBuilder)
    log = story.container.get(NudgeLog)
    remaining_nudges = [Nudge(f"sample.other.{number}", NudgeType.STEERING, f"Line {number}") for number in range(30)]
    selected_nudge = Nudge("sample.own", NudgeType.STEERING, "Own line")
    answer = RuleAnswer.with_nudges(*remaining_nudges, selected_nudge)
    context = Context(Actor.core(), story.clock.timestamp(), ReadMessage(1))
    with story.container.get(Database).transaction():
        log.write(story.agent.id, RuleAnswers(["lead"], [RuleRecord("sample", "lead", answer.outcome, answer)]), context)
    rows = story.container.get(NudgeRecords).nudge_rows(story.agent.id, [selected_nudge])
    expect_value([row.key for row in rows], ["sample.own"])


def test_a_line_on_a_clock_finds_its_newest_record_though_its_text_changed(played):
    story = played(StartedTaskBuilder)
    log = story.container.get(NudgeLog)
    interval = Interval(Seconds(300))
    first = Nudge("sample.clock", NudgeType.STEERING, "Used 10", interval=interval)
    changed = Nudge("sample.clock", NudgeType.STEERING, "Used 20", interval=interval)
    answer = RuleAnswer.with_nudges(first)
    context = Context(Actor.core(), story.clock.timestamp(), ReadMessage(1))
    with story.container.get(Database).transaction():
        log.write(story.agent.id, RuleAnswers(["lead"], [RuleRecord("sample", "lead", answer.outcome, answer)]), context)
    rows = story.container.get(NudgeRecords).nudge_rows(story.agent.id, [changed])
    expect_value([row.text for row in rows], ["Used 10"])


def test_a_reader_request_notice_sees_its_last_reminder(played):
    story = played(StartedTaskBuilder)
    log = story.container.get(NudgeLog)
    answer = RuleAnswer.with_nudges(Nudge(f"{ReaderRequestNudge.declared().key}.7", NudgeType.STEERING, "Add a reader"))
    context = Context(Actor.core(), story.clock.timestamp(), ReadMessage(1))
    with story.container.get(Database).transaction():
        log.write(story.agent.id, RuleAnswers(["lead"], [RuleRecord("sample", "lead", answer.outcome, answer)]), context)
    expect_value(story.container.get(ReaderRequestNotices).has_recent_notice(story.agent.id, 7, story.clock.timestamp()), True)


def test_a_hooks_rules_are_asked_with_no_write_lock_held(played, monkeypatch):
    story = played(StartedTaskBuilder)
    database, transaction_states = story.container.get(Database), []
    first_request = DriverRules.ask

    def ask_with_lock_check(rules, hook):
        connection = sqlite3.connect(story.container.get(JournalHome).database, timeout=0, autocommit=True)
        connection.execute("BEGIN IMMEDIATE")
        connection.execute("ROLLBACK")
        connection.close()
        transaction_states.append(database.has_transaction)
        return first_request(rules, hook)
    monkeypatch.setattr(DriverRules, "ask", ask_with_lock_check)
    story.expect_hook_allowed("s-1", HookSamples.edit("a.py"))
    expect_value(transaction_states, [False])

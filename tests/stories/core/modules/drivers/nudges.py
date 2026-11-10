import sqlite3

from unittest.mock import patch

from engine.actor.actor import Actor
from engine.command.context import Context
from engine.database.database import Database
from core.base.driver.driver_rules import DriverRules
from engine.journal.journal_home import JournalHome
from core.base.driver.interval import Interval
from core.base.driver.seconds import Seconds
from core.base.driver.nudge import Nudge
from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.rule_answers import RuleAnswers
from core.base.driver.rule_record import RuleRecord
from engine.query.queries import Queries
from core.base.registry.registry import Registry
from core.modules.drivers.support.nudge_log import NudgeLog
from core.modules.messages.commands.read_message.read_message import ReadMessage
from core.modules.drivers.models.nudge_record import NudgeRecord
from core.modules.drivers.support.nudge_records import NudgeRecords
from core.modules.processes.support.reader_request_notices import ReaderRequestNotices
from core.modules.processes.support.process_nudges import READER_REQUEST, RUN_NAME
from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import StartedTaskBuilder
from tests.stories.core.support.fixtures import UserJoined
from core.testing.expect_row import expect_row
from tests.stories.support.story_checks import expect_answers, expect_outcome_with, expect_value, expect_value_with


def test_a_declared_nudge_fills_its_fields_and_keeps_its_key_and_type():
    nudge = NudgeDeclaration("shop.total", NudgeType.STEERING, "the total is {total}").nudge(total=12)
    expect_row(nudge, key="shop.total", type=NudgeType.STEERING, text="the total is 12", labelled="journal: the total is 12")


def test_a_nudge_longer_than_its_longest_is_cut_in_its_middle_so_its_end_stays():
    nudge = NudgeDeclaration("shop.long", NudgeType.STEERING, "{text} {other} do this").nudge(text="x" * 70, other="y" * 70)
    expect_nudge(nudge, 120)
    expect_endswith_nudge(nudge, "do this")
    expect_outcome_with(nudge, "…")


def test_a_steering_line_and_a_refusal_are_cut_at_120_characters_and_only_info_may_be_longer():
    template = "{text} " + "w" * 700
    lengths = {nudge_type: len(NudgeDeclaration("shop.kind", nudge_type, template).nudge(text="x").text) for nudge_type in NudgeType}
    expect_value(lengths, {NudgeType.NOTICE: 702, NudgeType.STEERING: 120, NudgeType.REFUSAL: 120, NudgeType.SAFETY_REFUSAL: 120})


def test_each_type_can_be_declared():
    expect_item_nudge_type(["info", "steering", "refusal", "safety_refusal"])


def test_module_sync_registers_every_declared_nudge_under_its_module(new_story):
    story = new_story(fixture=UserJoined)
    entry = next(entry for entry in story.container.get(Registry).nudges if entry.key == RUN_NAME.key)
    expect_row(entry, module="journal.core.processes", type="steering", text=RUN_NAME.text)


def test_no_two_nudges_share_a_key(new_story):
    keys = [entry.key for entry in new_story(fixture=UserJoined).container.get(Registry).nudges]
    expect_answers(keys, len(set(keys)))


def test_a_reminder_on_a_clock_is_said_again_in_the_same_turn():
    declared = NudgeDeclaration("shop.reminder", NudgeType.STEERING, "check the cart", turn_limited=False)
    expect_turn_limited_nudge(declared, False)


def test_a_clock_nudge_going_back_to_an_older_text_keeps_one_row_for_that_text(new_story):
    story = new_story(fixture=StartedTaskBuilder)
    log = story.container.get(NudgeLog)
    context = Context(Actor.core(), story.clock.timestamp(), ReadMessage(1))

    def write(nudge: Nudge) -> None:
        answer = RuleAnswer.with_nudges(nudge)
        with story.container.get(Database).transaction():
            log.write(story.agent.id, RuleAnswers(["lead"], [RuleRecord("sample", "lead", answer.outcome, answer)]), context)

    write(Nudge("sample.clock", NudgeType.STEERING, "first text", turn_limited=False))
    write(Nudge("sample.clock", NudgeType.STEERING, "second text", turn_limited=False))
    write(Nudge("sample.clock", NudgeType.STEERING, "first text", interval=Interval(Seconds(60)), turn_limited=False))
    rows = story.container.get(Queries).query(NudgeRecord).filter(session_agent_id=story.agent.id, key="sample.clock").all_rows()
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


def test_many_nudges_read_records_together(new_story):
    story = new_story(fixture=StartedTaskBuilder)
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


def test_a_hook_reads_only_the_records_of_its_own_lines(new_story):
    story = new_story(fixture=StartedTaskBuilder)
    log = story.container.get(NudgeLog)
    remaining_nudges = [Nudge(f"sample.other.{number}", NudgeType.STEERING, f"Line {number}") for number in range(30)]
    selected_nudge = Nudge("sample.own", NudgeType.STEERING, "Own line")
    answer = RuleAnswer.with_nudges(*remaining_nudges, selected_nudge)
    context = Context(Actor.core(), story.clock.timestamp(), ReadMessage(1))
    with story.container.get(Database).transaction():
        log.write(story.agent.id, RuleAnswers(["lead"], [RuleRecord("sample", "lead", answer.outcome, answer)]), context)
    rows = story.container.get(NudgeRecords).nudge_rows(story.agent.id, [selected_nudge])
    expect_value([row.key for row in rows], ["sample.own"])


def test_a_line_on_a_clock_finds_its_newest_record_though_its_text_changed(new_story):
    story = new_story(fixture=StartedTaskBuilder)
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


def test_a_reader_request_notice_sees_its_last_reminder(new_story):
    story = new_story(fixture=StartedTaskBuilder)
    log = story.container.get(NudgeLog)
    answer = RuleAnswer.with_nudges(Nudge(f"{READER_REQUEST.key}.7", NudgeType.STEERING, "Add a reader"))
    context = Context(Actor.core(), story.clock.timestamp(), ReadMessage(1))
    with story.container.get(Database).transaction():
        log.write(story.agent.id, RuleAnswers(["lead"], [RuleRecord("sample", "lead", answer.outcome, answer)]), context)
    expect_value(story.container.get(ReaderRequestNotices).has_recent_notice(story.agent.id, 7, story.clock.timestamp()), True)


def test_a_hooks_rules_are_asked_with_no_write_lock_held(new_story, monkeypatch):
    story = new_story(fixture=StartedTaskBuilder)
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

import json

from datetime import timedelta

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.command.context import Context
from core.base.database.database import Database
from core.base.driver.command_category import CommandCategory
from core.base.driver.interval import Interval
from core.base.driver.seconds import Seconds
from core.base.driver.nudge import Nudge
from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.rule_answers import RuleAnswers
from core.base.driver.rule_record import RuleRecord
from core.base.query.queries import Queries
from core.base.registry.registry import Registry
from core.modules.drivers.commands.support.nudge_log import NudgeLog
from core.modules.messages.commands.read_message.read_message import ReadMessage
from core.modules.drivers.models.nudge_record import NudgeRecord
from core.modules.processes.support.process_nudges import RUN_NAME
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.base.driver.support.fixtures import SampleSuiteChoice
from tests.stories.core.support.coding_fixtures import BuilderWithStartedTask
from tests.stories.core.base.driver.support.hook_agents import hook_agent
from tests.stories.core.base.driver.support.samples import SAMPLES
from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.fixtures import UserJoined
from core.testing.expect_row import expect_row
from tests.stories.support.story_checks import expect_answers, expect_outcome_with, expect_value, expect_value_with


def test_a_declared_nudge_fills_its_fields_and_keeps_its_key_and_type():
    nudge = NudgeDeclaration("shop.total", NudgeType.STEERING, "the total is {total}").nudge(total=12)
    expect_row(nudge, key="shop.total", type=NudgeType.STEERING, text="the total is 12", labelled="journal: the total is 12")


def test_a_nudge_longer_than_its_longest_is_cut_in_its_middle_so_its_end_stays():
    nudge = NudgeDeclaration("shop.long", NudgeType.STEERING, "{text} do this {other}").nudge(text="x" * 50, other="y" * 50)
    expect_nudge(nudge, 120)
    expect_endswith_nudge(nudge, "do this")
    expect_outcome_with(nudge, "…")


def test_a_steering_line_and_a_refusal_are_cut_at_120_characters_and_only_info_may_be_longer():
    template = "{text} " + "w" * 700
    lengths = {nudge_type: len(NudgeDeclaration("shop.kind", nudge_type, template).nudge(text="x").text) for nudge_type in NudgeType}
    expect_value(lengths, {NudgeType.NOTICE: 702, NudgeType.STEERING: 120, NudgeType.REFUSAL: 120})


def test_each_type_can_be_declared():
    expect_item_nudge_type(["info", "steering", "refusal"])


def test_module_sync_registers_every_declared_nudge_under_its_module(new_story):
    story = new_story(fixture=UserJoined)
    entry = next(entry for entry in story.container.get(Registry).nudges if entry.key == RUN_NAME.key)
    expect_row(entry, module="journal.core.processes", type="steering", text=RUN_NAME.text)


def test_no_two_nudges_share_a_key(new_story):
    keys = [entry.key for entry in new_story(fixture=UserJoined).container.get(Registry).nudges]
    expect_answers(keys, len(set(keys)))


def test_the_window_lists_every_nudge_with_how_often_it_was_said(new_story):
    story = new_story(fixture=UserJoined)
    window = WindowStory(story)
    window.expect_window_allowed("drivers.nudges", "nudge list")
    rows = json.loads(story.run("nudge list --json", actor=story.user).output_text)["rows"]
    expect_value_with(rows, {"id": RUN_NAME.key, "key": RUN_NAME.key, "module": "journal.core.processes", "type": "steering", "text": RUN_NAME.text, "repeat_seconds": 0, "delivery_count": 0, "last_delivered_at": ""})


def test_a_reminder_on_a_clock_is_said_again_in_the_same_turn():
    declared = NudgeDeclaration("shop.reminder", NudgeType.STEERING, "check the cart", turn_limited=False)
    expect_turn_limited_nudge(declared, False)


def test_a_clock_nudge_going_back_to_an_older_text_keeps_one_row_for_that_text(new_story):
    story = new_story(fixture=BuilderWithStartedTask)
    log = story.container.get(NudgeLog)
    context = Context(Actor.core(), story.clock.timestamp(), ReadMessage(1))

    def write(nudge: Nudge) -> None:
        answer = RuleAnswer.with_nudges(nudge)
        with story.container.get(Database).transaction():
            log.write(story.agent.id, RuleAnswers(["lead"], [RuleRecord("sample", "lead", answer.outcome, answer)]), context)

    write(Nudge("sample.clock", NudgeType.STEERING, "first text", turn_limited=False))
    write(Nudge("sample.clock", NudgeType.STEERING, "second text", turn_limited=False))
    write(Nudge("sample.clock", NudgeType.STEERING, "first text", interval=Interval(Seconds(60)), turn_limited=False))
    rows = story.container.get(Queries).query(NudgeRecord).filter(agent_id=story.agent.id, key="sample.clock").all_rows()
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

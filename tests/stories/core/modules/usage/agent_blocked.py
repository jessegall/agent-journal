import json
from datetime import timedelta

from core.base.actor import Actor
from core.base.command.bus import Bus
from core.base.driver.block_until import BlockUntil
from core.base.driver.conditions.ran_command import RanCommand
from core.base.driver.nudge import Nudge
from core.base.driver.nudge_type import NudgeType
from core.modules.drivers.support.driver_settings import BLOCK_CARD_SECONDS
from tests.stories.core.base.driver.support.fixtures import LeadStarted
from tests.stories.core.base.driver.support.samples import SAMPLES
from tests.stories.core.support.coding_fixtures import BuilderWithStartedTask

HOLD_LINE = "read the task first"
CARD = "usage agents --environment main --json"


def held_story(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    story.container.get(Bus).run(BlockUntil(story.agent.id, Nudge("samples.wait", NudgeType.REFUSAL, HOLD_LINE), RanCommand("journal overview")), Actor.core())
    return story


def card_of(story):
    return next(row for row in json.loads(story.run(CARD, actor=story.user).output_text)["rows"] if row["id"] == story.agent.id)


def test_a_hold_that_just_began_does_not_make_the_card_blocked(new_story):
    story = held_story(new_story)
    story.expect_rows(card_of(story)["state"] == "", card_of(story)["blocked_reason"] == "")


def test_a_hold_that_lasted_past_the_setting_makes_the_card_blocked_with_the_reason(new_story):
    story = held_story(new_story)
    story.advance(timedelta(seconds=121))
    story.expect_rows(card_of(story)["state"] == "blocked", HOLD_LINE in card_of(story)["blocked_reason"])


def test_the_setting_moves_when_a_hold_counts_as_blocked(new_story):
    story = held_story(new_story)
    story.expect_success(f"setting set {BLOCK_CARD_SECONDS} 10 --project", actor=story.user)
    story.advance(timedelta(seconds=11))
    story.expect_rows(card_of(story)["state"] == "blocked")


def test_an_agent_whose_task_is_blocked_shows_blocked_at_once_and_not_after_it_ends(new_story):
    story = new_story(fixture=BuilderWithStartedTask)
    story.expect_success('task block 1 --reason "waiting for the price list"', actor=story.agent)
    story.expect_rows(card_of(story)["state"] == "blocked", card_of(story)["blocked_reason"] == "its task is blocked")
    story.expect_success(f"agent end {story.agent.id}", actor=story.user)
    ended = next(row for row in json.loads(story.run(f"{CARD.replace('--json', '--closed --json')}", actor=story.user).output_text)["rows"] if row["id"] == story.agent.id)
    story.expect_rows(ended["state"] == "", ended["blocked_reason"] == "")

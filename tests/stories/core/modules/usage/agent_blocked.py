import json
from datetime import timedelta

from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.driver.block_until import BlockUntil
from engine.driver.conditions.ran_command import RanCommand
from engine.driver.nudge import Nudge
from engine.driver.nudge_type import NudgeType
from core.modules.drivers.support.driver_settings import BLOCK_CARD_SECONDS
from tests.stories.engine.driver.support.fixtures import LeadStarted
from tests.stories.engine.driver.support.samples import SAMPLES
from tests.stories.core.support.coding_fixtures import StartedTaskBuilder
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment

REFUSAL_TEXT = "read the task first"
CARD = "usage agents --environment main --json"


def story_with_refusing_block(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    story.container.get(Bus).run(BlockUntil(story.agent.id, Nudge("samples.wait", NudgeType.REFUSAL, REFUSAL_TEXT), RanCommand("journal overview")), Actor.core())
    return story


def read_card(story):
    return next(row for row in json.loads(story.run(CARD, actor=story.user).output_text)["rows"] if row["id"] == story.agent.id)


def test_a_hold_that_just_began_does_not_make_the_card_blocked(new_story):
    story = story_with_refusing_block(new_story)
    story.expect_rows(read_card(story)["state"] == "", read_card(story)["blocked_reason"] == "")


def test_a_hold_that_lasted_past_the_setting_makes_the_card_blocked_with_the_reason(new_story):
    story = story_with_refusing_block(new_story)
    story.advance(timedelta(seconds=121))
    story.expect_rows(read_card(story)["state"] == "blocked", REFUSAL_TEXT in read_card(story)["blocked_reason"])


def test_the_setting_moves_when_a_hold_counts_as_blocked(new_story):
    story = story_with_refusing_block(new_story)
    story.expect_success(f"setting set {BLOCK_CARD_SECONDS} 10 --project", actor=story.user)
    story.advance(timedelta(seconds=11))
    story.expect_rows(read_card(story)["state"] == "blocked")


def test_an_agent_whose_task_is_blocked_shows_blocked_at_once_and_not_after_it_ends(new_story):
    story = new_story(fixture=StartedTaskBuilder)
    story.expect_success('task block 1 --reason "waiting for the price list"', actor=story.agent)
    story.expect_rows(read_card(story)["state"] == "blocked", read_card(story)["blocked_reason"] == "its task is blocked")
    story.expect_success(f"agent end {story.agent.id}", actor=story.user)
    closed_card = next(row for row in json.loads(story.run(f"{CARD.replace('--json', '--closed --json')}", actor=story.user).output_text)["rows"] if row["id"] == story.agent.id)
    story.expect_rows(closed_card["state"] == "", closed_card["blocked_reason"] == "")


def test_a_worker_with_a_started_task_does_not_show_a_hook_hold_as_a_block(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    UserJoined().steps(story)
    repository_environment(story)
    worker = dispatched_worker(story)
    story.container.get(Bus).run(BlockUntil(worker.id, Nudge("samples.wait", NudgeType.REFUSAL, REFUSAL_TEXT), RanCommand("journal overview")), Actor.core())
    story.advance(timedelta(seconds=121))
    rows = json.loads(story.run(CARD, actor=story.user).output_text)["rows"]
    card = next(row for row in rows if row["id"] == worker.id)
    story.expect_rows(card["state"] != "blocked", card["blocked_reason"] == "")

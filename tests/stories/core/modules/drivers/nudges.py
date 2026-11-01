import json

from datetime import timedelta

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.driver.command_category import CommandCategory
from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType
from core.base.registry.registry import Registry
from core.modules.processes.support.process_nudges import UNREAD_OUTPUT
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.base.driver.support.fixtures import SampleSuiteChoice
from tests.stories.core.base.driver.support.hook_agents import hook_agent
from tests.stories.core.base.driver.support.samples import SAMPLES
from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.fixtures import UserJoined


def test_a_declared_nudge_fills_its_fields_and_keeps_its_key_and_type():
    nudge = NudgeDeclaration("shop.total", NudgeType.REMARK, "the total is {total}").nudge(total=12)
    assert (nudge.key, nudge.type, nudge.text, nudge.labelled) == ("shop.total", NudgeType.REMARK, "the total is 12", "remark: the total is 12")


def test_a_nudge_longer_than_its_longest_is_cut_in_its_middle_so_its_end_stays():
    nudge = NudgeDeclaration("shop.long", NudgeType.INSTRUCTION, "{text} do this", longest_characters=30).nudge(text="x" * 50)
    assert len(nudge.text) == 30 and nudge.text.endswith("do this") and "…" in nudge.text


def test_each_type_can_be_declared():
    assert [item.value for item in NudgeType] == ["instruction", "remark", "refusal"]


def test_module_sync_registers_every_declared_nudge_under_its_module(new_story):
    story = new_story(fixture=UserJoined)
    entry = next(entry for entry in story.container.get(Registry).nudges if entry.key == UNREAD_OUTPUT.key)
    assert (entry.module, entry.type, entry.text) == ("journal.core.processes", "instruction", UNREAD_OUTPUT.text)


def test_no_two_nudges_share_a_key(new_story):
    keys = [entry.key for entry in new_story(fixture=UserJoined).container.get(Registry).nudges]
    assert len(keys) == len(set(keys))


def test_the_window_lists_every_nudge_with_how_often_it_was_said(new_story):
    story = new_story(fixture=UserJoined)
    window = WindowStory(story)
    window.expect_window_allowed("drivers.nudges", "nudge list")
    rows = json.loads(story.run("nudge list --json", actor=story.user).output_text)["rows"]
    assert {"id": UNREAD_OUTPUT.key, "key": UNREAD_OUTPUT.key, "module": "journal.core.processes", "type": "instruction", "text": UNREAD_OUTPUT.text, "repeat_seconds": 0, "said_count": 0, "last_said_at": ""} in rows


def test_a_reminder_on_a_clock_is_said_again_in_the_same_turn():
    declared = NudgeDeclaration("shop.reminder", NudgeType.INSTRUCTION, "check the cart", once_per_turn=False)
    assert declared.nudge().once_per_turn is False

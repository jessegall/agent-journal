from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.modules.triggers.support.trigger_settings import AGENTS_ENABLE_SETTING
from core.modules.triggers.support.trigger_nudges import TRIGGER_LINE as TRIGGER_FIRED
from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import BuilderWithUser

TRIGGER_LINE = 'trigger make "deploy" "Check the release notes" --environment main'
PROMPT = HookSamples.prompt("We deploy now")
TRIGGER_TEXT = TRIGGER_FIRED.nudge(trigger=1).text


def prompt_lines(story) -> list[str]:
    return list(story.hook("s-1", PROMPT).lines)


def test_an_agents_trigger_stays_quiet_until_the_user_enables_it(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_success(TRIGGER_LINE, actor=story.agent)
    expect_absent_prompt_lines(story, TRIGGER_TEXT)
    story.expect_success("trigger enable 1", actor=story.user)
    expect_prompt_lines(story, TRIGGER_TEXT)


def test_a_trigger_the_user_makes_is_on_at_once(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_success(TRIGGER_LINE, actor=story.user)
    expect_prompt_lines(story, TRIGGER_TEXT)


def test_an_agent_cannot_enable_a_trigger(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.run(TRIGGER_LINE, actor=story.agent)
    story.expect_refusal("trigger enable 1 --reason needed", "A person was asked in the dock", actor=story.agent)


def test_an_agent_cannot_change_what_an_enabled_trigger_does(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.run(TRIGGER_LINE, actor=story.user)
    story.expect_refusal('trigger edit 1 --text "Do something else" --reason needed', "A person was asked in the dock", actor=story.agent)


def test_the_setting_lets_an_agents_trigger_act_at_once(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_success(f"setting set {AGENTS_ENABLE_SETTING} true --project", actor=story.user)
    story.expect_success(TRIGGER_LINE, actor=story.agent)
    expect_prompt_lines(story, TRIGGER_TEXT)


def test_an_agents_trigger_shows_in_the_main_chat_until_it_is_removed(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.run(TRIGGER_LINE, actor=story.agent)
    story.run_listeners()
    story.expect_text("chat-mark main --environment main", "waits for you")
    story.expect_success("trigger strike 1 --environment main", actor=story.agent)
    story.run_listeners()
    story.expect_text("chat-mark main --environment main", "Trigger removed")
    story.expect_absent("chat-mark main --environment main", "waits for you")


def expect_absent_prompt_lines(story, expected) -> None:
    actual = prompt_lines(story)
    assert expected not in actual, actual


def expect_prompt_lines(story, expected) -> None:
    actual = prompt_lines(story)
    assert expected in actual, actual

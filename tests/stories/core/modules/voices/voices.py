import json

from core.testing.hook_samples import HookSamples
from tests.stories.core.base.driver.support.hook_agents import hook_agent
from tests.stories.core.support.coding_fixtures import BuilderWithUser
from core.testing.expect_row import expect_row

RESUME = HookSamples.session_start().with_raw({"source": "resume"})
SECOND_START = HookSamples.session_start().with_fields(session="s-2")
COMPACTION = HookSamples.sample("compact")
BUTLER_TEXT = "Talk like a good butler"
TALK_LIKE = "talk to the user like this: "


def given_names(story) -> None:
    story.expect_success('voice address --title Captain --name Ada', actor=story.user)


def voice_lines(story, agent_id: int) -> list[str]:
    text = story.run(f"agent-line list --agent {agent_id} --oldest", actor=story.user).output_text
    return [line for line in text.splitlines() if TALK_LIKE in line]


def test_the_five_voices_are_listed_with_the_butler_chosen_and_what_each_would_say(new_story):
    story = new_story(fixture=BuilderWithUser)
    given_names(story)
    text = story.run("voice list", actor=story.user).output_text
    names = [line[2:].split()[0] for line in text.splitlines()]
    assert names == ["butler", "homie", "colleague", "coach", "squire"]
    assert text.splitlines()[0].startswith("* butler")
    assert "The fix is in, Captain Ada, and all 214 tests pass." in text
    assert "Yep, it's in, Ada." in text
    assert "Onwards, my liege!" in text


def test_the_user_chooses_a_voice_and_the_list_marks_it(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_success("voice choose coach", "voice: coach", actor=story.user)
    assert story.run("voice list", actor=story.user).output_text.splitlines()[3].startswith("* coach")


def test_an_agent_chooses_the_voice_and_says_what_to_call_the_user(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_success("voice choose homie", actor=story.agent)
    story.expect_success("voice address --title Madam --name Ada", "the agent calls you Ada", actor=story.agent)


def test_the_voice_is_refused_a_name_the_catalogue_does_not_hold(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_usage_error("voice choose pirate", actor=story.user)


def test_address_says_how_the_chosen_voice_calls_the_user_and_each_voice_calls_in_its_own_way(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_text("voice address --title Captain --name Ada", "the agent calls you Captain Ada", actor=story.user)
    story.run("voice choose homie", actor=story.user)
    story.expect_text("voice address", "the agent calls you Ada", actor=story.user)
    story.run("voice choose colleague", actor=story.user)
    story.expect_text("voice address", "the agent calls you nothing", actor=story.user)
    story.run("voice choose squire", actor=story.user)
    story.expect_text("voice address", "the agent calls you my liege", actor=story.user)


def test_show_prints_the_instruction_the_agent_is_given(new_story):
    story = new_story(fixture=BuilderWithUser)
    given_names(story)
    text = story.run("voice show", actor=story.user)
    text.expect_text(BUTLER_TEXT)
    text.expect_text('Address me as "Captain Ada".')
    text.expect_text("Keep the normal names of agents, tasks and environments")


def enabled_story(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_success("setting set journal.core.voices.talk-in-voice on --project", actor=story.user)
    return story


def test_with_talking_in_the_voice_off_an_agent_is_told_no_voice(new_story):
    story = new_story(fixture=BuilderWithUser)
    second = hook_agent(story, story.hook("s-2", SECOND_START))
    story.expect_rows(voice_lines(story, story.agent.id) == [], voice_lines(story, second.id) == [])


def test_a_session_started_by_hand_gives_the_instruction_and_no_introduction(new_story):
    story = enabled_story(new_story)
    given_names(story)
    second = hook_agent(story, story.hook("s-2", SECOND_START))
    [line] = voice_lines(story, second.id)
    assert BUTLER_TEXT in line and 'Address me as "Captain Ada".' in line and "introduce yourself in the chat" not in line, line


def test_a_resume_is_told_nothing_more_since_its_conversation_holds_the_voice(new_story):
    story = enabled_story(new_story)
    story.hook("s-1", RESUME)
    story.expect_rows(voice_lines(story, story.agent.id) == [])


def test_a_compaction_tells_the_voice_again_without_the_introduction(new_story):
    story = enabled_story(new_story)
    story.hook("s-1", COMPACTION)
    repeated = voice_lines(story, story.agent.id)
    assert len(repeated) == 1 and BUTLER_TEXT in repeated[0] and "introduce yourself" not in repeated[0], repeated


def test_changing_the_voice_tells_the_running_main_agent_the_new_voice(new_story):
    story = enabled_story(new_story)
    story.expect_success("voice choose squire", actor=story.user)
    line = voice_lines(story, story.agent.id)[-1]
    assert "from now on talk to the user like this: Talk like a loyal squire" in line
    assert "say nothing of the change" in line


def test_changing_the_name_the_voice_uses_tells_the_agent_as_well(new_story):
    story = enabled_story(new_story)
    story.expect_success("voice address --name Grace", actor=story.user)
    assert 'Address me as "Sir Grace".' in voice_lines(story, story.agent.id)[-1]


def test_the_figure_settings_start_as_version_four_had_them_and_the_list_carries_them_as_data(new_story):
    story = new_story(fixture=BuilderWithUser)
    answer = json.loads(story.run("voice list --json", actor=story.user).output_text)
    expect_row(answer, profile="butler")
    expect_row(answer, avatar=True)
    expect_row(answer, avatar_shown="always")
    assert [voice["name"] for voice in answer["voices"]] == ["butler", "homie", "colleague", "coach", "squire"]
    story.expect_success("setting set journal.core.voices.avatar-shown working --project", actor=story.user)
    story.expect_success("setting set journal.core.voices.avatar off --project", actor=story.user)
    answer = json.loads(story.run("voice list --json", actor=story.user).output_text)
    expect_row(answer, avatar=False)
    expect_row(answer, avatar_shown="working")

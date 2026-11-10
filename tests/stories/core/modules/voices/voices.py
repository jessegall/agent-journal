import json

from engine.testing.examples.hook_samples import HookSamples
from tests.stories.engine.driver.support.hook_agents import hook_agent
from tests.stories.core.support.coding_fixtures import UserBuilder
from engine.testing.expectations.expect_row import expect_row
from tests.stories.support.story_checks import expect_answers, expect_lines_with, expect_value, expect_value_with, expect_value_without

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
    story = new_story(fixture=UserBuilder)
    given_names(story)
    text = story.run("voice list", actor=story.user).output_text
    names = [line[2:].split()[0] for line in text.splitlines()]
    expect_value(names, ["butler", "homie", "colleague", "coach", "squire"])
    expect_startswith(text, "* butler")
    expect_value_with(text, "The fix is in, Captain Ada, and all 214 tests pass.")
    expect_value_with(text, "Yep, it's in, Ada.")
    expect_value_with(text, "Onwards, my liege!")


def test_the_user_chooses_a_voice_and_the_list_marks_it(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_success("voice choose coach", "voice: coach", actor=story.user)
    expect_startswith_output(story, "voice list", "* coach")


def test_an_agent_chooses_the_voice_and_says_what_to_call_the_user(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_success("voice choose homie", actor=story.agent)
    story.expect_success("voice address --title Madam --name Ada", "the agent calls you Ada", actor=story.agent)


def test_the_voice_is_refused_a_name_the_catalogue_does_not_hold(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_usage_error("voice choose pirate", actor=story.user)


def test_address_says_how_the_chosen_voice_calls_the_user_and_each_voice_calls_in_its_own_way(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_text("voice address --title Captain --name Ada", "the agent calls you Captain Ada", actor=story.user)
    story.run("voice choose homie", actor=story.user)
    story.expect_text("voice address", "the agent calls you Ada", actor=story.user)
    story.run("voice choose colleague", actor=story.user)
    story.expect_text("voice address", "the agent calls you nothing", actor=story.user)
    story.run("voice choose squire", actor=story.user)
    story.expect_text("voice address", "the agent calls you my liege", actor=story.user)


def test_show_prints_the_instruction_the_agent_is_given(new_story):
    story = new_story(fixture=UserBuilder)
    given_names(story)
    text = story.run("voice show", actor=story.user)
    text.expect_text(BUTLER_TEXT)
    text.expect_text('Address me as "Captain Ada".')
    text.expect_text("Keep the normal names of agents, tasks and environments")


def enabled_story(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_success("setting set journal.core.voices.talk-in-voice on --project", actor=story.user)
    return story


def test_with_talking_in_the_voice_off_an_agent_is_told_no_voice(new_story):
    story = new_story(fixture=UserBuilder)
    second = hook_agent(story, story.hook("s-2", SECOND_START))
    story.expect_rows(voice_lines(story, story.agent.id) == [], voice_lines(story, second.id) == [])


def test_a_session_started_by_hand_gives_the_instruction_and_no_introduction(new_story):
    story = enabled_story(new_story)
    given_names(story)
    second = hook_agent(story, story.hook("s-2", SECOND_START))
    line = voice_lines(story, second.id)[-1]
    expect_value_with(line, BUTLER_TEXT)
    expect_value_with(line, 'Address me as "Captain Ada".')
    expect_value_without(line, "introduce yourself in the chat")


def test_a_resume_is_told_nothing_more_since_its_conversation_holds_the_voice(new_story):
    story = enabled_story(new_story)
    story.hook("s-1", RESUME)
    story.expect_rows(voice_lines(story, story.agent.id) == [])


def test_a_compaction_tells_the_voice_again_without_the_introduction(new_story):
    story = enabled_story(new_story)
    story.hook("s-1", COMPACTION)
    repeated = voice_lines(story, story.agent.id)
    expect_answers(repeated, 1)
    expect_lines_with(repeated, BUTLER_TEXT)
    expect_repeated_without(repeated, "introduce yourself")


def test_changing_the_voice_tells_the_running_main_agent_the_new_voice(new_story):
    story = enabled_story(new_story)
    story.expect_success("voice choose squire", actor=story.user)
    line = voice_lines(story, story.agent.id)[-1]
    expect_value_with(line, "from now on talk to the user like this: Talk like a loyal squire")
    expect_value_with(line, "say nothing of the change")


def test_changing_the_name_the_voice_uses_tells_the_agent_as_well(new_story):
    story = enabled_story(new_story)
    story.expect_success("voice address --name Grace", actor=story.user)
    expect_voice_lines_with(story, 1, 'Address me as "Sir Grace".')


def test_the_figure_settings_start_as_version_four_had_them_and_the_list_carries_them_as_data(new_story):
    story = new_story(fixture=UserBuilder)
    answer = json.loads(story.run("voice list --json", actor=story.user).output_text)
    expect_row(answer, profile="butler")
    expect_row(answer, avatar=True)
    expect_row(answer, avatar_shown="always")
    expect_voice_voices_answer(answer, ["butler", "homie", "colleague", "coach", "squire"])
    story.expect_success("setting set journal.core.voices.avatar-shown working --project", actor=story.user)
    story.expect_success("setting set journal.core.voices.avatar off --project", actor=story.user)
    answer = json.loads(story.run("voice list --json", actor=story.user).output_text)
    expect_row(answer, avatar=False)
    expect_row(answer, avatar_shown="working")


def expect_voice_voices_answer(answer, expected) -> None:
    actual = [voice['name'] for voice in answer['voices']]
    assert actual == expected, actual


def expect_voice_lines_with(story, number, expected) -> None:
    actual = voice_lines(story, story.agent.id)[-number]
    assert expected in actual, actual


def expect_repeated_without(repeated, expected) -> None:
    actual = repeated[0]
    assert expected not in actual, actual


def expect_startswith_output(story, text, text_2) -> None:
    actual = story.run(text, actor=story.user).output_text.splitlines()[3].startswith(text_2)
    assert actual, actual


def expect_startswith(text, text_2) -> None:
    actual = text.splitlines()[0].startswith(text_2)
    assert actual, actual

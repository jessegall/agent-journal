import pytest

from engine.testing.stories.story_fixture import StoryFixture

from server.booting_work import BootingWork
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.support.story_checks import expect_count_output

TRANSCRIPTION_LINE = 'transcription make "Cart meeting" --text "Ada: the cart rounds twice." --environment main'


class CartTranscription(StoryFixture):
    parent = UserJoined

    def steps(self, story):
        story.run_listeners()
        BootingWork().run(story.container)
        story.run_listeners()
        story.expect_success(TRANSCRIPTION_LINE, actor=story.user)


def transcribed(new_story):
    return new_story(fixture=CartTranscription)


def test_a_pasted_transcription_makes_a_task_linked_to_it_and_tells_the_agent(new_story):
    story = transcribed(new_story)
    story.expect_text("task list --environment main", "Summarize transcript 1: Cart meeting", actor=story.user)
    story.expect_text("link list --source transcription:1", "task", actor=story.user)
    story.expect_text("agent-line list", "transcription:1 has new text", actor=story.user)


def test_a_persons_edit_tells_the_agent_again_and_keeps_the_unfinished_task(new_story):
    story = transcribed(new_story)
    story.expect_success('transcription edit 1 --text "Ada: the cart rounds once."', actor=story.user)
    expect_count_output(story, "task list --environment main", "Summarize transcript", 1)
    expect_count_output(story, "agent-line list", "transcription:1 has new text", 2)


def test_an_edit_after_the_task_is_closed_makes_a_new_one(transcription_task):
    story = transcription_task
    story.run('task close 1 --outcome "summarized"', actor=story.agent)
    story.expect_success('transcription edit 1 --text "Ada: one more thing."', actor=story.user)
    expect_count_output(story, "task list --environment main", "Summarize transcript", 2)


def test_an_agents_own_edit_makes_no_new_line(new_story):
    story = transcribed(new_story)
    story.run('transcription edit 1 --text "Ada: tidied."', actor=story.agent)
    expect_count_output(story, "agent-line list", "transcription:1 has new text", 1)


def test_a_row_made_from_it_stays_linked(new_story):
    story = transcribed(new_story)
    story.expect_success("transcription link 1 doc 3", "linked doc 3 to transcription 1", actor=story.agent)
    story.expect_text("link list --source transcription:1", "doc", actor=story.user)


def test_a_transcription_task_has_the_priority_just_above_high(new_story):
    story = transcribed(new_story)
    story.expect_text("task show 1", "priority: 301", actor=story.user)


def test_starting_a_transcription_task_starts_the_sequence_for_a_transcript(new_story):
    story = transcribed(new_story)
    story.expect_success("task start 1", actor=story.agent)
    story.expect_text("sequence list", "Handle a transcript", actor=story.user)
    story.expect_text("sequence follow", "journal transcription show", actor=story.agent)
    for step_text in ("journal doc make", "journal task make", "journal transcription link", "journal task close"):
        story.expect_text("sequence next", step_text, actor=story.agent)
        story.expect_success("sequence follow", actor=story.agent)
    story.expect_text("sequence next", "ran its last step", actor=story.agent)


def test_a_second_transcription_uses_the_same_sequence(transcription_task):
    story = transcription_task
    story.run("sequence abandon --why done --sure", actor=story.agent)
    story.run('task close 1 --outcome "summarized"', actor=story.agent)
    story.expect_success('transcription make "Second" --text "Ada: more." --environment main', actor=story.user)
    story.expect_success("task start 2", actor=story.agent)
    expect_count_output(story, "sequence list", "Handle a transcript", 1)


def test_another_task_starts_no_sequence(new_story):
    story = new_story(fixture=UserJoined)
    story.run('task make "Other work" --environment main', actor=story.agent)
    story.expect_success("task start 1", actor=story.agent)
    story.expect_no_text("sequence list", "Handle a transcript", actor=story.user)


def test_only_an_installed_server_with_transcripts_can_be_fetched_from(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success("transcription sources", "no installed server has transcriptions", actor=story.user)
    story.expect_refusal("transcription fetch wispr-flow --environment main", "no installed server is named wispr-flow", actor=story.user)
    story.expect_success("mcp install wispr-flow", actor=story.user)
    story.expect_text("transcription sources", "wispr-flow", actor=story.user)
    story.expect_success("transcription fetch wispr-flow --environment main", actor=story.user)
    story.expect_text("task list --environment main", "Fetch transcriptions from Wispr Flow", actor=story.user)
    story.expect_text("agent-line list", "fetch the transcriptions task:1 asks for", actor=story.user)


def test_a_server_without_transcripts_is_refused(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success('mcp add payments "https://mcp.payments.example/sse"', actor=story.user)
    story.expect_refusal("transcription fetch payments --environment main", "payments has no transcriptions to fetch", actor=story.user)


@pytest.fixture
def transcription_task(new_story):
    story = transcribed(new_story)
    story.run("task start 1", actor=story.agent)
    return story

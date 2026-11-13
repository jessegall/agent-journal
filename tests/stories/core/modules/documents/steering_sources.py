import json
import pytest

from engine.testing.examples.hook_samples import HookSamples
from engine.testing.stories.story_fixture import StoryFixture

from tests.stories.core.modules.documents.support.trail_fixtures import feature, scenario, viewer_answer, Scenario, TrailReady
from tests.stories.core.support.agent_labels import agent_number
from core.modules.messages.support.message_nudges import MESSAGE_UPDATED
from engine.testing.expectations.expected_nudge import expected_nudge
from core.modules.questions.support.question_nudges import QUESTION_ANSWERED


class EditedActiveRequest(StoryFixture):
    parent = TrailReady

    def steps(self, story):
        current = Scenario(story)
        current.select()
        current.person("messages.chat", "message", "edit", "2", "--text", "Use integer cents and round once")
        current.tick()
        current.make_task()


class ExplicitEditedRequest(StoryFixture):
    parent = TrailReady

    def steps(self, story):
        current = Scenario(story)
        current.person("messages.chat", "message", "edit", "1", "--text", "Newest correction to the original")
        current.switch(1)
        current.make_task()


def test_a_viewer_answer_saves_no_message_of_the_person(scenario):
    scenario.command('question ask "Which rounding rule?" --context "A story asks this so its card and answer can be checked." --options "Up" "Nearest" --recommend "Nearest"')
    previous = scenario.person("messages.chat", "message", "feed")["rows"]
    scenario.person("questions.questions", "question", "answer", "1", "--answer", "Nearest")
    question = json.loads(scenario.command("question show 1 --json").output_text)
    feature(question["state"] == "answered" and question["answer"] == "Nearest" and question["message_id"] is None, json.dumps(question))
    scenario.story.expect_rows(len(scenario.person("messages.chat", "message", "feed")["rows"]) == len(previous))


def test_an_answered_question_tells_the_agent_once_and_names_no_message(scenario):
    scenario.command('question ask "Which tax?" --context "A story asks this so its card and answer can be checked." --options "Local" "Export"')
    scenario.person("questions.questions", "question", "answer", "1", "--answer", "Local")
    lines = "\n".join(scenario.story.hook("s-1", HookSamples.prompt("go on")).lines)
    scenario.story.expect_rows(lines.count(QUESTION_ANSWERED.nudge(question=1).text) == 1, "answer source" not in lines, detail=lines)


def test_answer_notification_does_not_replace_active_request(scenario):
    scenario.select()
    scenario.command('question ask "Keep discount?" --context "A story asks this so its card and answer can be checked." --options "Yes" "No"')
    scenario.person("questions.questions", "question", "answer", "1", "--answer", "Yes")
    scenario.tick()
    scenario.make_task()
    scenario.expect_link("message:2", "task:2", "about")


def test_updated_active_request_keeps_source_identity(new_story):
    scenario = Scenario(new_story(fixture=EditedActiveRequest))
    scenario.expect_link("message:2", "task:2", "about")
    scenario.story.expect_rows("round once" in scenario.command("message show 2").output_text)


def test_showing_an_older_update_does_not_switch_source(scenario):
    scenario.select()
    scenario.select(1)
    scenario.person("messages.chat", "message", "edit", "1", "--text", "An older unrelated correction")
    scenario.command("message show 1")
    scenario.make_task()
    scenario.expect_link("message:2", "task:2", "about")
    scenario.expect_no_link("message:1", "task:2")


def test_explicit_selection_uses_latest_edited_request(new_story):
    scenario = Scenario(new_story(fixture=ExplicitEditedRequest))
    scenario.expect_link("message:1", "task:2", "about")
    scenario.command("message read 1")
    scenario.story.expect_rows("Newest correction" in scenario.command("message show 1").output_text)


def test_context_reads_the_latest_active_request_text(new_story):
    scenario = Scenario(new_story(fixture=EditedActiveRequest))
    feature("round once" in json.dumps(scenario.context(number=2)), "context used stale source text")


def test_context_reads_the_latest_explicitly_selected_request_text(new_story):
    scenario = Scenario(new_story(fixture=ExplicitEditedRequest))
    feature("Newest correction" in json.dumps(scenario.context(number=2)), "selected request retained stale text")


def test_answer_can_reuse_its_existing_person_message(scenario):
    scenario.command('question ask "Which rounding?" --context "A story asks this so its card and answer can be checked." --options "Up" "Nearest"')
    supplied = scenario.person("messages.chat", "message", "send", "Nearest", "--target-agent", str(agent_number(scenario.story, scenario.story.agent.id)))
    initial_feed = scenario.person("messages.chat", "message", "feed")["rows"]
    scenario.person("questions.questions", "question", "answer", "1", "--answer", "Nearest", "--message-id", str(supplied["id"]))
    after = scenario.person("messages.chat", "message", "feed")["rows"]
    scenario.story.expect_rows(len(after) == len(initial_feed))
    scenario.story.expect_rows(json.loads(scenario.command("question show 1 --json").output_text)["message_id"] == supplied["id"])


def test_update_notification_names_the_explicit_selection_command(scenario):
    scenario.select(1)
    scenario.person("messages.chat", "message", "edit", "1", "--text", "Use a different rounding boundary")
    scenario.story.run_listeners()
    lines = "\n".join(scenario.story.hook("s-1", HookSamples.prompt("go on")).lines)
    scenario.story.expect_rows(expected_nudge(MESSAGE_UPDATED, message=1).is_in(lines), detail=lines)


@pytest.mark.parametrize("invalid", ["agent-message", "other-recipient", "other-author"])
def test_person_answer_refuses_a_source_with_wrong_author_or_addressee(scenario, invalid):
    scenario.command('question ask "Which answer source?" --context "A story asks this so its card and answer can be checked." --options "A" "B"')
    if invalid == "agent-message":
        supplied = json.loads(scenario.command('message send "A" --json').output_text)
    elif invalid == "other-recipient":
        second_agent_id = scenario.story.new_row_id("agent start private-answer-worker claude worker --environment main")
        supplied = scenario.person("messages.chat", "message", "send", "A", "--target-agent", str(agent_number(scenario.story, second_agent_id)))
    else:
        author = scenario.story.new_row_id('actor make user "Grace"')
        supplied_answer = viewer_answer(scenario.story, "messages.chat", ["message", "send", "A"], person_id=author)
        scenario.story.expect_rows(supplied_answer.code == 0, detail=supplied_answer.error)
        supplied = supplied_answer.value
    initial_feed = scenario.person("messages.chat", "message", "feed")["rows"]
    answer = viewer_answer(scenario.story, "questions.questions", ["question", "answer", "1", "--answer", "A", "--message-id", str(supplied["id"])])
    scenario.story.expect_rows(answer.code == 1)
    question = json.loads(scenario.command("question show 1 --json").output_text)
    scenario.story.expect_rows(question["state"] == "open", question["message_id"] is None)
    scenario.story.expect_rows(len(scenario.person("messages.chat", "message", "feed")["rows"]) == len(initial_feed))


def test_several_answered_questions_are_told_in_one_line_with_no_message(scenario):
    scenario.command('question ask "Which start?" --context "A story asks this so its card and answer can be checked." --options "Early" "Late"')
    scenario.command('question ask "Which finish?" --context "A story asks this so its card and answer can be checked." --options "Early" "Late"')
    scenario.person("questions.questions", "question", "answer", "1", "--answer", "Early")
    scenario.person("questions.questions", "question", "answer", "2", "--answer", "Late")
    lines = "\n".join(scenario.story.hook("s-1", HookSamples.prompt("go on")).lines)
    scenario.story.expect_rows("questions 1, 2 are answered" in lines, "answer source" not in lines, detail=lines)

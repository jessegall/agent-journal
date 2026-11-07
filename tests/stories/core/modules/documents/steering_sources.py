import json
import pytest

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.testing.hook_samples import HookSamples
from core.testing.story_fixture import StoryFixture

from tests.stories.core.modules.documents.support.trail_fixtures import feature, scenario, viewer_answer, Scenario, TrailReady


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


def test_answer_without_message_records_one_authorized_source(scenario):
    scenario.command('question ask "Which rounding rule?" --context "A story asks this so its card and answer can be checked." --options "Up" "Nearest" --recommend "Nearest"')
    scenario.person("questions.questions", "question", "answer", "1", "--answer", "Nearest")
    question = json.loads(scenario.command("question show 1 --json").output_text)
    feature(question["message_id"] is not None, "a real viewer answer has no canonical message")
    source = question["message_id"]
    feed = scenario.person("messages.chat", "message", "feed")["rows"]
    answers = [row for row in feed if row["id"] == source]
    feature(len(answers) == 1 and answers[0]["type"] in ("user", "comment") and "Nearest" in answers[0]["text"], json.dumps(answers))
    retry = viewer_answer(scenario.story, "questions.questions", ["question", "answer", "1", "--answer", "Nearest"])
    feature(retry.code in (0, 1), retry.error)
    after = json.loads(scenario.command("question show 1 --json").output_text)
    feature(after["message_id"] == source, "answer retry replaced the canonical source")
    scenario.story.expect_rows(len(scenario.person("messages.chat", "message", "feed")["rows"]) == len(feed))


def test_answered_question_exposes_its_answer_source(scenario):
    scenario.command('question ask "Which tax?" --context "A story asks this so its card and answer can be checked." --options "Local" "Export"')
    scenario.person("questions.questions", "question", "answer", "1", "--answer", "Local")
    source = json.loads(scenario.command("question show 1 --json").output_text)["message_id"]
    lines = "\n".join(scenario.story.hook("s-1", HookSamples.prompt("go on")).lines)
    feature("work-from" in lines and "question" in lines, lines)
    scenario.story.expect_rows(f"message:{source}" in lines, f"message work-from {source}" in lines, "question show 1" in lines)


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


def test_viewer_answer_is_authored_and_addressed_to_the_asking_agent(scenario):
    scenario.command('question ask "Which date?" --context "A story asks this so its card and answer can be checked." --options "Monday" "Tuesday"')
    scenario.person("questions.questions", "question", "answer", "1", "--answer", "Tuesday")
    question = json.loads(scenario.command("question show 1 --json").output_text)
    scenario.story.expect_rows(question["message_id"] is not None)
    source = scenario.person("messages.chat", "message", "show", str(question["message_id"]))
    scenario.story.expect_rows(source["creator_id"] == scenario.story.user.id)
    scenario.story.expect_rows(source["target_agent_id"] == scenario.story.agent.id)
    scenario.story.expect_rows(source["type"] == "user", source["text"] == "Tuesday")
    second_agent_id = scenario.story.new_row_id("agent start other-question-main claude main --environment main")
    answer = scenario.story.run(f'message read {source["id"]}', actor=Actor(second_agent_id, ActorType.AGENT))
    scenario.story.expect_rows(answer.code == 1, "Tuesday" not in answer.output_text)


def test_answer_only_becomes_source_after_explicit_selection(scenario):
    scenario.select()
    scenario.command('question ask "Which currency?" --context "A story asks this so its card and answer can be checked." --options "EUR" "USD"')
    scenario.person("questions.questions", "question", "answer", "1", "--answer", "EUR")
    source = json.loads(scenario.command("question show 1 --json").output_text)["message_id"]
    scenario.story.expect_rows(source is not None)
    scenario.story.hook("s-1", HookSamples.prompt("go on"))
    scenario.make_task("Work before switching")
    scenario.expect_link("message:2", "task:2", "about")
    scenario.expect_no_link(f"message:{source}", "task:2")
    scenario.switch(source)
    scenario.make_task("Work from the answer")
    scenario.expect_link(f"message:{source}", "task:3", "about")


def test_answer_can_reuse_its_existing_person_message(scenario):
    scenario.command('question ask "Which rounding?" --context "A story asks this so its card and answer can be checked." --options "Up" "Nearest"')
    supplied = scenario.person("messages.chat", "message", "send", "Nearest", "--target-agent", str(scenario.story.agent.id))
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
    scenario.story.expect_rows("message show 1" in lines, "message work-from 1" in lines, detail=lines)


@pytest.mark.parametrize("invalid", ["agent-message", "other-recipient", "other-author"])
def test_person_answer_refuses_a_source_with_wrong_author_or_addressee(scenario, invalid):
    scenario.command('question ask "Which answer source?" --context "A story asks this so its card and answer can be checked." --options "A" "B"')
    if invalid == "agent-message":
        supplied = json.loads(scenario.command('message send "A" --json').output_text)
    elif invalid == "other-recipient":
        second_agent_id = scenario.story.new_row_id("agent start private-answer-main claude main --environment main")
        supplied = scenario.person("messages.chat", "message", "send", "A", "--target-agent", str(second_agent_id))
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


def test_multiple_answer_notices_keep_selection_commands_valid(scenario):
    scenario.command('question ask "Which start?" --context "A story asks this so its card and answer can be checked." --options "Early" "Late"')
    scenario.command('question ask "Which finish?" --context "A story asks this so its card and answer can be checked." --options "Early" "Late"')
    scenario.person("questions.questions", "question", "answer", "1", "--answer", "Early")
    scenario.person("questions.questions", "question", "answer", "2", "--answer", "Late")
    sources = [json.loads(scenario.command(f"question show {number} --json").output_text)["message_id"] for number in (1, 2)]
    lines = "\n".join(scenario.story.hook("s-1", HookSamples.prompt("go on")).lines)
    scenario.story.expect_rows(all(str(source) in lines for source in sources))
    scenario.story.expect_rows(all(f"question:{number} answer source message:{source}" in lines and f"message work-from {source}" in lines for number, source in enumerate(sources, 1)))
    scenario.story.expect_rows("question show <question>" in lines)
    scenario.story.expect_rows("message work-from 3, 4" not in lines, "question show 1, 2" not in lines)

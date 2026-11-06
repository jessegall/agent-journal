import json
import pytest

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.testing.hook_samples import HookSamples
from core.testing.story_fixture import StoryFixture

from tests.stories.core.modules.documents.support.trail_fixtures import feature, trail, viewer_answer, Trail, TrailReady


class EditedActiveRequest(StoryFixture):
    parent = TrailReady

    def steps(self, story):
        current = Trail(story)
        current.select()
        current.person("messages.chat", "message", "edit", "2", "--text", "Use integer cents and round once")
        current.tick()
        current.make_task()


class ExplicitEditedRequest(StoryFixture):
    parent = TrailReady

    def steps(self, story):
        current = Trail(story)
        current.person("messages.chat", "message", "edit", "1", "--text", "Newest correction to the original")
        current.switch(1)
        current.make_task()


def test_answer_without_message_records_one_authorized_source(trail):
    trail.command('question ask "Which rounding rule?" --options "Up" "Nearest" --recommend "Nearest"')
    trail.person("questions.questions", "question", "answer", "1", "--answer", "Nearest")
    question = json.loads(trail.command("question show 1 --json").output_text)
    feature(question["message_id"] is not None, "a real viewer answer has no canonical message")
    source = question["message_id"]
    feed = trail.person("messages.chat", "message", "feed")["rows"]
    answers = [row for row in feed if row["id"] == source]
    feature(len(answers) == 1 and answers[0]["type"] in ("user", "comment") and "Nearest" in answers[0]["text"], json.dumps(answers))
    retry = viewer_answer(trail.story, "questions.questions", ["question", "answer", "1", "--answer", "Nearest"])
    feature(retry.code in (0, 1), retry.error)
    after = json.loads(trail.command("question show 1 --json").output_text)
    feature(after["message_id"] == source, "answer retry replaced the canonical source")
    assert len(trail.person("messages.chat", "message", "feed")["rows"]) == len(feed)


def test_answered_question_exposes_its_answer_source(trail):
    trail.command('question ask "Which tax?" --options "Local" "Export"')
    trail.person("questions.questions", "question", "answer", "1", "--answer", "Local")
    source = json.loads(trail.command("question show 1 --json").output_text)["message_id"]
    lines = "\n".join(trail.story.hook("s-1", HookSamples.prompt("go on")).lines)
    feature("work-from" in lines and "question" in lines, lines)
    assert f"message:{source}" in lines and f"message work-from {source}" in lines and "question show 1" in lines


def test_answer_notification_does_not_replace_active_request(trail):
    trail.select()
    trail.command('question ask "Keep discount?" --options "Yes" "No"')
    trail.person("questions.questions", "question", "answer", "1", "--answer", "Yes")
    trail.tick()
    trail.make_task()
    trail.expect_link("message:2", "task:2", "about")


def test_updated_active_request_keeps_source_identity(new_story):
    trail = Trail(new_story(fixture=EditedActiveRequest))
    trail.expect_link("message:2", "task:2", "about")
    assert "round once" in trail.command("message show 2").output_text


def test_showing_an_older_update_does_not_switch_source(trail):
    trail.select()
    trail.select(1)
    trail.person("messages.chat", "message", "edit", "1", "--text", "An older unrelated correction")
    trail.command("message show 1")
    trail.make_task()
    trail.expect_link("message:2", "task:2", "about")
    trail.expect_no_link("message:1", "task:2")


def test_explicit_selection_uses_latest_edited_request(new_story):
    trail = Trail(new_story(fixture=ExplicitEditedRequest))
    trail.expect_link("message:1", "task:2", "about")
    trail.command("message read 1")
    assert "Newest correction" in trail.command("message show 1").output_text


def test_context_reads_the_latest_active_request_text(new_story):
    trail = Trail(new_story(fixture=EditedActiveRequest))
    feature("round once" in json.dumps(trail.context(number=2)), "context used stale source text")


def test_context_reads_the_latest_explicitly_selected_request_text(new_story):
    trail = Trail(new_story(fixture=ExplicitEditedRequest))
    feature("Newest correction" in json.dumps(trail.context(number=2)), "selected request retained stale text")


def test_viewer_answer_is_authored_and_addressed_to_the_asking_agent(trail):
    trail.command('question ask "Which date?" --options "Monday" "Tuesday"')
    trail.person("questions.questions", "question", "answer", "1", "--answer", "Tuesday")
    question = json.loads(trail.command("question show 1 --json").output_text)
    assert question["message_id"] is not None
    source = trail.person("messages.chat", "message", "show", str(question["message_id"]))
    assert source["creator_id"] == trail.story.user.id
    assert source["target_agent_id"] == trail.story.agent.id
    assert source["type"] == "user" and source["text"] == "Tuesday"
    other = trail.story.new_row_id("agent start other-question-main claude main --environment main")
    answer = trail.story.run(f'message read {source["id"]}', actor=Actor(other, ActorType.AGENT))
    assert answer.code == 1 and "Tuesday" not in answer.output_text


def test_answer_only_becomes_source_after_explicit_selection(trail):
    trail.select()
    trail.command('question ask "Which currency?" --options "EUR" "USD"')
    trail.person("questions.questions", "question", "answer", "1", "--answer", "EUR")
    source = json.loads(trail.command("question show 1 --json").output_text)["message_id"]
    assert source is not None
    trail.story.hook("s-1", HookSamples.prompt("go on"))
    trail.make_task("Work before switching")
    trail.expect_link("message:2", "task:2", "about")
    trail.expect_no_link(f"message:{source}", "task:2")
    trail.switch(source)
    trail.make_task("Work from the answer")
    trail.expect_link(f"message:{source}", "task:3", "about")


def test_answer_can_reuse_its_existing_person_message(trail):
    trail.command('question ask "Which rounding?" --options "Up" "Nearest"')
    supplied = trail.person("messages.chat", "message", "send", "Nearest", "--target-agent", str(trail.story.agent.id))
    before = trail.person("messages.chat", "message", "feed")["rows"]
    trail.person("questions.questions", "question", "answer", "1", "--answer", "Nearest", "--message-id", str(supplied["id"]))
    after = trail.person("messages.chat", "message", "feed")["rows"]
    assert len(after) == len(before)
    assert json.loads(trail.command("question show 1 --json").output_text)["message_id"] == supplied["id"]


def test_update_notification_names_the_explicit_selection_command(trail):
    trail.select(1)
    trail.person("messages.chat", "message", "edit", "1", "--text", "Use a different rounding boundary")
    trail.story.run_listeners()
    lines = "\n".join(trail.story.hook("s-1", HookSamples.prompt("go on")).lines)
    assert "message show 1" in lines and "message work-from 1" in lines, lines


@pytest.mark.parametrize("invalid", ["agent-message", "other-recipient", "other-author"])
def test_person_answer_refuses_a_source_with_wrong_author_or_addressee(trail, invalid):
    trail.command('question ask "Which answer source?" --options "A" "B"')
    if invalid == "agent-message":
        supplied = json.loads(trail.command('message send "A" --json').output_text)
    elif invalid == "other-recipient":
        other = trail.story.new_row_id("agent start private-answer-main claude main --environment main")
        supplied = trail.person("messages.chat", "message", "send", "A", "--target-agent", str(other))
    else:
        author = trail.story.new_row_id('actor make user "Grace"')
        supplied_answer = viewer_answer(trail.story, "messages.chat", ["message", "send", "A"], person_id=author)
        assert supplied_answer.code == 0, supplied_answer.error
        supplied = supplied_answer.value
    before = trail.person("messages.chat", "message", "feed")["rows"]
    answer = viewer_answer(trail.story, "questions.questions", ["question", "answer", "1", "--answer", "A", "--message-id", str(supplied["id"])])
    assert answer.code == 1
    question = json.loads(trail.command("question show 1 --json").output_text)
    assert question["state"] == "open" and question["message_id"] is None
    assert len(trail.person("messages.chat", "message", "feed")["rows"]) == len(before)


def test_multiple_answer_notices_keep_selection_commands_valid(trail):
    trail.command('question ask "Which start?" --options "Early" "Late"')
    trail.command('question ask "Which finish?" --options "Early" "Late"')
    trail.person("questions.questions", "question", "answer", "1", "--answer", "Early")
    trail.person("questions.questions", "question", "answer", "2", "--answer", "Late")
    sources = [json.loads(trail.command(f"question show {number} --json").output_text)["message_id"] for number in (1, 2)]
    lines = "\n".join(trail.story.hook("s-1", HookSamples.prompt("go on")).lines)
    assert all(str(source) in lines for source in sources)
    assert all(f"question:{number} message:{source}" in lines for number, source in enumerate(sources, 1))
    assert "message work-from <message>" in lines and "question show <question>" in lines
    assert "message work-from 3, 4" not in lines and "question show 1, 2" not in lines

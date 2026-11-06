import json

from tests.stories.core.modules.documents.support.trail_fixtures import feature, pending, trail, viewer_answer


@pending(6889)
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


@pending(6889)
def test_answered_question_exposes_its_answer_source(trail):
    trail.command('question ask "Which tax?" --options "Local" "Export"')
    trail.person("questions.questions", "question", "answer", "1", "--answer", "Local")
    lines = "\n".join(trail.tick().lines)
    feature("work-from" in lines and "question" in lines, lines)


@pending(6889)
def test_answer_notification_does_not_replace_active_request(trail):
    trail.select()
    trail.command('question ask "Keep discount?" --options "Yes" "No"')
    trail.person("questions.questions", "question", "answer", "1", "--answer", "Yes")
    trail.tick()
    trail.make_task()
    trail.expect_link("message:2", "task:2", "about")


@pending(6889)
def test_updated_active_request_keeps_source_identity(trail):
    trail.select()
    trail.person("messages.chat", "message", "edit", "2", "--text", "Use integer cents and round once")
    trail.tick()
    trail.make_task()
    trail.expect_link("message:2", "task:2", "about")
    feature("round once" in json.dumps(trail.context(number=2)), "context used stale source text")


@pending(6889)
def test_showing_an_older_update_does_not_switch_source(trail):
    trail.select()
    trail.select(1)
    trail.person("messages.chat", "message", "edit", "1", "--text", "An older unrelated correction")
    trail.command("message show 1")
    trail.make_task()
    trail.expect_link("message:2", "task:2", "about")
    trail.expect_no_link("message:1", "task:2")


@pending(6889)
def test_explicit_selection_uses_latest_edited_request(trail):
    trail.person("messages.chat", "message", "edit", "1", "--text", "Newest correction to the original")
    trail.switch(1)
    trail.make_task()
    trail.expect_link("message:1", "task:2", "about")
    feature("Newest correction" in json.dumps(trail.context(number=2)), "selected request retained stale text")

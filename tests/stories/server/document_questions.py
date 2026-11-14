import json

import pytest

from tests.stories.core.modules.documents.support.read_marks import ReadableTexts
from tests.stories.server.support.server_client import server_story
from tests.stories.support.story_checks import expect_value


@pytest.fixture
def question_document_server(new_story):
    with server_story(new_story(fixture=ReadableTexts)) as server:
        yield server


@pytest.mark.parametrize("model_name,position", [("doc", 10), ("report", 4)])
def test_a_quoted_question_stays_open_globally_and_can_be_answered_from_the_viewer(question_document_server, model_name, position):
    server = question_document_server
    story = server.story
    story.expect_success(f'question ask "Keep the cart?" --context "A story asks this so its card and answer can be checked." --row {model_name}:1 --quote cart --options Yes No --recommend Yes --environment main', actor=story.agent)
    question = json.loads(story.run("question show 1 --json", actor=story.agent).output_text)
    expect_value((question["row_model"], question["row_id"], question["quote"], question["position"]), (model_name, 1, "cart", position))
    story.expect_text("question list", "Keep the cart?", actor=story.agent)
    cookie = server.expect_viewer_login(server.viewer_key("Ada"))
    server.viewer_line_value(cookie, {"window": "viewer.shell", "environment": "main", "line": ["question", "answer", "1", "--answer", "Yes"]})
    listed = server.viewer_line_value(cookie, {"window": "viewer.shell", "environment": "main", "line": ["question", "list", "--all", "--row", f"{model_name}:1"]})
    expect_value([(row["state"], row["answer"], row["quote"]) for row in listed["rows"]], [("answered", "Yes", "cart")])
    unrelated_model = "report" if model_name == "doc" else "doc"
    unrelated = server.viewer_line_value(cookie, {"window": "viewer.shell", "environment": "main", "line": ["question", "list", "--all", "--row", f"{unrelated_model}:1"]})
    expect_value(unrelated["rows"], [])


def test_an_explicit_quote_position_is_kept_and_a_whole_document_question_needs_no_quote(new_story):
    story = new_story(fixture=ReadableTexts)
    story.expect_success('question ask "Why this word?" --context "A story asks this so its card and answer can be checked." --row doc:1 --quote cart --position 10 --environment main', actor=story.agent)
    story.expect_text("question show 1 --json", '"position": 10', actor=story.agent)
    story.expect_success('question ask "Is this complete?" --context "A story asks this so its card and answer can be checked." --row report:1 --environment main', actor=story.agent)
    question = json.loads(story.run("question show 2 --json", actor=story.agent).output_text)
    expect_value((question["row_model"], question["row_id"], question["quote"], question["position"]), ("report", 1, "", None))


@pytest.mark.parametrize("flags,reason", [
    ("--quote cart", "a quoted question needs a document or report"),
    ("--row task:1", "a question's place must be a document or report"),
    ("--row doc:1 --quote missing", "the quote is not in the current text"),
    ("--row doc:1 --quote cart --position -1", "a question's position cannot be negative"),
])
def test_an_invalid_question_place_is_refused_without_creating_a_question(new_story, flags, reason):
    story = new_story(fixture=ReadableTexts)
    story.expect_refusal(f'question ask "Which text?" --context "A story asks this so its card and answer can be checked." {flags} --environment main', reason, actor=story.agent)
    story.expect_success("question list", "no open questions", actor=story.agent)

from core.base.actor import Actor
from core.base.command.bus import Bus
from core.modules.sequences.commands.save_standard_sequences.save_standard_sequences import SaveStandardSequences
from core.modules.sequences.queries.sequence_run_query import SequenceRunQuery
import pytest

from core.base.query.queries import Queries
from core.modules.documents.models.link import Link
from core.modules.messages.models.message import Message
from core.modules.templates.models.template import Template
from core.testing.expect_row import expect_row
from tests.stories.core.modules.templates.support.sending_templates import SendingTemplates
from tests.stories.server.support.server_client import server_story
from tests.stories.core.modules.templates.support.active_template_fixture import installed_review

CRITIQUE = 'template send 1 --on=plan:1 --set=agents="2 agents" --set=size="a normal read" --environment main'


def expect_empty_messages(story):
    story.expect_rows(story.container.get(Queries).query(Message).count() == 0,
                      story.container.get(Queries).query(Link).count() == 0)


def test_a_person_sends_the_same_critique_request_as_the_button(new_story):
    story = new_story(fixture=SendingTemplates)
    story.expect_success(CRITIQUE, actor=story.user)
    message = story.container.get(Queries).query(Message).find(1)
    expect_row(message, is_chat_visible=True, text="Please have 2 agents give plan 1 a normal read, following template 1 (Plan critique), "
                             "and compile what they find into a report linked to the plan.", creator_id=story.user.id)
    story.expect_text("plan comments 1", "Please have 2 agents give plan 1 a normal read", "Plan critique")
    story.expect_text("plan show 1", "state: reviewing")


@pytest.mark.parametrize("count", [1, 2, 3, 4, 5])
@pytest.mark.parametrize("size", ["a quick look", "a normal read", "a thorough review"])
def test_every_critique_sentence_matches_version_four_with_a_named_template(new_story, count, size):
    story = new_story(fixture=SendingTemplates, environment="main")
    agents = "one agent" if count == 1 else f"{count} agents"
    story.expect_success(f'template send 1 --on=plan:1 --set=agents="{agents}" --set=size="{size}"', actor=story.user)
    expected = (f"Please have {agents} give plan 1 {size}, following template 1 (Plan critique), "
                "and compile what they find into a report linked to the plan.")
    expect_row(story.container.get(Queries).query(Message).find(1), text=expected)


def test_an_unknown_purpose_uses_the_default_prompt(new_story):
    story = new_story(fixture=SendingTemplates, environment="main")
    story.expect_success('template make "Custom purpose" --purpose custom --applies-to plan', actor=story.user)
    story.expect_success("template send 5 --on=plan:1", actor=story.user)
    story.expect_text("plan comments 1", "Please follow template 5 (Custom purpose) on plan 1.")


def test_a_template_with_no_targets_fits_a_task(new_story):
    story = new_story(fixture=SendingTemplates, environment="main")
    story.expect_success("task make Work", actor=story.user)
    story.expect_success("template send 3 --on=task:1", actor=story.user)
    story.expect_text("task comments 1", "Please follow template 3 (Any row) on task 1.")


def test_a_template_with_no_targets_fits_a_row_without_an_environment(new_story):
    story = new_story(fixture=SendingTemplates, environment="main")
    story.expect_success("template send 3 --on=environment:1", actor=story.user)
    story.expect_text("message list", "Please follow template 3 (Any row) on environment 1.")


@pytest.mark.parametrize("flags", ["", "--skip-guard core.lifecycle"])
def test_an_agent_is_refused_before_a_template_is_sent(new_story, flags):
    story = new_story(fixture=SendingTemplates)
    story.expect_refusal(f"{CRITIQUE} {flags}", "A person was asked in the dock", actor=story.agent)
    expect_empty_messages(story)


@pytest.mark.parametrize("values,wrong", [('', "agents, size"), ('--set=agents="2 agents"', "size"),
                                       ('--set=agents="2 agents" --set=size=Brief --set=extra=unused', "extra")])
def test_missing_or_unused_values_are_refused_without_a_message(new_story, values, wrong):
    story = new_story(fixture=SendingTemplates, environment="main")
    story.expect_refusal(f"template send 1 --on=plan:1 {values}", wrong, actor=story.user)
    expect_empty_messages(story)


@pytest.mark.parametrize("name", ["target", "type", "id", "title"])
def test_reserved_prompt_values_cannot_be_supplied(new_story, name):
    story = new_story(fixture=SendingTemplates)
    story.expect_refusal(f"{CRITIQUE} --set={name}=changed", name, actor=story.user)
    expect_empty_messages(story)


@pytest.mark.parametrize("target", ["plan", "plan:unknown", "unknown:1", "plan:999"])
def test_a_target_that_cannot_be_found_leaves_no_message(new_story, target):
    story = new_story(fixture=SendingTemplates, environment="main")
    story.expect_refusal(f"template send 2 --on={target}", "row" if target != "plan:999" else "no plan 999", actor=story.user)
    expect_empty_messages(story)


def test_a_target_outside_the_template_targets_is_refused(new_story):
    story = new_story(fixture=SendingTemplates)
    story.expect_refusal(CRITIQUE.replace("send 1", "send 4"), "does not apply to plan", actor=story.user)
    expect_empty_messages(story)


def test_a_target_in_another_environment_leaves_no_message(new_story):
    story = new_story(fixture=SendingTemplates)
    story.expect_success("environment make other /work/other")
    story.expect_refusal(CRITIQUE.replace("--environment main", "--environment other"), "no plan 1", actor=story.user)
    expect_empty_messages(story)


def test_a_target_with_no_current_environment_leaves_no_message(new_story):
    story = new_story(fixture=SendingTemplates)
    story.expect_refusal(CRITIQUE.replace(" --environment main", ""), "belongs to another environment", actor=story.user)
    expect_empty_messages(story)


def test_a_value_keeps_its_spaces_and_equals_signs(new_story):
    story = new_story(fixture=SendingTemplates)
    story.expect_success(CRITIQUE.replace('"2 agents"', '"a=b and c"'), actor=story.user)
    story.expect_text("plan comments 1", "Please have a=b and c give plan 1 a normal read")


def test_an_inactive_modules_template_is_refused_without_a_message(installed_review):
    installed_review.expect_success("plan make Release --environment elsewhere", actor=installed_review.user)
    template = installed_review.container.get(Queries).query(Template).filter(title="Security review").page(1, 1).rows[0]
    line = f'template send {template.id} --on=plan:1 --set=agents="2 agents" --set=size="a normal read" --environment elsewhere'
    installed_review.expect_refusal(line, f"template {template.id} is not offered here", actor=installed_review.user)
    expect_empty_messages(installed_review)


@pytest.mark.parametrize("value", ["agents", "=value", "agents=first --set=agents=second"])
def test_malformed_or_repeated_values_are_refused(new_story, value):
    story = new_story(fixture=SendingTemplates, environment="main")
    story.expect_refusal(f"template send 1 --on=plan:1 --set={value}", "value", actor=story.user)
    expect_empty_messages(story)


def test_a_critique_request_starts_the_sequence_that_applies_the_reviews(new_story):
    story = new_story(fixture=SendingTemplates)
    story.container.get(Bus).run(SaveStandardSequences(), Actor.core())
    story.expect_success(CRITIQUE, actor=story.user)
    story.run_listeners()
    run = story.container.get(SequenceRunQuery).current(story.agent.id)
    story.expect_rows(run is not None)
    story.expect_text(f"sequence show {run.sequence_id}", "Applying a plan's reviews")



def test_viewer_critique_is_a_plan_comment_in_the_chat_and_reaches_the_agent(new_story):
    story = new_story(fixture=SendingTemplates)
    story.container.get(Bus).run(SaveStandardSequences(), Actor.core())
    with server_story(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        server.viewer_line_value(cookie, {"window": "messages.chat", "environment": "main", "line": ["template", "send", "1", "--on=plan:1", "--set=agents=2 agents", "--set=size=a normal read"]})
        feed = server.viewer_line_value(cookie, {"window": "messages.chat", "environment": "main", "line": ["message", "feed"]})
        story.expect_rows([row["commented_row"] for row in feed["rows"] if "Plan critique" in row["text"]] == ["plan:1"])
        story.expect_text("plan comments 1", "Plan critique")
        story.expect_text("message unread", "Plan critique", actor=story.agent)
        story.run_listeners()
        story.expect_rows(story.container.get(SequenceRunQuery).current(story.agent.id) is not None)

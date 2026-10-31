from core.testing.hook_samples import HookSamples
from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.coding_fixtures import BuilderStarted
from core.base.driver.tool_type import ToolType

ASK = 'question ask "Which database?" --options sqlite postgres --environment main'
OWN_QUESTION_TOOL = HookSamples.sample("pre_tool_use", {"name": "AskUserQuestion", "category": ToolType.UNCATEGORISED, "files": [], "diff": None})


def test_asking_opens_a_wait_whose_one_target_is_the_question(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run(ASK, actor=story.agent)
    story.expect_success("wait show 1", "type: rows", "state: open", f"agent_id: {story.agent.id}")
    story.expect_success("wait-target show 1", "wait_id: 1", "row_table: questions", "row_id: 1")


def test_answering_ends_the_wait(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run(ASK, actor=story.agent)
    story.run("question answer 1 --answer sqlite")
    story.expect_success("wait show 1", "state: ended")


def test_closing_ends_the_wait(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run(ASK, actor=story.agent)
    story.run("question close 1")
    story.expect_success("wait show 1", "state: ended")


def test_an_agent_that_asked_stays_under_the_wait_overlay_in_its_driver_run(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run(ASK, actor=story.agent)
    story.hook("s-1", HookSamples.stop())
    story.expect_text(lines.SECOND_HOOK_CALL, "layers: wait:1")


def test_a_late_answer_is_told_to_the_agent_once(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run(ASK, actor=story.agent)
    story.run("question answer 1 --answer sqlite")
    story.expect_hook_allowed("s-1", HookSamples.prompt("go on"), "question 1 was answered: sqlite")
    story.expect_absent_hook_line("s-1", HookSamples.prompt("and on"), "question 1 was answered")


def test_a_closed_question_is_told_to_the_agent_once(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run(ASK, actor=story.agent)
    story.run("question close 1")
    story.expect_hook_allowed("s-1", HookSamples.prompt("go on"), "question 1 was closed without an answer")
    story.expect_absent_hook_line("s-1", HookSamples.prompt("and on"), "question 1 was closed")


def test_the_agent_programs_own_question_tool_is_refused_with_the_journal_way(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_hook_refusal("s-1", OWN_QUESTION_TOOL, "journal question ask")


def test_a_refused_ask_leaves_no_wait(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_refusal('question ask "Which way?" --options "I will fix it" --environment main', "name who acts", actor=story.agent)
    story.expect_refusal("wait show 1", "does not exist")

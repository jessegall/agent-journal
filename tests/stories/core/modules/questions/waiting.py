from core.testing.hook_samples import HookSamples
from tests.stories.core.support import story_lines as lines
from core.testing.story import Story
from core.testing.story_fixture import StoryFixture
from tests.stories.core.base.driver.support.hook_agents import hook_agent
from tests.stories.core.support.coding_fixtures import BuilderStarted, CodingEnvironment
from core.base.driver.tool_type import ToolType

QUESTION_LINE = 'question ask "Which database?" --options sqlite postgres --environment main'
OWN_QUESTION_TOOL = HookSamples.sample("pre_tool_use", {"name": "AskUserQuestion", "category": ToolType.QUESTION, "files": [], "diff": None})
CODEX_QUESTION_TOOL = HookSamples.sample("pre_tool_use", {"name": "request_user_input", "category": ToolType.QUESTION, "files": [], "diff": None}).with_fields(program="codex")


class BuilderQuestion(StoryFixture):
    """The builder asked question 1, Which database?, which opened wait 1."""

    parent = BuilderStarted

    def steps(self, story: Story) -> None:
        story.run(QUESTION_LINE, actor=story.agent)

    def expect(self, story: Story) -> None:
        story.expect_success("wait show 1", "state: open")


class CodexBuilderStarted(StoryFixture):
    """Session s-1 sent its first hook as a Codex program, which started story.agent under the builder."""

    parent = CodingEnvironment

    def steps(self, story: Story) -> None:
        story.agent = hook_agent(story, story.hook("s-1", HookSamples.session_start().with_fields(program="codex")))

    def expect(self, story: Story) -> None:
        story.expect_success(f"agent show {story.agent.id}", "session: s-1", "role: main")


def test_asking_opens_a_wait_whose_one_target_is_the_question(new_story):
    story = new_story(fixture=BuilderQuestion)
    story.expect_success("wait show 1", "type: rows", "state: open", f"agent_id: {story.agent.id}")
    story.expect_success("wait-target show 1", "wait_id: 1", "row_table: questions", "row_id: 1")


def test_answering_ends_the_wait(new_story):
    story = new_story(fixture=BuilderQuestion)
    story.run("question answer 1 --answer sqlite")
    story.expect_success("wait show 1", "state: ended")


def test_closing_ends_the_wait(new_story):
    story = new_story(fixture=BuilderQuestion)
    story.run("question close 1")
    story.expect_success("wait show 1", "state: ended")


def test_an_agent_that_asked_stays_under_the_wait_overlay_in_its_driver_run(new_story):
    story = new_story(fixture=BuilderQuestion)
    story.hook("s-1", HookSamples.stop())
    story.expect_text(lines.SECOND_HOOK_CALL, "layers: wait:1")


def test_a_late_answer_is_told_to_the_agent_once(new_story):
    story = new_story(fixture=BuilderQuestion)
    story.run("question answer 1 --answer sqlite")
    story.expect_hook_allowed("s-1", HookSamples.prompt("go on"), "question 1 is answered: read it with journal question show 1 and act on it")
    story.expect_absent_hook_line("s-1", HookSamples.prompt("and on"), "question 1 is answered")


def test_a_closed_question_is_told_to_the_agent_once(new_story):
    story = new_story(fixture=BuilderQuestion)
    story.run("question close 1")
    story.expect_hook_allowed("s-1", HookSamples.prompt("go on"), "the user closed question 1 unanswered: go on without it")
    story.expect_absent_hook_line("s-1", HookSamples.prompt("and on"), "the user closed question 1")


def test_the_agent_programs_own_question_tool_is_refused_with_the_journal_way(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_hook_refusal("s-1", OWN_QUESTION_TOOL, "ask with journal question ask")


def test_a_refused_ask_leaves_no_wait(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_refusal('question ask "Which way?" --options "I will fix it" --environment main', "name who acts", actor=story.agent)
    story.expect_refusal("wait show 1", "no wait 1")


def test_the_codex_programs_own_question_tool_is_refused_with_the_journal_way(new_story):
    story = new_story(fixture=CodexBuilderStarted)
    story.expect_hook_refusal("s-1", CODEX_QUESTION_TOOL, "ask with journal question ask")

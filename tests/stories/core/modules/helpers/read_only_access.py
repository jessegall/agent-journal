import shlex

import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.caller.caller_request import SESSION_VARIABLE
from engine.enums.command_category import CommandCategory
from engine.enums.command_effect import CommandEffect
from engine.enums.tool_type import ToolType
from core.modules.drivers.support.access_nudges import ENDED_AGENT, OLD_HOOK_LINE, OUTWARD_JOURNAL_LINE, LIMITED_TOOL, UNJUDGED_LINE
from engine.query.queries import Queries
from core.modules.documents.models.report import Report
from engine.testing.expectations.expect_reply import expect_reply_allowed
from core.modules.agents.testing.fake_launcher import FakeLauncher
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.helpers.helper_jobs import StartedHelper, helper_agent
from tests.stories.core.support.coding_fixtures import UserBuilder

WRITES = [CommandEffect.WRITES_FILES]
EDIT_TOOLS = [("Edit", ToolType.EDIT), ("Write", ToolType.NEW_FILE), ("NotebookEdit", ToolType.EDIT), ("apply_patch", ToolType.EDIT), ("Monitor", ToolType.MONITOR)]
SAFE_TOOLS = {StartedHelper: ["WebFetch", "WebSearch"]}


class StartedCodexHelper(StoryFixture):
    """A main agent with a person beside it and one read-only helper on Codex."""

    parent = UserBuilder

    def steps(self, story):
        launcher = FakeLauncher.listening(story.home.socket("launcher"))
        story.run('helper start journal-researcher --program codex --model gpt-6-luna --brief "Read src/cart.py" --environment main', actor=story.agent)
        story.run_listeners()
        launcher.drain_requests()
        launcher.server.close()
        story.home.socket("launcher").unlink()


SAFE_TOOLS[StartedCodexHelper] = ["webrun", "list_mcp_resources", "update_goal"]
PROGRAMS = [StartedHelper, StartedCodexHelper]


def helper_story(new_story, helper_fixture):
    story = new_story(fixture=helper_fixture)
    return story, helper_agent(story).session


def shell(line, *parts, redirects=()):
    return HookSamples.shell(line, *parts, redirects=redirects)


def line_without_commands():
    sample = shell("cat a", ShellPart("cat", CommandCategory.READ, ["a"]))
    sample.body["tool"]["shell"]["parts"] = []
    return sample


def part(program, category, *arguments, **fields):
    return ShellPart(program, category, list(arguments), **fields)


def tool(name, category=ToolType.UNCATEGORISED):
    return HookSamples.tool_use(name, category, [], None)


@pytest.mark.parametrize("helper_fixture", PROGRAMS)
@pytest.mark.parametrize("sample", [tool("Read", ToolType.READ), tool("Skill", ToolType.READ), tool("Grep", ToolType.SEARCH), tool("Glob", ToolType.SEARCH), shell("grep cart a", part("grep", CommandCategory.SEARCH, "cart", "a")),
                                    shell("cat a", part("cat", CommandCategory.READ, "a")), shell("ls", part("ls", CommandCategory.READ)),
                                    shell('journal report make "x"', part("journal", CommandCategory.JOURNAL, "report", "make", "x")),
                                    HookSamples.tool_use("Read", ToolType.READ, [".claude/skills/journal-merger/SKILL.md"], None), HookSamples.tool_use("Read", ToolType.READ, ["src/cart.py"], None)],
                         ids=["read", "skill", "grep", "glob", "shell grep", "cat", "ls", "journal report", "read a skill its profile does not list", "read a source file"])
def test_a_read_only_helper_reads_and_searches(new_story, helper_fixture, sample):
    story, session = helper_story(new_story, helper_fixture)
    expect_reply_allowed(story.hook(session, sample))


@pytest.mark.parametrize("helper_fixture", PROGRAMS)
def test_a_read_only_helper_calls_the_read_tools_of_its_program(new_story, helper_fixture):
    story, session = helper_story(new_story, helper_fixture)
    for name in SAFE_TOOLS[helper_fixture]:
        expect_reply_allowed(story.hook(session, tool(name).with_fields(program=helper_agent(story).program)))


@pytest.mark.parametrize("helper_fixture", PROGRAMS)
@pytest.mark.parametrize("name, category", EDIT_TOOLS)
def test_a_read_only_helper_never_edits_a_file(new_story, helper_fixture, name, category):
    story, session = helper_story(new_story, helper_fixture)
    story.expect_hook_refusal(session, tool(name, category), "reads and searches only")


@pytest.mark.parametrize("helper_fixture", PROGRAMS)
@pytest.mark.parametrize("sample", [tool("mcp__wiki__edit"), tool("AskUserQuestion", ToolType.QUESTION)], ids=["mcp", "question"])
def test_a_tool_outside_the_list_is_refused_with_a_way_on(new_story, helper_fixture, sample):
    story, session = helper_story(new_story, helper_fixture)
    story.expect_hook_refusal(session, sample, LIMITED_TOOL.nudge(tool=sample.body["tool"]["name"]).text)


@pytest.mark.parametrize("helper_fixture", PROGRAMS)
def test_a_wait_does_not_lift_the_limit(new_story, helper_fixture):
    story, session = helper_story(new_story, helper_fixture)
    story.run('wait stuck "no way on"', actor=Actor(helper_agent(story).id, ActorType.AGENT))
    story.expect_hook_refusal(session, tool("Edit", ToolType.EDIT), "reads and searches only")


def test_a_writing_main_agent_is_not_held_to_reading(new_story):
    story = new_story(fixture=StartedHelper)
    expect_reply_allowed(story.hook("s-1", tool("mcp__wiki__edit")))


def journal_line(*arguments):
    return shell(f"journal {' '.join(arguments)}", part("journal", CommandCategory.JOURNAL, *arguments))


@pytest.mark.parametrize("helper_fixture", PROGRAMS)
@pytest.mark.parametrize("line, second", [(f"journal task list && {SESSION_VARIABLE}=s-1 journal task list", part("journal", CommandCategory.JOURNAL, "task", "list")),
                                          (f"journal task list && echo {SESSION_VARIABLE}", part("echo", CommandCategory.READ, SESSION_VARIABLE))], ids=["second part sets it", "second part names it"])
def test_a_chain_is_refused_by_the_part_that_names_a_session(new_story, helper_fixture, line, second):
    story, session = helper_story(new_story, helper_fixture)
    story.expect_hook_refusal(session, shell(line, part("journal", CommandCategory.JOURNAL, "task", "list"), second), OUTWARD_JOURNAL_LINE.nudge().text)


REPORT_TEXT = "Run `rm -rf a` in $HOME and \"tests/stories/core/a.py\" with python3 and curl.\n" * 800


def test_a_long_report_holding_program_names_is_filed_whole(new_story):
    story = new_story(fixture=StartedHelper)
    story.expect_success(f'report make Findings --abstract "What was read" --body {shlex.quote(REPORT_TEXT)} --environment main', actor=story.agent)
    story.expect_rows(len(REPORT_TEXT) > 60000, story.container.get(Queries).query(Report).filter(title="Findings").first().body == REPORT_TEXT)


def test_an_ended_helper_is_refused_its_next_tool_and_writes_no_second_report(new_story):
    story, session = helper_story(new_story, StartedHelper)
    story.expect_success(f"agent end {helper_agent(story).id}", actor=story.user)
    story.run_listeners()
    story.expect_hook_refusal(session, tool("Edit", ToolType.EDIT), ENDED_AGENT.nudge().text)
    final_lines = story.run(f"agent-line list --agent {story.agent.id}", actor=story.user).output_text
    story.hook(session, HookSamples.stop())
    story.run_listeners()
    story.expect_rows(story.run(f"agent-line list --agent {story.agent.id}", actor=story.user).output_text == final_lines)


def test_a_codex_helper_ended_before_its_first_hook_is_refused_an_edit(new_story):
    story, launch_name = helper_story(new_story, StartedCodexHelper)
    story.expect_success(f"agent end {helper_agent(story).id}", actor=story.user)
    story.expect_hook_refusal("t-9", tool("Edit", ToolType.EDIT).with_fields(program="codex", launch=launch_name), ENDED_AGENT.nudge().text)


def main_story(new_story):
    return new_story(fixture=UserBuilder)


@pytest.mark.parametrize("name, category", [("Agent", ToolType.AGENT), ("Task", ToolType.AGENT), ("collaborationspawn_agent", ToolType.AGENT), ("spawn_agent", ToolType.UNCATEGORISED), ("collaborationwait", ToolType.UNCATEGORISED)])
def test_a_programs_own_subagent_tool_is_refused_with_the_way_on(new_story, name, category):
    story = main_story(new_story)
    launcher = FakeLauncher.listening(story.home.socket("launcher"))
    story.expect_hook_refusal("s-1", tool(name, category), "start a helper for this")
    launcher.server.close()


def test_a_wait_does_not_lift_the_subagent_refusal(new_story):
    story = main_story(new_story)
    story.run('wait stuck "no way on"', actor=story.agent)
    story.expect_hook_refusal("s-1", tool("Agent", ToolType.AGENT), "keep this work yourself")


def test_a_tool_called_by_a_programs_own_child_is_refused(new_story):
    story = main_story(new_story)
    story.expect_hook_refusal("s-1", tool("Read", ToolType.READ).with_fields(child_agent="child-1"), "keep this work yourself")

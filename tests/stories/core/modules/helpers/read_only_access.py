import shlex

import pytest

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.caller.caller_request import SESSION_VARIABLE
from core.base.driver.command_category import CommandCategory
from core.base.driver.command_effect import CommandEffect
from core.base.driver.tool_type import ToolType
from core.modules.drivers.support.access_nudges import ENDED_AGENT, OLD_HOOK_LINE, OUTWARD_JOURNAL_LINE, LIMITED_TOOL, UNJUDGED_LINE
from core.base.query.queries import Queries
from core.modules.documents.models.report import Report
from core.testing.expect_reply import expect_reply_allowed
from core.testing.fake_launcher import FakeLauncher
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from core.testing.story_fixture import StoryFixture
from tests.stories.core.modules.helpers.helper_jobs import StartedHelper, helper_agent
from tests.stories.core.support.coding_fixtures import BuilderWithUser

WRITES = [CommandEffect.WRITES_FILES]
EDIT_TOOLS = [("Edit", ToolType.EDIT), ("Write", ToolType.NEW_FILE), ("NotebookEdit", ToolType.EDIT), ("apply_patch", ToolType.EDIT), ("Monitor", ToolType.MONITOR)]
SAFE_TOOLS = {StartedHelper: ["WebFetch", "WebSearch"]}


class StartedCodexHelper(StoryFixture):
    """A main agent with a person beside it and one read-only helper on Codex."""

    parent = BuilderWithUser

    def steps(self, story):
        launcher = FakeLauncher(story.home.socket("launcher"))
        story.run('helper start journal-researcher --program codex --model gpt-6-luna --brief "Read src/cart.py" --environment main', actor=story.agent)
        story.run_listeners()
        launcher.wait_for_requests()
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
                                    shell('journal report make "x"', part("journal", CommandCategory.JOURNAL, "report", "make", "x"))],
                         ids=["read", "skill", "grep", "glob", "shell grep", "cat", "ls", "journal report"])
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
@pytest.mark.parametrize("sample", [
    shell("cat a > b", part("cat", CommandCategory.READ, "a", effects=WRITES, output_paths=["b"]), redirects=["> b"]),
    shell("tee b", part("tee", CommandCategory.EDIT, "b", effects=WRITES)),
    shell("sed -i s/a/b/ c", part("sed", CommandCategory.EDIT, "-i", "c", effects=WRITES)),
    shell("python3 tool.py", part("python3", CommandCategory.PROCESS, "tool.py")),
    shell("python3 -c 'print(1)'", part("python3", CommandCategory.PROCESS, "-c", "print(1)")),
    shell("frobnicate", part("frobnicate", CommandCategory.UNKNOWN)),
    line_without_commands(),
    shell("pytest -q", part("pytest", CommandCategory.TEST_RUN, "-q")),
    shell("make all", part("make", CommandCategory.BUILD, "all")),
    shell("curl example.com", part("curl", CommandCategory.NETWORK, "example.com")),
    shell("git push", part("git", CommandCategory.VERSION_CONTROL, "push")),
    shell("journal pytest-run tests", part("journal", CommandCategory.TEST_RUN, "pytest-run", "tests")),
], ids=["redirect", "tee", "sed -i", "script", "python -c", "unknown program", "no parts", "test run", "build", "curl", "git push", "saved test run"])
def test_a_read_only_helper_runs_nothing_that_changes_or_reaches_out(new_story, helper_fixture, sample):
    story, session = helper_story(new_story, helper_fixture)
    story.expect_hook_refusal(session, sample, "reads and searches only")


@pytest.mark.parametrize("line", ["phase make --plan 1 Totals", "phase place 1 --phase 1", "phase move 1 --to 2", "doc --help", "agent stop --help"])
def test_a_read_only_planner_can_file_its_plan_and_ask_any_command_for_its_help(new_story, line):
    story, session = helper_story(new_story, PROGRAMS[0])
    arguments = line.split()
    story.expect_hook_allowed(session, shell(f"journal {line}", part("journal", CommandCategory.JOURNAL, *arguments)))


@pytest.mark.parametrize("helper_fixture", PROGRAMS)
def test_a_line_the_hook_could_not_judge_is_refused_with_a_way_on(new_story, helper_fixture):
    story, session = helper_story(new_story, helper_fixture)
    story.expect_hook_refusal(session, shell("awk 'x' a", part("awk", CommandCategory.READ, "x", "a", uncertain=True)), UNJUDGED_LINE.nudge().text)


@pytest.mark.parametrize("helper_fixture", PROGRAMS)
def test_an_old_hook_is_refused_and_told_to_update(new_story, helper_fixture):
    story, session = helper_story(new_story, helper_fixture)
    sample = shell("cat a", part("cat", CommandCategory.READ, "a"))
    del sample.body["tool"]["shell"]["parts"][0]["classification"]["uncertain"]
    story.expect_hook_refusal(session, sample, OLD_HOOK_LINE.nudge().text)


@pytest.mark.parametrize("helper_fixture", PROGRAMS)
@pytest.mark.parametrize("arguments", [("check", "run", "3"), ("check", "make", "x"), ("alias", "add", "x", "pytest")], ids=["check run", "check make", "alias add"])
def test_a_journal_line_that_runs_a_program_is_refused(new_story, helper_fixture, arguments):
    story, session = helper_story(new_story, helper_fixture)
    story.expect_hook_refusal(session, shell(f"journal {' '.join(arguments)}", part("journal", CommandCategory.JOURNAL, *arguments)), OUTWARD_JOURNAL_LINE.nudge().text)


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
@pytest.mark.parametrize("arguments", [("task", "list"), ("task", "show", "1"), ("report", "make", "x"), ("doc", "make", "x"), ("task", "make", "x"), ("task", "log", "1", "x"), ("memory", "make", "x")],
                         ids=["reads a list", "reads a row", "report", "doc", "new task", "task log", "memory"])
def test_a_read_only_helper_reads_and_writes_rows_of_its_own(new_story, helper_fixture, arguments):
    story, session = helper_story(new_story, helper_fixture)
    expect_reply_allowed(story.hook(session, journal_line(*arguments)))


@pytest.mark.parametrize("helper_fixture", PROGRAMS)
@pytest.mark.parametrize("arguments", [("task", "close", "1"), ("task", "delete", "1"), ("plan", "start", "1"), ("rule", "make", "x"), ("setting", "set", "a", "b")],
                         ids=["close a task", "delete a task", "start a plan", "make a rule", "set a setting"])
def test_a_read_only_helper_writes_no_row_of_another(new_story, helper_fixture, arguments):
    story, session = helper_story(new_story, helper_fixture)
    story.expect_hook_refusal(session, journal_line(*arguments), OUTWARD_JOURNAL_LINE.nudge().text)


@pytest.mark.parametrize("helper_fixture", PROGRAMS)
@pytest.mark.parametrize("arguments", [("worker", "merge", "5"), ("skill", "require", "x"), ("plugin", "install", "x")], ids=["merge", "skill", "plugin"])
def test_a_read_only_helper_changes_no_project_file(new_story, helper_fixture, arguments):
    story, session = helper_story(new_story, helper_fixture)
    story.expect_hook_refusal(session, journal_line(*arguments), OUTWARD_JOURNAL_LINE.nudge().text)


@pytest.mark.parametrize("helper_fixture", PROGRAMS)
@pytest.mark.parametrize("arguments", [("agent", "start", "s-9", "claude", "main"), ("agent", "stop", "1"), ("agent", "type", "1", "x"), ("worker", "release", "5", "x"), ("helper", "start", "x"), ("worker", "dispatch", "1")],
                         ids=["agent start", "agent stop", "agent type", "worker release", "helper start", "worker dispatch"])
def test_a_read_only_helper_acts_on_no_other_agent(new_story, helper_fixture, arguments):
    story, session = helper_story(new_story, helper_fixture)
    story.expect_hook_refusal(session, journal_line(*arguments), OUTWARD_JOURNAL_LINE.nudge().text)


@pytest.mark.parametrize("helper_fixture", PROGRAMS)
@pytest.mark.parametrize("line", [f"{SESSION_VARIABLE}=s-1 journal task list", f"env {SESSION_VARIABLE}=s-1 journal task list", f"export {SESSION_VARIABLE}=s-1"], ids=["prefix", "env", "export"])
def test_a_read_only_helper_cannot_name_another_session(new_story, helper_fixture, line):
    story, session = helper_story(new_story, helper_fixture)
    story.expect_hook_refusal(session, shell(line, part("journal", CommandCategory.JOURNAL, "task", "list")), OUTWARD_JOURNAL_LINE.nudge().text)


REPORT_TEXT = "Run `rm -rf a` in $HOME and \"tests/stories/core/a.py\" with python3 and curl.\n" * 800


def test_a_long_report_holding_program_names_is_filed_whole(new_story):
    story = new_story(fixture=StartedHelper)
    story.expect_success(f'report make Findings --abstract "What was read" --body {shlex.quote(REPORT_TEXT)} --environment main', actor=story.agent)
    story.expect_rows(len(REPORT_TEXT) > 60000, story.container.get(Queries).query(Report).filter(title="Findings").first().body == REPORT_TEXT)


@pytest.mark.parametrize("helper_fixture", PROGRAMS)
@pytest.mark.parametrize("line, arguments", [("git diff", ["diff"]), ("git log -5", ["log", "-5"]), ("git blame a.py", ["blame", "a.py"])], ids=["diff", "log", "blame"])
def test_a_read_only_helper_reads_version_control(new_story, helper_fixture, line, arguments):
    story, session = helper_story(new_story, helper_fixture)
    expect_reply_allowed(story.hook(session, shell(line, part("git", CommandCategory.READ, *arguments))))


@pytest.mark.parametrize("helper_fixture", PROGRAMS)
def test_git_output_to_a_file_is_refused(new_story, helper_fixture):
    story, session = helper_story(new_story, helper_fixture)
    sample = shell("git diff --output=a", part("git", CommandCategory.EDIT, "diff", "--output=a", effects=WRITES))
    story.expect_hook_refusal(session, sample, "reads and searches only")


def test_an_ended_helper_is_refused_its_next_tool_and_writes_no_second_report(new_story):
    story, session = helper_story(new_story, StartedHelper)
    story.expect_success(f"agent end {helper_agent(story).id}", actor=story.user)
    story.run_listeners()
    story.expect_hook_refusal(session, tool("Edit", ToolType.EDIT), ENDED_AGENT.nudge().text)
    lines_at_end = story.run(f"agent-line list --agent {story.agent.id}", actor=story.user).output_text
    story.hook(session, HookSamples.stop())
    story.run_listeners()
    story.expect_rows(story.run(f"agent-line list --agent {story.agent.id}", actor=story.user).output_text == lines_at_end)


def test_a_codex_helper_ended_before_its_first_hook_is_refused_an_edit(new_story):
    story, launch_name = helper_story(new_story, StartedCodexHelper)
    story.expect_success(f"agent end {helper_agent(story).id}", actor=story.user)
    story.expect_hook_refusal("t-9", tool("Edit", ToolType.EDIT).with_fields(program="codex", launch=launch_name), ENDED_AGENT.nudge().text)


def main_story(new_story):
    return new_story(fixture=BuilderWithUser)


@pytest.mark.parametrize("name, category", [("Agent", ToolType.AGENT), ("Task", ToolType.AGENT), ("collaborationspawn_agent", ToolType.AGENT), ("spawn_agent", ToolType.UNCATEGORISED), ("collaborationwait", ToolType.UNCATEGORISED)])
def test_a_programs_own_subagent_tool_is_refused_with_the_way_on(new_story, name, category):
    story = main_story(new_story)
    launcher = FakeLauncher(story.home.socket("launcher"))
    story.expect_hook_refusal("s-1", tool(name, category), "start a helper for this")
    launcher.server.close()


def test_with_no_launcher_the_refusal_says_to_keep_the_work(new_story):
    story = main_story(new_story)
    story.expect_hook_refusal("s-1", tool("Agent", ToolType.AGENT), "keep this work yourself")


def test_a_wait_does_not_lift_the_subagent_refusal(new_story):
    story = main_story(new_story)
    story.run('wait stuck "no way on"', actor=story.agent)
    story.expect_hook_refusal("s-1", tool("Agent", ToolType.AGENT), "keep this work yourself")


def test_a_tool_called_by_a_programs_own_child_is_refused(new_story):
    story = main_story(new_story)
    story.expect_hook_refusal("s-1", tool("Read", ToolType.READ).with_fields(child_agent="child-1"), "keep this work yourself")

from dataclasses import replace

from core.base.actor import Actor
from core.base.command.context import Context
from core.base.database.database import Database
from core.base.driver.command_category import CommandCategory
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.messages.commands.read_message.read_message import ReadMessage
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, moved_run
from tests.stories.core.support.coding_fixtures import BuilderStarted

BUILD = HookSamples.shell("make build", ShellPart("make", CommandCategory.UNKNOWN, ["build"])).with_fields(program="codex")
STOP = HookSamples.stop().with_fields(program="codex")


def shell_line(line: str):
    parts = line.split()
    return HookSamples.shell(line, ShellPart(parts[0], CommandCategory.JOURNAL, parts[1:], subcommand=parts[1])).with_fields(program="codex")


def codex_story(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    agent = story.container.get(Queries).query(Agent).find(story.agent.id)
    with story.container.get(Database).transaction():
        story.container.get(Repository).save(replace(agent, program="codex"), Context(Actor.core(), story.clock.timestamp(), ReadMessage(1)))
    return story


def test_a_codex_agent_with_a_run_going_keeps_working(new_story):
    story = codex_story(new_story)
    moved_run(story, "make test")
    assert not story.hook("s-1", BUILD).refusal


def test_a_stop_holds_a_codex_agent_until_it_runs_the_monitor_command_in_its_shell(new_story):
    story = codex_story(new_story)
    process = moved_run(story, "make test")
    refusal = story.hook("s-1", STOP).refusal
    assert f"run journal output monitor {process.id}" in refusal and "Monitor" not in refusal


def test_the_monitor_command_in_its_shell_lets_a_codex_agent_stop(new_story):
    story = codex_story(new_story)
    process = moved_run(story, "make test")
    assert not story.hook("s-1", shell_line(f"journal output monitor {process.id}")).refusal
    assert "journal output monitor" not in story.hook("s-1", STOP).refusal


def test_the_monitor_command_on_another_run_does_not_let_a_codex_agent_stop(new_story):
    story = codex_story(new_story)
    process = moved_run(story, "make test")
    story.hook("s-1", shell_line(f"journal output monitor {process.id + 1}"))
    story.expect_hook_refusal("s-1", STOP, f"run journal output monitor {process.id}")


def test_a_run_that_ended_no_longer_holds_a_codex_agents_stop(new_story):
    story = codex_story(new_story)
    process = moved_run(story, "make test")
    end_run(story, process, "done\n")
    assert "journal output monitor" not in story.hook("s-1", STOP).refusal


def test_reads_and_journal_commands_still_go_through_while_a_codex_agent_is_held(new_story):
    story = codex_story(new_story)
    moved_run(story, "make test")
    assert not story.hook("s-1", shell_line("journal task list")).refusal


def test_a_codex_agent_that_asks_for_a_runs_status_is_told_to_run_the_monitor_command(new_story):
    story = codex_story(new_story)
    process = moved_run(story, "make test")
    lines = story.hook("s-1", shell_line(f"journal output status {process.id}")).lines
    assert any(f"run journal output monitor {process.id}" in line and "Monitor on" not in line for line in lines)


def test_a_claude_agent_still_may_not_run_the_monitor_command_in_its_shell(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, "make test")
    claude_line = HookSamples.shell(f"journal output monitor {process.id}", ShellPart("journal", CommandCategory.JOURNAL, ["output", "monitor", str(process.id)], subcommand="output"))
    story.expect_hook_refusal("s-1", claude_line, "runs only in a Monitor")

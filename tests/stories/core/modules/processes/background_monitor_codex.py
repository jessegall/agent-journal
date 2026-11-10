from dataclasses import replace

from engine.actor.actor import Actor
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
from core.testing.expect_reply import expect_absent_reply_refusal, expect_reply_allowed
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


def test_the_monitor_command_in_its_shell_lets_a_codex_agent_stop(new_story):
    story = codex_story(new_story)
    process = moved_run(story, "make test")
    expect_reply_allowed(story.hook("s-1", shell_line(f"journal output monitor {process.id}")))
    expect_absent_reply_refusal(story.hook("s-1", STOP), "still runs")


def test_the_monitor_command_on_another_run_does_not_let_a_codex_agent_stop(new_story):
    story = codex_story(new_story)
    process = moved_run(story, "make test")
    story.hook("s-1", shell_line(f"journal output monitor {process.id + 1}"))
    story.expect_hook_refusal("s-1", STOP, "wait for it before you stop")


def test_a_codex_agent_that_asks_for_a_runs_status_is_told_to_run_the_monitor_command(new_story):
    story = codex_story(new_story)
    process = moved_run(story, "make test")
    lines = story.hook("s-1", shell_line(f"journal output status {process.id}")).lines
    expect_lines_6("wait for it, which ends when the run does", "Monitor", lines)


def expect_lines_6(text, text_2, lines) -> None:
    actual = any((text in line and text_2 not in line for line in lines))
    assert actual, actual

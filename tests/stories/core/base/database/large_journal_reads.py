import pytest

from core.base.actor import Actor
from core.base.cli.line_parser import LineParser
from core.base.database.database import READ_LIMIT_ROWS, Database
from core.base.query.queries import Queries
from core.base.registry.registry import Registry
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.agents.models.agent import Agent
from core.testing.hook_samples import HookSamples
from engine.enums.actor_type import ActorType
from tests.stories.core.base.support.large_journal import EDIT, LargeJournal, TableCopies, required_arguments

SESSIONS = ("s-1", "s-helper", "s-worker")

OPEN_LARGE_READS: tuple[str, ...] = ()
OPEN_COMMAND_READS = (
    "FROM environments LIMIT",
    "FROM tasks WHERE created_at > ?",
    "FROM agents WHERE environment_id = ? LIMIT",
    "FROM helper_jobs WHERE created_at > ?",
    "FROM agents WHERE ended_at IS NULL AND environment_id = ? ORDER BY id ASC LIMIT 200",
    "FROM checks WHERE hidden",
    "FROM docs ORDER BY",
    "FROM reports ORDER BY",
    "FROM dock_items WHERE dock_id",
    "FROM wait_targets WHERE resolved_at IS NULL",
    "FROM environment_menu_rows",
    "FROM messages WHERE created_at >= ?",
    "FROM nudge_totals",
    "FROM person_presets",
    "FROM suggestions WHERE",
    "FROM task_cards WHERE state",
    "FROM task_edges",
    "FROM agent_cards WHERE ended_at IS NULL",
    "FROM agents WHERE ended_at IS NULL AND retired_at IS NULL",
    "FROM hook_calls WHERE hook IN",
    "FROM viewer_layouts",
)


"""The reads of OPEN_LARGE_READS and OPEN_COMMAND_READS loaded more than the limit when this test was written (task 8753). Each is
fixed under task 8738 and then taken out; a read that is not listed fails the test."""


OUTSIDE_COMMAND_GROUPS = frozenset({
    "helper", "library", "library-user", "mcp", "merger", "phone", "plugin", "process", "program", "project-worktree", "secret", "share",
    "tool", "transcription", "tunler", "tunnel", "update", "voice", "worker", "worker-operation", "worktree",
})


"""The commands of OUTSIDE_COMMAND_GROUPS start a program, call the network or change a git checkout, so the
large journal runs none of them."""


def command_lines(story, is_read: bool) -> list[str]:
    parser = story.container.get(LineParser)
    lines = []
    for name, subcommand in sorted(story.container.get(Registry).subcommands.items()):
        if isinstance(subcommand, ReadSubcommand) is is_read and name.split()[0] not in OUTSIDE_COMMAND_GROUPS:
            lines.append(" ".join([name, *required_arguments(parser.parser(name.split())[1])]))
    return lines


def large_reads(story, database, label: str, work) -> list[str]:
    database.collected_large_reads = []
    try:
        work()
    except Exception as error:
        return [f"{label}: {type(error).__name__}: {str(error)[:300]}"] if "Repeated" in type(error).__name__ else []
    finally:
        collected, database.collected_large_reads = database.collected_large_reads, None
    return [f"{label}: {error}" for error in collected]


def test_no_read_command_and_no_hook_loads_more_rows_than_the_read_limit_on_a_large_journal(new_story):
    story = new_story(fixture=LargeJournal)
    database = story.container.get(Database)
    database.read_limit_rows = READ_LIMIT_ROWS
    worker = story.container.get(Queries).query(Agent).filter(session="s-worker").first()
    actors = {"main agent": story.agent, "person": story.user, "helper": story.helper, "worker": Actor(worker.id, ActorType.AGENT)}
    findings: list[str] = []
    for line in command_lines(story, is_read=True):
        for role, actor in actors.items():
            findings += large_reads(story, database, f"{line} as {role}", lambda: story.run(line, actor=actor))
    for session in SESSIONS:
        for sample in (HookSamples.session_start(), HookSamples.prompt("go on"), EDIT, HookSamples.stop(), HookSamples.tick()):
            findings += large_reads(story, database, f"hook {sample.body.get('event', '')} of {session}", lambda: story.hook(session, sample))
    findings += large_reads(story, database, "the commit listeners", story.run_listeners)
    distinct = sorted(set(findings))
    unlisted = [finding for finding in distinct if not any(fragment in finding for fragment in OPEN_LARGE_READS)]
    fixed = [fragment for fragment in OPEN_LARGE_READS if not any(fragment in finding for finding in distinct)]
    story.expect_rows(not unlisted, detail=f"{len(unlisted)} new reads over the limit; small tables {TableCopies(database).small_tables()}:\n" + "\n".join(unlisted))
    story.expect_rows(not fixed, detail="these reads are fixed, so take them out of OPEN_LARGE_READS:\n" + "\n".join(fixed))


@pytest.mark.story_budget(cpu_seconds=20, reason="it runs every changing command of the journal twice on a journal with many rows")
def test_no_changing_command_and_no_listener_after_it_loads_more_rows_than_the_read_limit_on_a_large_journal(new_story):
    story = new_story(fixture=LargeJournal)
    database = story.container.get(Database)
    database.read_limit_rows = READ_LIMIT_ROWS
    findings: list[str] = []
    for line in command_lines(story, is_read=False):
        for role, actor in {"main agent": story.agent, "person": story.user}.items():
            findings += large_reads(story, database, f"{line} as {role}", lambda: story.run(line, actor=actor))
    findings += large_reads(story, database, "the commit listeners", story.run_listeners)
    distinct = sorted(set(findings))
    unlisted = [finding for finding in distinct if not any(fragment in finding for fragment in OPEN_COMMAND_READS)]
    fixed = [fragment for fragment in OPEN_COMMAND_READS if not any(fragment in finding for finding in distinct)]
    story.expect_rows(not unlisted, detail=f"{len(unlisted)} new reads over the limit:\n" + "\n".join(unlisted))
    story.expect_rows(not fixed, detail="these reads are fixed, so take them out of OPEN_COMMAND_READS:\n" + "\n".join(fixed))

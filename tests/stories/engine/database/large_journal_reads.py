import pytest

from engine.cli.errors.usage_error import UsageError
from engine.actor.actor import Actor
from engine.cli.line_parser import LineParser
from engine.database.database import READ_LIMIT_ROWS, Database
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.agents.models.agent import Agent
from engine.testing.examples.hook_samples import HookSamples
from engine.enums.actor_type import ActorType
from tests.stories.engine.support.large_journal import EDIT, HELPER_PROFILES, LargeJournal, TableCopies, required_arguments

SESSIONS = ("s-1", "s-helper", "s-worker")

OPEN_LARGE_READS: tuple[str, ...] = ()
OPEN_COMMAND_READS: tuple[str, ...] = ()


"""The reads of OPEN_LARGE_READS and OPEN_COMMAND_READS loaded more than the limit when this test was written (task 8753). Each is
fixed under task 8738 and then taken out; a read that is not listed fails the test."""


OUTSIDE_COMMAND_GROUPS = frozenset({
    "demo", "helper", "library", "library-user", "mcp", "merger", "phone", "plugin", "process", "program", "project-worktree", "secret", "share",
    "tool", "transcription", "tunler", "tunnel", "update", "voice", "worker", "worker-operation", "worktree",
})


"""The commands of OUTSIDE_COMMAND_GROUPS start a program, call the network, copy the code or change a git checkout, so the
large journal runs none of them."""


def command_lines(story, is_read: bool) -> list[str]:
    parser = story.container.get(LineParser)
    lines = []
    for cli_name in parser.lookup.cli_names():
        if cli_name in OUTSIDE_COMMAND_GROUPS:
            continue
        for name in parser.lookup.names(cli_name):
            try:
                subcommand, line_parser = parser.parser([cli_name, name])
            except UsageError:
                continue
            if isinstance(subcommand, ReadSubcommand) is is_read:
                lines.append(" ".join([cli_name, name, *required_arguments(line_parser)]))
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


@pytest.mark.story_budget(points=80000, reason="it runs every read command of the journal as nine actors on a journal with many rows")
def test_no_read_command_and_no_hook_loads_more_rows_than_the_read_limit_on_a_large_journal(new_story):
    story = new_story(fixture=LargeJournal)
    database = story.container.get(Database)
    database.read_limit_rows = READ_LIMIT_ROWS
    worker = story.container.get(Queries).query(Agent).filter(session="s-worker").first()
    actors = {"main agent": story.agent, "person": story.user, "helper": story.helper, "worker": Actor(worker.id, ActorType.AGENT)}
    profile_helpers = story.container.get(Queries).query(Agent).matching(Among("profile", HELPER_PROFILES)).take(len(HELPER_PROFILES) * 2)
    actors.update({f"{helper.profile} helper": Actor(helper.id, ActorType.AGENT) for helper in profile_helpers})
    story.expect_rows(len({helper.profile for helper in profile_helpers}) == len(HELPER_PROFILES), detail=str(sorted({helper.profile for helper in profile_helpers})))
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

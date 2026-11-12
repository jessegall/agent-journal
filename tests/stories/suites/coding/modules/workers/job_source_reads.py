from engine.actor.actor import Actor
from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from engine.command.context import Context
from engine.database.database import Database
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.messages.commands.read_message.read_message import ReadMessage
from suites.coding.modules.workers.models.worker_task_source import WorkerTaskSource
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_job import WORKER_JOB_SOURCE
from tests.stories.core.modules.plugins.support.checkout_stories import checkout_story
from tests.stories.support.statement_counts import reads_in_last_request

TEST_ROWS_REASON = "the test reads every row it checks"
LINE_COUNT = 12
LISTING_SAMPLE = HookSamples.shell("ls", ShellPart("ls", CommandCategory.READ, []))


def test_a_hook_that_delivers_twelve_worker_lines_reads_their_task_sources_once(new_story):
    story = checkout_story(new_story)
    worktree = story.container.get(WorktreeQuery).worker_worktree(story.worker.id)
    context = Context(Actor.core(), story.clock.timestamp(), ReadMessage(1))
    with story.container.get(Database).transaction():
        for number in range(LINE_COUNT):
            line = story.container.get(Repository).save(AgentLine(session_agent_id=story.worker.id, creator_id=story.agent.id, text=f"Go on {number}", source=WORKER_JOB_SOURCE), context)
            story.container.get(Repository).save(WorkerTaskSource(creator_id=story.agent.id, worktree_id=worktree.id, task_id=worktree.task_id, environment_id=worktree.environment_id,
                                                                   source_line_id=line.id), context)
    story.hook(story.worker_session, LISTING_SAMPLE)
    reads = reads_in_last_request(story, "SELECT * FROM worker_task_sources")
    sources = story.container.get(Queries).query(WorkerTaskSource).every_row(TEST_ROWS_REASON)
    story.expect_rows(reads == 1, all(source.started_at is not None for source in sources), detail=f"{reads} source reads")

from core.base.actor import Actor
from core.base.command.context import Context
from core.base.database.database import Database
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.messages.commands.read_message.read_message import ReadMessage
from core.modules.processes.models.output import Output
from tests.stories.core.modules.processes.output_reader import append
from tests.stories.core.modules.processes.support.process_samples import install_runner, start_process, tick
from tests.stories.core.support.coding_fixtures import BuilderStarted

LISTED_TESTS = 4


def record_listed_count(story, process_id: int) -> None:
    """A vitest run prints no total before it ends; the stock reader's listing gives it, and this sets the count that listing would give."""
    output = story.container.get(Queries).query(Output).filter(process_id=process_id).first()
    with story.container.get(Database).transaction():
        story.container.get(Repository).update(output, Context(Actor.core(), story.clock.timestamp(), ReadMessage(1)), test_count=LISTED_TESTS)


def test_vitest_progress_moves_as_tests_finish(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = start_process(story, "vitest run")
    record_listed_count(story, process.id)
    append(story, process.id, " ✓ one.test.ts (2 tests) 12ms\n")
    tick(story)
    story.expect_text(f"output show {process.id}", "progress: 50", actor=story.agent)
    append(story, process.id, " × second\n")
    tick(story)
    story.expect_text(f"output show {process.id}", "progress: 75", actor=story.agent)

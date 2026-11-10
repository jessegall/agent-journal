import pytest
from datetime import timedelta
from pathlib import Path

from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.module.module_finder import ModuleFinder
from core.modules.agents.commands.end_agent.end_agent import EndAgent
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import repository_environment
pytestmark = pytest.mark.real_git

COPY = "vendor"
LIBRARY_FILE = "lib.txt"
CHANGED_FILE = "notes.md"


def stopped_worker(story):
    repository = repository_environment(story)
    (repository.folder / COPY).mkdir()
    (repository.folder / COPY / LIBRARY_FILE).write_text("library\n")
    repository.git("config", "core.excludesfile", "")
    story.run("worker dispatch --test-command python=pytest --model sonnet --library-copy vendor 1", actor=story.agent)
    worker = story.container.get(WorktreeQuery).all_worktrees()[-1].session_agent_id
    folder = Path(story.container.get(WorktreeQuery).worker_worktree(worker).folder)
    (folder / CHANGED_FILE).write_text("my change\n")
    story.container.get(Bus).run(EndAgent(worker), Actor.core(), environment_id=1)
    return worker, folder


def libraries_tick(story):
    handlers = [handler for module in ModuleFinder(story.home).modules() for handler in module.tick_handlers if handler.label == "stopped worker libraries"]
    story.expect_rows(len(handlers) == 1)
    handlers[0].handler(story.container)


def test_a_send_to_the_stopped_worker_copies_its_library_back_before_its_program_starts(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    worker, folder = stopped_worker(story)
    story.advance(timedelta(minutes=15))
    libraries_tick(story)
    story.expect_rows(not (folder / COPY).exists())
    story.expect_success(f'worker send --wait {worker} "go on"', actor=story.agent)
    story.expect_rows((folder / COPY / LIBRARY_FILE).read_text() == "library\n", (folder / CHANGED_FILE).is_file())

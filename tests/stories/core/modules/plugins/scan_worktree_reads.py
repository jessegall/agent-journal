from engine.agent.agent_checkouts import AgentCheckouts
from engine.model.tables import Tables
from suites.coding.modules.workers.models.worktree import Worktree
from tests.stories.core.modules.plugins.support.checkout_stories import checkout_story, real
from tests.stories.support.statement_counts import reads_in_last_request

CHANGED_FILES = 12


def test_the_checkouts_of_twelve_files_of_one_worktree_read_the_worktrees_once(new_story):
    story = checkout_story(new_story)
    table = story.container.get(Tables).table(Worktree).name
    checkouts = story.container.get(AgentCheckouts)
    with story.repeated_work.request():
        roots = [checkouts.file_checkout(story.worker.id, story.worktree / "src" / f"file-{number}.py").root for number in range(CHANGED_FILES)]
    reads = reads_in_last_request(story, f"SELECT * FROM {table} WHERE folder IN")
    story.expect_rows(all(str(root) == real(story.worktree) for root in roots), reads == 1, detail=f"{reads} worktree reads")

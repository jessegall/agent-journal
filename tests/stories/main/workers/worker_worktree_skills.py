from journal.features.tasks.states.external_wait import ExternalWait
from journal.features.tasks.states.ready import Ready
from journal.features.workers.workers_options import BUILDER_MODE
from journal.support.agent_role import AgentRole
from tests.stories.builder.story_marks import story
from tests.stories.fixtures.worker.worktree_worker import WorktreeWorker


@story(WorktreeWorker, mode=BUILDER_MODE, subject=AgentRole.MAIN)
def test_a_workers_worktree_links_the_checkouts_untracked_journal_skill_and_keeps_it_out_of_git(story):
    story.expect_worker_worktree_links(story.agents.workers.first(), ".claude/skills/journal")
    story.expect_stack(story.agents.subject, Ready, ExternalWait)

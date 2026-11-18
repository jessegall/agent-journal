from journal.engine.states.void import Void
from journal.features.tasks.states.external_wait import ExternalWait
from journal.features.tasks.states.ready import Ready
from journal.features.workers.states.working_task import WorkingTask
from journal.models.worker_state import WorkerState
from tests.stories.fixtures.main.briefed_task import BriefedTask
from tests.stories.fixtures.state_fixture import StateFixture


class WorktreeWorker(StateFixture):
    """The project is a throwaway git repository in the story's own temp folder; the agent sent a worker with a worktree of its own on the briefed task and it clocked in: story.agents.workers.first()."""

    stack = (Ready, ExternalWait)

    parent = BriefedTask

    def steps(self, story) -> None:
        story.project_is_a_git_repository()
        self.workers.first = story.agent_dispatches_worktree_worker(story.agents.main, "Lady Lovelace", self.tasks.briefed)
        story.agent_starts_a_session(story.agents.workers.first())
        story.agent_clocks_in(story.agents.workers.first())

    def expected(self, story) -> None:
        story.expect_worker(self.workers.first, state=WorkerState.READY)
        story.expect_stack(story.agents.workers.first(), Void, WorkingTask)

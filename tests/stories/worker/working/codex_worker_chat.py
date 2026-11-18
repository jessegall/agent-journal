from journal.features.workers.states.working_task import WorkingTask
from journal.engine.states.void import Void
from journal.features.workers.workers_options import BUILDER_MODE
from journal.providers.codex import Codex
from journal.support.agent_role import AgentRole
from tests.stories.builder.story_marks import provider, story
from tests.stories.fixtures.worker.unbound_worker import UnboundWorker


@story(UnboundWorker, mode=BUILDER_MODE, subject=AgentRole.WORKER)
@provider(Codex)
def test_a_codex_workers_job_is_the_first_message_of_its_chat_once_it_clocks_in_and_its_session_binds(story):
    story.agent_clocks_in(story.agents.subject)
    story.agent_reads(story.agents.subject)
    story.expect_worker_chat_after_its_job(story.agents.subject)
    story.expect_stack(story.agents.subject, Void, WorkingTask)

from core.base.query.queries import Queries
from core.modules.drivers.models.agent_block import AgentBlock
from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import BuilderStarted


def test_a_main_agent_gets_one_reader_count_at_session_start_without_a_block(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run('reader add old-build --commands "old-build*" --lines done', actor=story.agent)
    reply = story.hook("s-1", HookSamples.session_start())
    notices = [line for line in reply.lines if "readers need required fields" in line]
    story.expect_rows(len(notices) == 1, "3 readers" in notices[0], not reply.refusal,
                      not story.container.get(Queries).query(AgentBlock).exists())


def test_a_worker_gets_no_reader_count_at_session_start(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run("agent start s-reader-notice claude worker --environment main")
    reply = story.hook("s-reader-notice", HookSamples.session_start())
    story.expect_rows(not any("readers need required fields" in line for line in reply.lines))

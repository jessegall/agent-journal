from engine.query.queries import Queries
from core.modules.drivers.models.agent_block import AgentBlock
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import BuilderStarted

NOTICE = "readers need required fields"


def test_a_main_agent_gets_one_reader_count_after_its_session_start_without_a_block(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run('reader add old-build --commands "old-build*" --lines done', actor=story.agent)
    reply = story.hook("s-1", HookSamples.session_start())
    story.run_listeners()
    listed = story.run(f"agent-line list --agent {story.agent.id}", actor=story.user).output_text
    story.expect_rows(listed.count(f"1 {NOTICE}") == 1, not reply.refusal,
                      not story.container.get(Queries).query(AgentBlock).exists())


def test_a_worker_gets_no_reader_count_at_session_start(new_story):
    story = new_story(fixture=BuilderStarted)
    worker_id = story.new_row_id("agent start s-reader-notice claude worker --environment main")
    story.hook("s-reader-notice", HookSamples.session_start())
    story.run_listeners()
    story.expect_absent(f"agent-line list --agent {worker_id}", NOTICE)


def test_readers_with_complete_required_fields_need_no_notice(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run("reader remove dotnet-test", actor=story.agent)
    story.run("reader remove phpunit", actor=story.agent)
    reply = story.hook("s-1", HookSamples.session_start())
    story.run_listeners()
    story.expect_absent(f"agent-line list --agent {story.agent.id}", NOTICE)
    story.expect_rows(not reply.refusal)

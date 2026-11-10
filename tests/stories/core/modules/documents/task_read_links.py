from engine.query.queries import Queries
from core.modules.documents.models.link import Link
from core.modules.tasks.models.task_read import TaskRead
from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import ReadTaskBuilder


def test_compaction_removes_links_to_deleted_task_reads(new_story):
    story = new_story(fixture=ReadTaskBuilder)
    read = story.container.get(Queries).query(TaskRead).filter(session_agent_id=story.agent.id).first()
    story.expect_success(f'doc make "Reading" --abstract "Notes" --body "Text" --about task_read:{read.id}', actor=story.agent)
    links = story.container.get(Queries).query(Link).filter(target_model="task_read", target_id=read.id)
    story.expect_rows(links.exists())
    story.expect_hook_allowed("s-1", HookSamples.sample("compact"))
    story.expect_rows(not links.exists())

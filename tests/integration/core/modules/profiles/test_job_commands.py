from pathlib import Path

from core.modules.profiles.support.profile_files import ProfileFiles
from tests.stories.core.support.coding_fixtures import UserBuilder, BuilderHelper, OpenTaskOrchestrator
from tests.stories.core.modules.processes.support.process_samples import install_runner
from tests.stories.core.modules.profiles.support.job_commands import expect_published_commands, expect_helper_commands, expect_worker_commands
from tests.stories.support.story_checks import expect_value








def test_the_committed_copies_of_the_shipped_profiles_are_what_publish_writes(played):
    story = played(UserBuilder)
    files = story.container.get(ProfileFiles)
    files.publish()
    repository = Path(__file__).resolve().parents[5]
    published = files.folder(".claude/agents")
    stale = [path.name for path in sorted(published.glob("journal-*.md")) if (repository / ".claude/agents" / path.name).read_text() != path.read_text()]
    expect_value(stale, [])

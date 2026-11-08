from core.base.journal_home import JournalHome
from core.base.query.queries import Queries
from core.modules.approvals.models.approval_request import ApprovalRequest
from core.testing.hook_samples import HookSamples
from server.booting_work import BootingWork
from core.testing.story_fixture import StoryFixture
from tests.stories.core.base.driver.support.hook_agents import hook_agent
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.support.story_checks import expect_value


def doubled_import(story):
    project = story.container.get(JournalHome).project_folder
    (project / "AGENTS.md").write_text("# Rules\n")
    (project / "CLAUDE.md").write_text("@AGENTS.md\n\nWords\n@AGENTS.md\n")
    story.agent = hook_agent(story, story.hook("s-1", HookSamples.session_start()))
    story.run_listeners()
    return project / "CLAUDE.md"


def test_a_doubled_import_asks_the_person_and_their_accept_removes_the_extra_line(new_story):
    story = new_story(fixture=UserJoined)
    claude = doubled_import(story)
    approval = story.container.get(Queries).query(ApprovalRequest).newest().first()
    expect_value(approval.text, "CLAUDE.md puts AGENTS.md into every context more than once. Remove the extra import line?")
    story.expect_success(f"approval accept {approval.id} --environment main", actor=story.user)
    story.run_listeners()
    expect_value(claude.read_text(), "@AGENTS.md\n\nWords\n")


class StartedMain(StoryFixture):
    parent = UserJoined

    def steps(self, story):
        story.agent = hook_agent(story, story.hook("s-1", HookSamples.session_start()))
        story.run_listeners()


def test_an_agent_cannot_remove_an_import_line_itself(new_story):
    story = new_story(fixture=StartedMain)
    project = story.container.get(JournalHome).project_folder
    (project / "AGENTS.md").write_text("# Rules\n")
    (project / "CLAUDE.md").write_text("@AGENTS.md\n@AGENTS.md\n")
    story.expect_refusal("instruction-import remove CLAUDE.md AGENTS.md --environment main --reason needed", "A person was asked in the dock", actor=story.agent)


def test_a_journal_start_asks_about_a_doubled_import_too(new_story):
    story = new_story(fixture=StartedMain)
    project = story.container.get(JournalHome).project_folder
    (project / "AGENTS.md").write_text("# Rules\n")
    (project / "CLAUDE.md").write_text("@AGENTS.md\n@AGENTS.md\n")
    BootingWork().run(story.container)
    story.run_listeners()
    expect_value(story.container.get(Queries).query(ApprovalRequest).newest().first().arguments, ("instruction-import", "remove", "CLAUDE.md", "AGENTS.md"))

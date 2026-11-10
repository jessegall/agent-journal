import pytest
from engine.enums.tool_type import ToolType
from engine.testing.expectations.expect_reply import expect_reply_allowed
from core.modules.agents.testing.fake_launcher import FakeLauncher
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.modules.helpers.helper_jobs import helper_agent
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import repository_environment

SAVE_DESIGNER = 'profile save designer --type helper --access read-only --writable-folders docs/designs --description "Designs a screen" --body "Design in Claude Design and save the page and its picture."'
START_DESIGNER = 'helper start designer --brief "Design the agent settings page" --environment main'
DESIGN_FOLDER = "docs/designs/agent-settings"
REFUSED = "reads and searches only"


def started_designer(story):
    launcher = FakeLauncher.listening(story.home.socket("launcher"))
    story.expect_success(SAVE_DESIGNER, actor=story.user)
    story.run(START_DESIGNER, actor=story.agent)
    story.run_listeners()
    launcher.drain_requests()
    launcher.server.close()
    story.home.socket("launcher").unlink()
    return helper_agent(story)


def write(repository, relative: str):
    return HookSamples.tool_use("Write", ToolType.NEW_FILE, [str(repository.folder / relative)], None)


def test_the_designer_writes_under_docs_designs_and_nowhere_else(new_story):
    story = new_story(fixture=UserBuilder)
    repository = repository_environment(story)
    designer = started_designer(story)
    expect_reply_allowed(story.hook(designer.session, write(repository, f"{DESIGN_FOLDER}/agent-settings.html")))
    expect_reply_allowed(story.hook(designer.session, write(repository, f"{DESIGN_FOLDER}/agent-settings.png")))
    story.expect_hook_refusal(designer.session, write(repository, "src/cart.py"), REFUSED)
    story.expect_hook_refusal(designer.session, write(repository, f"{DESIGN_FOLDER}/../../../cart.py"), REFUSED)
    story.expect_hook_refusal(designer.session, write(repository, "docs/designs-other/page.html"), REFUSED)


@pytest.mark.real_git
def test_a_designer_job_ends_with_its_page_and_picture_committed(new_story):
    story = new_story(fixture=UserBuilder)
    repository = repository_environment(story)
    designer = started_designer(story)
    (repository.folder / DESIGN_FOLDER).mkdir(parents=True)
    (repository.folder / DESIGN_FOLDER / "agent-settings.html").write_text("<html>Agent settings</html>\n")
    (repository.folder / DESIGN_FOLDER / "agent-settings.png").write_bytes(b"\x89PNG")
    repository.uncommitted("cart.py", "TOTAL = 5\n")
    story.expect_success(f"agent end {designer.id}", actor=story.user)
    story.run_listeners()
    committed = repository.git("show", "--name-only", "--format=%s", "HEAD").stdout.splitlines()
    story.expect_rows(committed[0] == f"designer {designer.id}: saved docs/designs",
                      sorted(committed[2:]) == [f"{DESIGN_FOLDER}/agent-settings.html", f"{DESIGN_FOLDER}/agent-settings.png"],
                      repository.git("status", "--porcelain").stdout.strip() == "?? cart.py")

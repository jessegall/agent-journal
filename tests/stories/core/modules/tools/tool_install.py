from tests.stories.core.support.fixtures import UserJoined
from suites.coding.support.graphify_settings import GRAPHIFY_COMMAND
from suites.coding.support.graphify_settings import GRAPHIFY_INSTALL_COMMAND

GRAPHIFY_COMMAND = f"{GRAPHIFY_COMMAND}"
GRAPHIFY_INSTALL_COMMAND = f"{GRAPHIFY_INSTALL_COMMAND}"


def test_install_runs_the_install_command_and_the_card_shows_installed(new_story, tmp_path):
    story = new_story(fixture=UserJoined)
    installed = tmp_path / "installed-graphify"
    tool = tmp_path / "graphify"
    tool.write_text("#!/bin/sh\nexit 0\n")
    tool.chmod(0o755)
    installer = tmp_path / "installer"
    installer.write_text(f'#!/bin/sh\ncp "{tool}" "{installed}"\n')
    installer.chmod(0o755)
    story.expect_success(f"setting set {GRAPHIFY_COMMAND} {installed} --project", actor=story.user)
    story.expect_success(f"setting set {GRAPHIFY_INSTALL_COMMAND} {installer} --project", actor=story.user)
    story.expect_text("tool list", "not installed", actor=story.user)
    story.expect_text("tool install graphify", "installed", actor=story.user)
    story.expect_rows(installed.is_file())

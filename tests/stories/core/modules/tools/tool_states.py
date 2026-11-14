import pytest

from tests.stories.core.support.fixtures import UserJoined
from suites.coding.support.graphify_settings import GRAPHIFY_COMMAND, GRAPHIFY_INSTALL_COMMAND


def graphify_installer(story, tmp_path, installed_now: bool):
    installed = tmp_path / "installed-graphify"
    tool = tmp_path / "graphify"
    tool.write_text("#!/bin/sh\nexit 0\n")
    tool.chmod(0o755)
    installer = tmp_path / "installer"
    installer.write_text(f'#!/bin/sh\necho ran >> "{tmp_path / "install-runs"}"\ncp "{tool}" "{installed}"\n')
    installer.chmod(0o755)
    story.expect_success(f"setting set {GRAPHIFY_COMMAND} {installed} --project", actor=story.user)
    story.expect_success(f"setting set {GRAPHIFY_INSTALL_COMMAND} {installer} --project", actor=story.user)
    if installed_now:
        tool.rename(installed)
    return installed


def test_the_main_agent_lists_the_tools_with_each_name_and_state(new_story, tmp_path):
    story = new_story(fixture=UserJoined)
    graphify_installer(story, tmp_path, installed_now=False)
    story.expect_text("tool list", "graphify", "not installed", actor=story.agent)


def test_a_tool_the_person_turned_off_shows_off_in_the_main_agents_list(new_story, tmp_path):
    story = new_story(fixture=UserJoined)
    graphify_installer(story, tmp_path, installed_now=True)
    story.expect_success("tool off graphify", actor=story.user)
    story.expect_text("tool list", "graphify", "off", actor=story.agent)


def test_a_refresh_that_finds_the_tool_gone_says_it_is_missing_with_the_install_step(new_story, tmp_path):
    story = new_story(fixture=UserJoined)
    installed = graphify_installer(story, tmp_path, installed_now=True)
    installed.unlink()
    answer = story.run("tool refresh graphify", actor=story.user)
    story.expect_rows("not installed" in answer.output_text and "tool install graphify" in answer.output_text, detail=answer.output_text)


@pytest.mark.xfail(strict=True, reason="tool install runs the install command again for a tool that is installed")
def test_installing_a_tool_that_is_installed_says_so_and_runs_no_install(new_story, tmp_path):
    story = new_story(fixture=UserJoined)
    graphify_installer(story, tmp_path, installed_now=True)
    story.expect_text("tool install graphify", "already installed", actor=story.user)
    story.expect_rows(not (tmp_path / "install-runs").exists())

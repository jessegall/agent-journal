import shutil
import subprocess
from pathlib import Path

import pytest

from engine.process.leftover_process import LeftoverProcess
from core.modules.plugins.plugins_module import PluginsModule
from core.modules.plugins.support.orphan_services import OrphanServices
from core.modules.plugins.support.plugin_folders import PluginFolders
from tests.stories.core.modules.plugins.services import served_story
from tests.stories.support.story_checks import expect_value

SERVICE_KEY = ("served", "answers")
SERVICE_FILE = "serve.py"


def orphaned(program: Path, *arguments: str) -> int:
    started = subprocess.run(["sh", "-c", f'nohup python3 "{program}" {" ".join(arguments)} >/dev/null 2>&1 & echo $!'], capture_output=True, text=True, check=True)
    return int(started.stdout.strip())


@pytest.fixture
def served(new_story):
    story = served_story(new_story)
    yield story
    story.processes.close()


def plugin_program(story) -> Path:
    return story.container.get(PluginFolders).code("served") / SERVICE_FILE


def stopped(story) -> None:
    story.container.get(OrphanServices).stop(story.processes)


def test_a_leftover_process_of_this_projects_plugin_service_is_stopped(served):
    leftover = orphaned(plugin_program(served))
    stopped(served)
    expect_value(LeftoverProcess.is_running(leftover), False)


def test_the_supervised_service_is_left_running(served):
    stopped(served)
    expect_value(served.processes.running[SERVICE_KEY].running(), True)


def test_the_same_program_in_another_folder_is_left_alone(served, tmp_path):
    copy = tmp_path / SERVICE_FILE
    shutil.copy(plugin_program(served), copy)
    unrelated_process = orphaned(copy)
    stopped(served)
    expect_value(LeftoverProcess.is_running(unrelated_process), True)
    LeftoverProcess.stop(unrelated_process, str(copy))


def test_the_same_program_started_for_other_work_is_left_alone(served):
    unrelated_process = orphaned(plugin_program(served), "judge")
    stopped(served)
    expect_value(LeftoverProcess.is_running(unrelated_process), True)
    LeftoverProcess.stop(unrelated_process, str(plugin_program(served)))


def test_the_check_runs_once_a_minute():
    handler = next(handler for handler in PluginsModule.tick_handlers if handler.name == "orphan plugin service stopping")
    expect_value(handler.interval.seconds, 60)

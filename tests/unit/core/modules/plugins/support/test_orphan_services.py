from pathlib import Path
import subprocess

from core.modules.plugins.plugins_module import PluginsModule
from core.modules.plugins.support.orphan_services import OrphanServices
from core.modules.plugins.support.plugin_folders import PluginFolders
from tests.stories.support.story_checks import expect_value

SERVICE_KEY = ("served", "answers")
SERVICE_FILE = "serve.py"


def orphaned(program: Path, *arguments: str) -> int:
    started = subprocess.run(["sh", "-c", f'nohup python3 "{program}" {" ".join(arguments)} >/dev/null 2>&1 & echo $!'], capture_output=True, text=True, check=True)
    return int(started.stdout.strip())


def plugin_program(story) -> Path:
    return story.container.get(PluginFolders).code("served") / SERVICE_FILE


def stopped(story) -> None:
    story.container.get(OrphanServices).stop(story.processes)


def test_the_check_runs_once_a_minute():
    handler = next(handler for handler in PluginsModule.tick_handler_declarations() if handler.name == "orphan plugin service stopping")
    expect_value(handler.interval.seconds, 60)

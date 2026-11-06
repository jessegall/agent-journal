import json
import os
import shlex
from pathlib import Path

from core.base.driver.command_category import CommandCategory
from core.base.shell_sandbox import ShellSandbox
from core.modules.processes.support.runner_line import READ_FOLDERS_VARIABLE
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.plugins.support.checkout_stories import checkout_story, real
from tests.stories.core.modules.plugins.support.event_stories import event_folder, install_event_plugin, plugin_page

PREVIEW = Path("src/core/modules/plugins/web/src/PluginInstallPreview.vue")
RULES_TEXT = "the rules of the plugin"
EXTERNAL_PATH = "../outside"


def project_folder_setup(folder: str):
    def folder_maker(story) -> None:
        story.repository.library(folder, "config.json", RULES_TEXT)
    return folder_maker


def worker_read(story, folder: str) -> str:
    story.container.get(ShellSandbox).is_required = True
    path = f"{real(story.repository.folder)}/{folder}/config.json"
    reply = story.hook(story.worker_session, HookSamples.shell(f"cat {path}", ShellPart("cat", CommandCategory.READ, [path])))
    return str(reply.updated_input["command"])


def declared_folders(line: str) -> list[str]:
    value = next(token.split("=", 1)[1] for token in shlex.split(line) if token.startswith(f"{READ_FOLDERS_VARIABLE}="))
    return value.split(os.pathsep)


def test_s52_a_project_folder_a_plugin_declares_opens_for_the_shell_line_of_a_worker(new_story):
    story = checkout_story(new_story, setup_repository=project_folder_setup(".rules"), project_reads=[".rules"])
    story.expect_rows(declared_folders(worker_read(story, ".rules")) == [f"{real(story.repository.folder)}/.rules"])


def test_s52_the_rules_folder_opens_for_a_worker_through_a_declaration(new_story):
    story = checkout_story(new_story, setup_repository=project_folder_setup(".commandments"), project_reads=[".commandments"])
    story.expect_rows(declared_folders(worker_read(story, ".commandments")) == [f"{real(story.repository.folder)}/.commandments"])


def test_s52_a_folder_no_plugin_declares_is_not_opened(new_story):
    story = checkout_story(new_story, setup_repository=project_folder_setup(".rules"))
    story.expect_rows(READ_FOLDERS_VARIABLE not in worker_read(story, ".rules"))


def test_s52_a_second_plugin_declares_another_folder_and_each_is_open_for_the_shell_line(new_story):
    story = checkout_story(new_story, setup_repository=project_folder_setup(".rules"), project_reads=[".rules"])
    install_event_plugin(story, name="second", project_reads=[".more"])
    story.expect_rows(declared_folders(worker_read(story, ".rules")) == [f"{real(story.repository.folder)}/.rules", f"{real(story.repository.folder)}/.more"])


def test_s52_an_entry_that_leaves_the_project_is_wrong_on_the_card_and_is_not_opened(new_story):
    story = checkout_story(new_story, project_reads=[EXTERNAL_PATH])
    story.expect_rows(READ_FOLDERS_VARIABLE not in worker_read(story, ".rules"))
    card = plugin_page(story).card()
    story.expect_rows(any(EXTERNAL_PATH in json.dumps(row) and "wrong" in str(row["state"]) for row in card))


def test_s52_the_preview_says_what_a_plugin_reads_from_the_project(new_story):
    story = checkout_story(new_story)
    rows = plugin_page(story).preview(event_folder(story, name="second", project_reads=[".rules"]))
    story.expect_rows(any(row["command"] == ".rules" for row in rows), "Reads from the project" in PREVIEW.read_text())

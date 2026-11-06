import json
import os
import subprocess
import sys
from pathlib import Path

import pytest

from core.base.driver.command_category import CommandCategory
from core.base.shell_sandbox import ShellSandbox
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.plugins.support.checkout_stories import checkout_story, real
from tests.stories.core.modules.plugins.support.event_stories import event_folder, install_event_plugin, plugin_page
from tests.stories.core.modules.plugins.support.runner_binaries import real_runner_at

PREVIEW = Path("src/core/modules/plugins/web/src/PluginInstallPreview.vue")
RULES_TEXT = "the rules of the plugin"
RUN_LIMIT_SECONDS = 60
OUTSIDE_THE_PROJECT = "../outside"
needs_a_mac = pytest.mark.skipif(sys.platform != "darwin", reason="only the sandbox of a Mac holds the read limit")


def with_project_folder(folder: str):
    def write(story) -> None:
        story.repository.library(folder, "config.json", RULES_TEXT)
    return write


def worker_line_reading(story, folder: str) -> str:
    """The line a worker's shell line becomes, for a program that reads a file in the project folder."""
    path = f"{real(story.repository.folder)}/{folder}/config.json"
    reply = story.hook(story.worker_session, HookSamples.shell(f"cat {path}", ShellPart("cat", CommandCategory.READ, [path])))
    return str(reply.updated_input["command"])


def worker_reads(story, folder: str) -> subprocess.CompletedProcess[str]:
    """Runs the worker's line with the real runner and its real sandbox, which every story otherwise leaves out."""
    real_runner_at(story.home)
    story.container.bind(ShellSandbox, ShellSandbox(story.home))
    return subprocess.run(["sh", "-c", worker_line_reading(story, folder)], cwd=story.worktree, capture_output=True, text=True, timeout=RUN_LIMIT_SECONDS,
                          env={"PATH": os.environ["PATH"], "HOME": os.environ["HOME"], "JOURNAL_HOME": str(story.home.folder)})


def test_s52_a_project_folder_a_plugin_declares_opens_for_the_shell_line_of_a_worker(new_story):
    story = checkout_story(new_story, before_dispatch=with_project_folder(".rules"), project_reads=[".rules"])
    story.expect_rows(f"--read-folder {real(story.repository.folder)}/.rules" in worker_line_reading(story, ".rules"))


def test_s52_a_folder_no_plugin_declares_is_not_opened(new_story):
    story = checkout_story(new_story, before_dispatch=with_project_folder(".rules"))
    story.expect_rows("--read-folder" not in worker_line_reading(story, ".rules"))


@needs_a_mac
def test_s52_a_worker_reads_a_declared_folder_on_a_mac(new_story):
    story = checkout_story(new_story, before_dispatch=with_project_folder(".rules"), project_reads=[".rules"])
    finished = worker_reads(story, ".rules")
    assert finished.returncode == 0 and RULES_TEXT in finished.stdout, finished.stdout + finished.stderr


@needs_a_mac
def test_s52_a_worker_cannot_read_an_undeclared_folder_on_a_mac(new_story):
    story = checkout_story(new_story, before_dispatch=with_project_folder(".rules"))
    finished = worker_reads(story, ".rules")
    assert finished.returncode != 0 and RULES_TEXT not in finished.stdout, finished.stdout + finished.stderr


@needs_a_mac
def test_s52_a_worker_reads_commandments_when_a_plugin_declares_it(new_story):
    story = checkout_story(new_story, before_dispatch=with_project_folder(".commandments"), project_reads=[".commandments"])
    finished = worker_reads(story, ".commandments")
    assert finished.returncode == 0 and RULES_TEXT in finished.stdout, finished.stdout + finished.stderr


@needs_a_mac
def test_s52_a_worker_cannot_read_commandments_when_no_plugin_declares_it_after_the_second_step(new_story):
    story = checkout_story(new_story, before_dispatch=with_project_folder(".commandments"))
    finished = worker_reads(story, ".commandments")
    assert finished.returncode != 0 and RULES_TEXT not in finished.stdout, finished.stdout + finished.stderr


def test_s52_a_second_plugin_declares_another_folder_and_each_is_open_for_the_shell_line(new_story):
    story = checkout_story(new_story, before_dispatch=with_project_folder(".rules"), project_reads=[".rules"])
    install_event_plugin(story, name="second", project_reads=[".more"])
    line = worker_line_reading(story, ".rules")
    story.expect_rows(f"--read-folder {real(story.repository.folder)}/.rules" in line, f"--read-folder {real(story.repository.folder)}/.more" in line)


def test_s52_an_entry_that_leaves_the_project_is_wrong_on_the_card_and_is_not_opened(new_story):
    story = checkout_story(new_story, project_reads=[OUTSIDE_THE_PROJECT])
    story.expect_rows(OUTSIDE_THE_PROJECT not in worker_line_reading(story, ".rules"), "--read-folder" not in worker_line_reading(story, ".rules"))
    card = plugin_page(story).card()
    story.expect_rows(any(OUTSIDE_THE_PROJECT in json.dumps(row) and "wrong" in str(row["state"]) for row in card))


def test_s52_the_preview_says_what_a_plugin_reads_from_the_project(new_story):
    story = checkout_story(new_story)
    rows = plugin_page(story).preview(event_folder(story, name="second", project_reads=[".rules"]))
    story.expect_rows(any(row["command"] == ".rules" for row in rows), "Reads from the project" in PREVIEW.read_text())

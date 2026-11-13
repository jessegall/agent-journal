import json

import pytest

from tests.stories.core.support.agent_labels import agent_number
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.commit_command import COMMIT, request_merge
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import DISPATCH, dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH

pytestmark = pytest.mark.real_git

BUILT_FILE = "app/web/dist/chat.js"
SOURCES = ("app/web/src/a.vue", "app/web/src/b.vue")
FIRST_TEXTS = ("<template>first a</template>\n", "<template>first b</template>\n")
CHANGED_TEXTS = ("<template>changed a</template>\n", "<template>changed b</template>\n")
JOINING_BUILD = ('const fs = require("node:fs");\n'
                 'const sources = "../../app/web/src";\n'
                 'const folder = "../../app/web/dist";\n'
                 'fs.mkdirSync(folder, { recursive: true });\n'
                 'const names = fs.readdirSync(sources).sort();\n'
                 'fs.writeFileSync(folder + "/chat.js", names.map((name) => fs.readFileSync(sources + "/" + name, "utf8")).join(""));\n')
BUILD_FAILING_WHEN_BOTH_VIEWS_CHANGED = ('const fs = require("node:fs");\n'
                           'const sources = "../../app/web/src";\n'
                           'const names = fs.readdirSync(sources).sort();\n'
                           'const texts = names.map((name) => fs.readFileSync(sources + "/" + name, "utf8"));\n'
                           'if (texts.every((text) => text.includes("changed"))) { process.exit(1); }\n'
                           'fs.mkdirSync("../../app/web/dist", { recursive: true });\n'
                           'fs.writeFileSync("../../app/web/dist/chat.js", texts.join(""));\n')


def joined(texts) -> str:
    """The built file the build makes of these source texts, in the order of their names."""
    return "".join(texts)


def built_repository(story, build: str = JOINING_BUILD):
    """A project whose build joins its two view sources into one built file, built once and committed."""
    repository = repository_environment(story)
    repository.checkout(ENVIRONMENT_BRANCH)
    for folder in ("app/web/src", "app/web/dist", "src/viewer"):
        (repository.folder / folder).mkdir(parents=True)
    repository.committed("src/viewer/package.json", json.dumps({"scripts": {"build": "node build.cjs"}}), "The build command")
    repository.committed("src/viewer/build.cjs", build, "The build joins the view sources")
    for name, text in zip(SOURCES, FIRST_TEXTS, strict=True):
        repository.committed(name, text, f"The view source {name}")
    repository.committed(BUILT_FILE, joined(FIRST_TEXTS), "The first build")
    return repository


def worker_changes_single_view(story, repository, task_id: int, dispatch: str, view: int):
    """A worker changes one view source and commits the built file it built from its own sources."""
    worker = dispatched_worker(story, dispatch)
    own_texts = tuple(CHANGED_TEXTS[index] if index == view else FIRST_TEXTS[index] for index in range(len(SOURCES)))
    repository.changed(worker.id, SOURCES[view], CHANGED_TEXTS[view])
    repository.changed(worker.id, BUILT_FILE, joined(own_texts))
    story.expect_success(f'proof make 1 --task {task_id} "{SOURCES[view]}:1, the view story"', actor=worker)
    story.expect_success(COMMIT, actor=worker)
    return worker


def merged(story, worker, proof_id: int) -> None:
    story.expect_success(f"proof check {proof_id}", "state: checked", actor=story.agent)
    story.expect_success(f"worker logs {agent_number(story, worker.id)}", actor=story.agent)
    request_merge(story, worker)
    story.expect_success(f"worker merge --wait {agent_number(story, worker.id)}", actor=story.agent)


def test_two_workers_that_rebuilt_the_same_built_file_merge_one_after_the_other_and_the_build_matches_both_sources(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = built_repository(story)
    second_task = story.new_row_id('task make "Change the second view" --brief "Change view b" --environment main', actor=story.agent)
    first = worker_changes_single_view(story, repository, 1, DISPATCH, 0)
    second = worker_changes_single_view(story, repository, second_task, DISPATCH.removesuffix(" 1") + f" {second_task}", 1)
    merged(story, first, 1)
    repository.checkout(ENVIRONMENT_BRANCH)
    merged(story, second, 2)
    repository.expect_file(ENVIRONMENT_BRANCH, SOURCES[0], CHANGED_TEXTS[0])
    repository.expect_file(ENVIRONMENT_BRANCH, SOURCES[1], CHANGED_TEXTS[1])
    repository.expect_file(ENVIRONMENT_BRANCH, BUILT_FILE, joined(CHANGED_TEXTS))


def test_a_build_that_fails_after_a_built_file_clash_refuses_the_merge_and_leaves_the_checkout_clean(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = built_repository(story, BUILD_FAILING_WHEN_BOTH_VIEWS_CHANGED)
    worker = worker_changes_single_view(story, repository, 1, DISPATCH, 1)
    repository.checkout(ENVIRONMENT_BRANCH)
    repository.committed(SOURCES[0], CHANGED_TEXTS[0], "The first view changed on the branch")
    repository.committed(BUILT_FILE, joined((CHANGED_TEXTS[0], FIRST_TEXTS[1])), "The build of the first view")
    tip = repository.tip(ENVIRONMENT_BRANCH)
    story.expect_success("proof check 1", "state: checked", actor=story.agent)
    story.expect_success(f"worker logs {agent_number(story, worker.id)}", actor=story.agent)
    request_merge(story, worker)
    story.expect_refusal(f"worker merge --wait {agent_number(story, worker.id)}", "the build of the built files failed", actor=story.agent)
    repository.expect_branch_tip(ENVIRONMENT_BRANCH, tip)
    repository.expect_clean_checkout("app")
    repository.expect_file(ENVIRONMENT_BRANCH, BUILT_FILE, joined((CHANGED_TEXTS[0], FIRST_TEXTS[1])))

import pytest

from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.base_branch import checkout_of, committed_on
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH

pytestmark = pytest.mark.real_git

VERSION_FILE = "src/engine/version/version.py"
ENGINE_CONTRACT_FILE = "tests/snapshots/engine_contract.json"
SCRIPT_FILE = "scripts/engine_contract.py"
SCRIPT = '''import json
import re
from pathlib import Path

root = Path(__file__).resolve().parents[1]
version = re.search(r"\\((.*)\\)", (root / "src/engine/version/version.py").read_text()).group(1)
(root / "tests/snapshots/engine_contract.json").write_text(json.dumps({"version": version}) + "\\n")
'''


def version_text(numbers: str) -> str:
    return f"ENGINE_VERSION = ({numbers})\n"


def snapshot_text(numbers: str) -> str:
    return f'{{"version": "{numbers}", "pinned": "by a change of the engine"}}\n'


def test_an_update_whose_only_clash_is_the_engine_contract_takes_the_higher_version_and_writes_the_snapshot_again(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story, real_git=True)
    base = checkout_of(repository, ENVIRONMENT_BRANCH)
    committed_on(repository, base, SCRIPT_FILE, SCRIPT, "The contract script")
    committed_on(repository, base, VERSION_FILE, version_text("5, 3, 0"), "The engine version")
    committed_on(repository, base, ENGINE_CONTRACT_FILE, snapshot_text("5, 3, 0"), "The contract snapshot")
    worker = dispatched_worker(story)
    folder = repository.worktree_folder(worker.id)
    committed_on(repository, folder, VERSION_FILE, version_text("5, 4, 0"), "The worker changes the engine")
    committed_on(repository, folder, ENGINE_CONTRACT_FILE, snapshot_text("5, 4, 0"), "The worker pins its contract")
    committed_on(repository, base, VERSION_FILE, version_text("5, 5, 0"), "Another unit changes the engine")
    committed_on(repository, base, ENGINE_CONTRACT_FILE, snapshot_text("5, 5, 0"), "Another unit pins its contract")
    story.expect_text("worker update --wait", "Your worktree is on version-5 at", actor=worker)
    merging = repository.git("rev-parse", "--verify", "--quiet", "MERGE_HEAD", folder=folder).returncode == 0
    story.expect_rows(not merging, (folder / VERSION_FILE).read_text() == version_text("5, 5, 0"), '"version": "5, 5, 0"' in (folder / ENGINE_CONTRACT_FILE).read_text(),
                      "<<<<<<<" not in (folder / ENGINE_CONTRACT_FILE).read_text())

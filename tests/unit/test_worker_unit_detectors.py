import json
import shutil
import subprocess
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[2]
CUSTOM = ROOT / ".commandments" / "custom"
ALLOWED_PATHS = {
    "architecture_workers_worker_plan_read_outside_work_units": ("src/core/modules/plans", "src/suites/coding/modules/workers/support/work_units.py"),
    "architecture_workers_worktree_delivered_outside_commit_and_merge_request": ("src/suites/coding/modules/workers/commands/commit_worker_work/commit_worker_work_handler.py",
                                                                                 "src/suites/coding/modules/workers/commands/ask_merge/ask_merge_handler.py"),
    "architecture_workers_merge_request_row_built_outside_its_scope": ("src/suites/coding/modules/workers/support/merge_ask_scope.py", "src/suites/coding/modules/workers/commands/ask_merge"),
    "architecture_workers_worker_run_started_outside_start_worker_runs": ("src/suites/coding/modules/workers/commands/start_worker_runs",),
    "architecture_plans_checkpoint_reach_flag_read": ("src/core/modules/plans/models/checkpoint_reach.py",),
    "architecture_workers_delivery_command_in_a_text": ("src/suites/coding/modules/workers/commands/commit_worker_work/deliver_worker_work_subcommand.py",),
}
SKILLS = ("workers-architecture", "views-architecture", "plain-code-words")
SAMPLE = '''from core.modules.plans.support.plan_assignee import PlanAssignee


class SampleWorkerHelper:
    def plan_worker(self, plan):
        # @sin architecture_workers_worker_plan_read_outside_work_units
        return PlanAssignee.agent_id(plan)

    def deliver(self, worktree):
        # @sin architecture_workers_worktree_delivered_outside_commit_and_merge_request
        return worktree.moved(WorktreeLifecycle.deliver)

    def merge_request(self):
        # @sin architecture_workers_merge_request_row_built_outside_its_scope
        return MergeAsk(creator_id=1)

    def worker_run(self, checkpoints, context):
        # @sin architecture_workers_worker_run_started_outside_start_worker_runs
        return checkpoints.reach_worker(1, 2, (3,), context)

    def early(self, reach):
        # @sin architecture_plans_checkpoint_reach_flag_read
        return reach.is_early

    def line(self):
        # @sin architecture_workers_delivery_command_in_a_text
        return "fix it and deliver again"

    def source(self, reach):
        # @righteous architecture_plans_checkpoint_reach_flag_read
        return reach.source
'''


@pytest.mark.parametrize("rule", sorted(ALLOWED_PATHS))
def test_the_detector_exists_is_enrolled_and_every_path_it_allows_still_exists(rule):
    declared = json.loads((CUSTOM / f"{rule}.json").read_text())
    assert declared["engine"] == "python"
    assert rule in json.loads((CUSTOM.parent / "config.json").read_text())["detectors"]
    for path in ALLOWED_PATHS[rule]:
        assert (ROOT / path).exists(), path


def test_the_detectors_fire_on_their_sample(tmp_path):
    custom = tmp_path / ".commandments" / "custom"
    (custom / "samples").mkdir(parents=True)
    (custom.parent / "config.json").write_text(json.dumps({"detectors": sorted(ALLOWED_PATHS)}))
    for name in ALLOWED_PATHS:
        shutil.copyfile(CUSTOM / f"{name}.json", custom / f"{name}.json")
    for skill in SKILLS:
        shutil.copytree(CUSTOM / "skills" / skill, custom / "skills" / skill)
    (custom / "samples" / "worker_unit.py").write_text(SAMPLE)
    plugin = Path(".journal/plugins/code-commandments/bin/commandments-release")
    executable = next((str(folder / plugin) for folder in (ROOT, *ROOT.parents) if (folder / plugin).is_file()), None)
    if executable is None:
        pytest.skip("the code-commandments plugin is not installed")
    completed_process = subprocess.run([executable, "rule", "prove"], cwd=tmp_path, capture_output=True, text=True, timeout=30)
    assert completed_process.returncode == 0, completed_process.stdout + completed_process.stderr
    for name in ALLOWED_PATHS:
        assert f"✓ {name}" in completed_process.stdout, completed_process.stdout

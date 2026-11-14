from types import SimpleNamespace

from suites.coding.modules.workers.listeners.plan_test_folder_listener import PlanTestFolderListener


def test_a_finished_plan_has_the_checkout_of_its_checkpoint_runs_removed():
    removed = []
    environment = SimpleNamespace(id=1, name="main")
    git = SimpleNamespace(remove_base_checkout=lambda found, name: removed.append((found, name)))
    listener = PlanTestFolderListener(git, SimpleNamespace(find=lambda environment_id: environment))
    listener.handle(SimpleNamespace(row=SimpleNamespace(id=1104, environment_id=1)), None)
    assert removed == [(environment, "plan-1104")]

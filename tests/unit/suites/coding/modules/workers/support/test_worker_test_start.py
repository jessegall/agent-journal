from suites.coding.modules.workers.support.worker_test_start import WorkerTestStart


def test_folder_becomes_the_tested_folder_relative_to_the_project():
    filled = WorkerTestStart.filled("docker compose exec -T -w /app/{folder} app composer test", "/work/shop/.journal/worktrees/main/worker-59")
    assert filled == "docker compose exec -T -w /app/.journal/worktrees/main/worker-59 app composer test"


def test_a_folder_outside_the_worktrees_is_the_project_itself():
    assert WorkerTestStart.filled("cd {folder} && make test", "/work/shop") == "cd . && make test"


def test_a_command_without_folder_is_left_as_it_is():
    assert WorkerTestStart.filled("vendor/bin/phpunit tests/CartTest.php", "/work/shop/.journal/worktrees/main/worker-1") == "vendor/bin/phpunit tests/CartTest.php"


def test_the_run_starts_in_the_tested_folder_with_the_filled_command():
    start = WorkerTestStart.started(7, "make -C {folder} test", "/work/shop/.journal/worktrees/main/worker-1")
    assert start.folder == "/work/shop/.journal/worktrees/main/worker-1" and "make -C .journal/worktrees/main/worker-1 test" in start.line

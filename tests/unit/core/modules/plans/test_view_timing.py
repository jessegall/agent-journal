from tests.unit.core.modules.plans.support.view_timing import ViewTiming

PLAIN_VIEW_LIMIT_MS = 5.0

HAND_PLAN_TASKS = ("SELECT phase_tasks.task_id, phases.plan_id, phase_tasks.phase_id, phases.position, phases.checkpoint, phase_tasks.position,"
                   " tasks.state, tasks.closed_at FROM phases JOIN phase_tasks ON phase_tasks.phase_id = phases.id"
                   " JOIN tasks ON tasks.id = phase_tasks.task_id WHERE phases.plan_id = ?")
HAND_PLAN_PROGRESS = ("SELECT count(*) FILTER (WHERE tasks.state != 'cancelled'), count(*) FILTER (WHERE tasks.state = 'completed'),"
                      " coalesce(min(phases.position) FILTER (WHERE tasks.closed_at IS NULL), 0) FROM phases"
                      " JOIN phase_tasks ON phase_tasks.phase_id = phases.id JOIN tasks ON tasks.id = phase_tasks.task_id WHERE phases.plan_id = ?")
HAND_OPEN_DEPENDENCIES = ("SELECT task_dependencies.id, task_dependencies.task_id, task_dependencies.dependency_id FROM task_dependencies"
                          " JOIN tasks ON tasks.id = task_dependencies.dependency_id WHERE task_dependencies.task_id = ? AND tasks.closed_at IS NULL")


def test_each_proposed_view_read_by_key_stays_a_plain_view():
    timing = ViewTiming()
    plans, tasks = timing.plan_keys(), timing.task_keys()
    reads = [
        timing.timed("plan_tasks view", "SELECT * FROM plan_tasks WHERE plan_id = ?", plans),
        timing.timed("plan_tasks by hand", HAND_PLAN_TASKS, plans),
        timing.timed("plan_progress view", "SELECT * FROM plan_progress WHERE plan_id = ?", plans),
        timing.timed("plan_progress by hand", HAND_PLAN_PROGRESS, plans),
        timing.timed("open_dependencies view", "SELECT * FROM open_dependencies WHERE task_id = ?", tasks),
        timing.timed("open_dependencies by hand", HAND_OPEN_DEPENDENCIES, tasks),
    ]
    for read in reads:
        print(f"{read.name}: {read.median_ms:.3f} ms; {read.plan}")
    assert not [read.name for read in reads if read.scans_tasks or read.median_ms > PLAIN_VIEW_LIMIT_MS], reads


def test_plan_progress_by_plan_searches_plans_by_key_and_scans_no_tasks():
    read = ViewTiming().timed("plan_progress view", "SELECT * FROM plan_progress WHERE plan_id = ?", [1])
    assert "SEARCH plans USING INTEGER PRIMARY KEY" in read.plan and not read.scans_tasks, read.plan

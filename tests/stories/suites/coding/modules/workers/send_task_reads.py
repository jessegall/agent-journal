from engine.database.database import Database
from suites.coding.modules.workers.support.kept_worker_tasks import KeptWorkerTasks
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator


def test_a_send_checks_the_tasks_it_names_once_however_many_steps_check_them(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    tasks = story.container.get(KeptWorkerTasks)
    with story.container.get(Database).repeated_work.request():
        checked = [tasks.check_tasks((1,), story.agent.id) for _ in range(2)]
    story.expect_rows([[task.id for task in read] for read in checked] == [[1], [1]], detail=str(checked))

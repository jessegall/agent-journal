import inspect

from core.modules.tasks.queries.task_query import TaskQuery

"""Book 5 of doc 1255, story 39: the task reads that are kept pass their query to the cache and build no
condition text of their own."""


def test_task_query_builds_no_condition_text():
    for method in (TaskQuery.assigned, TaskQuery.assigned_ready, TaskQuery.started_tasks, TaskQuery.unfinished_assigned):
        source = inspect.getsource(method)
        assert "AND {" not in source and " = ?" not in source and ".sql" not in source, method.__name__

from journal.container import Container
from journal.http.controllers.hooks import HookController
from journal.http.controllers.tasks import TaskController
from journal.http.router import Router


def routes(router: Router, container: Container) -> None:
    """Every path, in one place."""
    hooks = container.get(HookController)
    tasks = container.get(TaskController)
    router.post("/hooks/{agent}", hooks.receive)
    router.get("/tasks", tasks.index)
    router.get("/tasks/{id}", tasks.show)
    router.post("/tasks", tasks.store)
    router.post("/tasks/{id}/start", tasks.start)
    router.post("/tasks/{id}/log", tasks.log)
    router.post("/tasks/{id}/finish", tasks.finish)

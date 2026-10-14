from journal.container import Container
from journal.http.controllers.cli import CliController
from journal.http.controllers.hooks import HookController
from journal.http.controllers.tasks import TaskController
from journal.http.router import Router


class Routes:
    """Every path, in one place."""

    def __init__(self, container: Container) -> None:
        self.container = container

    def mount(self, router: Router) -> Router:
        tasks = self.container.get(TaskController)
        hooks = self.container.get(HookController)
        cli = self.container.get(CliController)
        router.post("/cli", cli.run)
        router.post("/hooks/{agent}", hooks.receive)
        router.get("/tasks", tasks.index)
        router.get("/tasks/{id}", tasks.show)
        router.post("/tasks", tasks.store)
        router.post("/tasks/{id}", tasks.update)
        router.post("/tasks/{id}/start", tasks.start)
        router.post("/tasks/{id}/log", tasks.log)
        router.post("/tasks/{id}/finish", tasks.finish)
        return router

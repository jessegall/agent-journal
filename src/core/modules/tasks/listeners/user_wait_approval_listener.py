from core.base.change.changed import Changed
from core.base.change.logged_event import LoggedEvent
from core.base.change.registry_synced import RegistrySynced
from core.base.command.bus import Bus
from core.base.command.close_user_approval import CloseUserApproval
from core.base.command.request_user_approval import RequestUserApproval
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.base.scope.actor_scope import ActorScope
from core.base.scope.environment_scope import EnvironmentScope
from core.base.user_approval import UserApproval
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_wait import TaskWait
from core.modules.tasks.support.task_opener import USER_TARGET
from core.modules.tasks.support.task_waits import TaskWaits


class UserWaitApprovalListener(CommitListener[Changed[TaskWait] | RegistrySynced]):
    """Asks a person to confirm the work a task waits on before reopening it."""

    name = "tasks.user-wait-approval"
    disabled_scopes = [ActorScope, EnvironmentScope]

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries, waits: TaskWaits) -> None:
        self.bus, self.actors, self.queries, self.waits = bus, actors, queries, waits

    def handle(self, event: Changed[TaskWait] | RegistrySynced, logged: LoggedEvent) -> None:
        waits = self.waits.pending_rows() if isinstance(event, RegistrySynced) else tuple([event.row])
        user_waits = tuple(wait for wait in waits if wait.target == USER_TARGET)
        tasks = {task.id: task for task in self.queries.query(Task).find_many([wait.task_id for wait in user_waits if wait.ended_at is None])}
        actor = self.actors.actor("journal.core.tasks")
        for wait in user_waits:
            arguments = ("task", "unblock", str(wait.task_id))
            if wait.ended_at is not None:
                self.bus.run(CloseUserApproval(arguments), actor, cause_id=logged.id, environment_id=logged.environment_id)
                continue
            task = tasks[wait.task_id]
            approval = UserApproval(task.reason, arguments,
                                    source_version=task.version)
            self.bus.run(RequestUserApproval(approval, arguments, wait.creator_id), actor,
                         cause_id=logged.id, environment_id=task.environment_id)

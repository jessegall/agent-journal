from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.container.container import Container
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from engine.scope.environment_scope import EnvironmentScope
from engine.scope.scopes import Scopes
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.helpers.commands.start_unstarted_jobs.start_unstarted_jobs import StartUnstartedJobs


class UnstartedJobStarts:
    """Has each environment with an open helper job start the helpers whose job never started."""

    def __call__(self, container: Container) -> None:
        with container.get(Scopes).opened(None, disabled=[EnvironmentScope]):
            open_jobs = tuple(container.get(Queries).query(HelperJob).matching(IsNull("ended_at")).all_rows())
        for environment_id in sorted({job.environment_id for job in open_jobs}):
            container.get(Bus).run(StartUnstartedJobs(), Actor.core(), environment_id=environment_id)

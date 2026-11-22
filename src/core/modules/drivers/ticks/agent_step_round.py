from engine.agent_step.errors.step_conflict_error import StepConflictError
from engine.request.request_values import RequestValues
from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.container.container import Container
from engine.log.error_log import ErrorLog
from engine.query.queries import Queries
from engine.setting.setting_values import SettingValues
from engine.time.clock import Clock
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.commands.count_step_failure.count_step_failure import CountStepFailure
from core.modules.drivers.commands.run_agent_step.run_agent_step import RunAgentStep
from core.modules.drivers.models.agent_step_request import AgentStepRequest
from core.modules.drivers.models.countdown import Countdown
from core.modules.drivers.support.driver_settings import STEP_ROUND_AGENTS_SETTING
from core.modules.drivers.support.step_request_failures import QUICK_TRIES, RETRY_DELAY_SECONDS, STEP_REQUEST_FAILURES
from engine.query.conditions.among import Among
from engine.time.timestamp import Timestamp

OPEN_REQUESTS_REASON = "the oldest open step requests of one round, a few dozen at most"


class AgentStepRound:
    """Serves the oldest open step requests, at most step-round-agents of them, each in a write of its own (doc
    1310 section 6.2): one agent that fails goes to the back of the queue with its failure counted and
    logged, and never keeps the others from their steps. It runs at boot too, so a request held over a
    server stop is served."""

    def __call__(self, container: Container) -> None:
        queries, bus, settings, clock = container.get(Queries), container.get(Bus), container.get(SettingValues), container.get(Clock)
        timestamp = clock.timestamp()
        limit = settings.number(STEP_ROUND_AGENTS_SETTING)
        open_requests = list(queries.query(AgentStepRequest).filter(served_at=None).oldest().every_row(OPEN_REQUESTS_REASON))
        failures = {row.actor_id: row for row in queries.query(Countdown).filter(key=STEP_REQUEST_FAILURES.key)
                    .matching(Among("actor_id", [request.session_agent_id for request in open_requests])).every_row(OPEN_REQUESTS_REASON)}
        ready = [request for request in open_requests if self.is_ready(request, failures.get(request.session_agent_id), timestamp)]
        for request in ready[:limit]:
            agent = container.get(AgentRows).find_unscoped(request.session_agent_id)
            try:
                # each agent's step is one request, whose readers share what they read
                with container.get(RequestValues).opened():
                    bus.run(RunAgentStep(request.id), Actor.core(), environment_id=agent.environment_id)
            # a step whose basis moved while it was decided is no fault: it is counted and decided again next round
            except StepConflictError:
                bus.run(CountStepFailure(request.id), Actor.core(), environment_id=agent.environment_id)
            # one agent's step that fails is counted and logged, and the round goes on with the others
            except Exception as error:
                container.get(ErrorLog).reported(["agent step round", str(request.session_agent_id)], error, agent.environment_id)
                bus.run(CountStepFailure(request.id), Actor.core(), environment_id=agent.environment_id)

    # a request whose quick tries failed waits a while between its later tries, so it never crowds out the others
    @staticmethod
    def is_ready(request: AgentStepRequest, failures: Countdown | None, timestamp: Timestamp) -> bool:
        if failures is None or failures.subject != str(request.id) or failures.used_count < QUICK_TRIES:
            return True
        return failures.update_timestamp().elapsed_seconds(timestamp) >= RETRY_DELAY_SECONDS

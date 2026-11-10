from engine.driver.program_lockdown import ProgramLockdown
from engine.command.context import Context
from suites.coding.modules.workers.support.worker_route_policy import WorkerRoutePolicy
from suites.coding.modules.workers.support.worker_route_request import WorkerRouteRequest
from dataclasses import replace
from pathlib import Path

from core.base.profile.agent_profile import AgentProfile
from core.base.provider.providers import Providers
from engine.errors.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.environments.support.environment_rows import EnvironmentRows
from core.modules.helpers.support.agent_admission import AgentAdmission
from core.modules.helpers.support.helper_programs import HelperPrograms
from core.modules.helpers.support.profile_models import ProfileModels
from core.modules.helpers.support.program_shares import ProgramShares
from core.modules.helpers.support.program_states import ProgramStates
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.models.worker_route import WorkerRoute
from suites.coding.modules.workers.support.worker_choice import WorkerChoice
from suites.coding.modules.workers.support.worker_counts import WorkerCounts
from suites.coding.modules.workers.support.worker_program_request import WorkerProgramRequest
from suites.coding.modules.workers.support.worker_route_fallback import WorkerRouteFallback
from suites.coding.modules.workers.support.worker_routes import WorkerRoutes


WORKER_TYPE = "worker"


class WorkerRouting:
    """Chooses a worker's program and tier from its request, routes and split."""

    def __init__(self, shares: ProgramShares, states: ProgramStates, counts: WorkerCounts,
                 environments: EnvironmentRows, providers: Providers, models: ProfileModels,
                 programs: HelperPrograms, routes: WorkerRoutes, policy: WorkerRoutePolicy, admission: AgentAdmission, lockdown: ProgramLockdown) -> None:
        self.lockdown = lockdown
        self.shares, self.states, self.counts, self.environments = shares, states, counts, environments
        self.providers, self.models, self.programs, self.routes = providers, models, programs, routes
        self.policy = policy
        self.admission = admission

    def choice(self, command: WorkerProgramRequest, tasks: list[Task], caller: Agent | None, profile: AgentProfile, context: Context | None = None) -> WorkerChoice:
        if caller is None:
            if not command.program:
                raise Refusal("a person's dispatch needs the program the worker runs", "add --program, such as the program of the environment's main agent")
            return self.requested(command, tasks, caller, profile, command.program, context)
        requested_program = command.program or (self.providers.model_program(command.program_model) if command.program_model else "")
        if not requested_program and profile.mcp_tools:
            requested_program = profile.program or caller.program
        if requested_program:
            return self.requested(command, tasks, caller, profile, requested_program, context)
        return self.chosen(command, tasks, caller, profile)

    def requested(self, command: WorkerProgramRequest, tasks: list[Task], caller: Agent | None, profile: AgentProfile, requested_program: str, context: Context | None) -> WorkerChoice:
        route = self.routes.common_route(tasks)
        self.policy.check(tasks[0], route, WorkerRouteRequest.dispatch(requested_program, command, caller, context))
        self.admission.checked_provider(WORKER_TYPE, profile.name, requested_program)
        self.programs.installed(requested_program)
        reason = "the profile's tools"
        if command.program:
            reason = "named at dispatch"
        elif command.program_model:
            reason = "the named model"
        return self.selected(command, profile, requested_program, reason, route)

    def chosen(self, command: WorkerProgramRequest, tasks: list[Task], caller: Agent, profile: AgentProfile) -> WorkerChoice:
        route = self.routes.common_route(tasks)
        if route is None and not self.shares.is_configured:
            self.admission.checked_provider(WORKER_TYPE, profile.name, caller.program)
            self.programs.installed(caller.program)
            return self.selected(command, profile, caller.program, "the program of the agent that sent it")
        environment = self.environments.find(tasks[0].environment_id)
        readiness = self.states.readiness(Path(environment.folder))
        fallback = None
        permitted = [name for name in readiness.ready_programs if not self.admission.provider_reasons(WORKER_TYPE, profile.name, name)]
        if route is not None and route.program:
            forbidden = self.admission.provider_reasons(WORKER_TYPE, profile.name, route.program)
            if forbidden and route.strict:
                raise Refusal(f"task {tasks[0].id} must go to {route.program}, but {forbidden[0]}", "change the agent options, or build it yourself")
            state = readiness.states[route.program]
            if not forbidden and state.is_ready:
                return self.selected(command, profile, route.program, route.reason, route)
            fallback = None if forbidden else WorkerRouteFallback(route.id, route.program, state)
            if fallback is not None and route.strict:
                raise Refusal(f"task {tasks[0].id} must go to {route.program}: {fallback.line}", "wait, or build it yourself")
        program = caller.program
        reason = "the program of the agent that sent it"
        if self.shares.is_configured:
            program = self.shares.next_program(self.counts.recent(environment.id), permitted)
            reason = "the split"
        if program is None or program not in permitted:
            raise Refusal(f"no program can take this worker: {readiness.earliest_line}", "add --program, or wait")
        if route is not None and fallback is None:
            reason = f"{route.reason}; {reason}"
        if fallback is not None:
            reason = f"{reason}; {fallback.line}"
        return replace(self.selected(command, profile, program, reason, route), fallback=fallback)

    def selected(self, command: WorkerProgramRequest, profile: AgentProfile, program: str,
                 reason: str, route: WorkerRoute | None = None) -> WorkerChoice:
        lockdown = self.lockdown.lockdown(program)
        if lockdown.is_active:
            raise lockdown.start_refusal("worker")
        provider = self.providers.provider(program)
        wanted_tier = command.tier
        if wanted_tier is None and route is not None:
            wanted_tier = route.tier
        model = command.program_model or self.models.model(profile, provider, wanted_tier, WORKER_TYPE)
        tier = next((row.tier for row in provider.models if row.name == model), None)
        if wanted_tier is not None and tier is not wanted_tier:
            reason = f"{reason}; the {wanted_tier.value} tier was not allowed, so it uses {model}"
        return WorkerChoice(program, model, reason)



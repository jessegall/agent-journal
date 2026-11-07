from core.base.command.context import Context
from core.base.guard.guard_refusal import GuardRefusal
from suites.coding.modules.workers.support.worker_route_policy import ROUTE_GUARD
from dataclasses import replace
from pathlib import Path

from core.base.profile.agent_profile import AgentProfile
from core.base.provider.providers import Providers
from core.base.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.environments.support.environment_rows import EnvironmentRows
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


class WorkerRouting:
    """Chooses a worker's program and tier from its request, routes and split."""

    def __init__(self, shares: ProgramShares, states: ProgramStates, counts: WorkerCounts,
                 environments: EnvironmentRows, providers: Providers, models: ProfileModels,
                 programs: HelperPrograms, routes: WorkerRoutes) -> None:
        self.shares, self.states, self.counts, self.environments = shares, states, counts, environments
        self.providers, self.models, self.programs, self.routes = providers, models, programs, routes

    def choice(self, command: WorkerProgramRequest, tasks: list[Task], caller: Agent | None, profile: AgentProfile, context: Context | None = None) -> WorkerChoice:
        requested_program = command.program or (self.providers.model_program(command.program_model) if command.program_model else "")
        if not requested_program and profile.mcp_tools:
            requested_program = profile.program or (caller.program if caller is not None else "")
        if caller is None and not requested_program:
            raise Refusal("a person's dispatch needs the program the worker runs", "add --program, such as the program of the environment's main agent")
        route = self.routes.common_route(tasks)
        if requested_program:
            self.check_program(command, tasks, caller, route, context, requested_program)
            self.programs.installed(requested_program)
            reason = "the profile's tools"
            if command.program:
                reason = "named at dispatch"
            elif command.program_model:
                reason = "the named model"
            return self.selected(command, profile, requested_program, reason, route)
        if route is None and not self.shares.is_configured:
            self.programs.installed(caller.program)
            return self.selected(command, profile, caller.program, "the program of the agent that sent it")
        environment = self.environments.find(tasks[0].environment_id)
        readiness = self.states.readiness(Path(environment.folder))
        fallback = None
        if route is not None and route.program:
            state = readiness.states[route.program]
            if state.is_ready:
                return self.selected(command, profile, route.program, route.reason, route)
            fallback = WorkerRouteFallback(route.id, route.program, state)
            if route.strict:
                raise Refusal(f"task {tasks[0].id} must go to {route.program}: {fallback.line}", "wait, or build it yourself")
        program = caller.program
        reason = "the program of the agent that sent it"
        if self.shares.is_configured:
            program = self.shares.next_program(self.counts.recent(environment.id), readiness.ready_programs)
            reason = "the split"
        if program is None or program not in readiness.ready_programs:
            raise Refusal(f"no program can take this worker: {readiness.earliest_line}", "add --program, or wait")
        if route is not None and fallback is None:
            reason = f"{route.reason}; {reason}"
        if fallback is not None:
            reason = f"{reason}; {fallback.line}"
        return replace(self.selected(command, profile, program, reason, route), fallback=fallback)

    def selected(self, command: WorkerProgramRequest, profile: AgentProfile, program: str,
                 reason: str, route: WorkerRoute | None = None) -> WorkerChoice:
        provider = self.providers.provider(program)
        wanted_tier = command.tier
        if wanted_tier is None and route is not None:
            wanted_tier = route.tier
        model = command.program_model or self.models.model(profile, provider, wanted_tier)
        tier = next((row.tier for row in provider.models if row.name == model), None)
        if wanted_tier is not None and tier is not wanted_tier:
            reason = f"{reason}; the {wanted_tier.value} tier was not allowed, so it uses {model}"
        return WorkerChoice(program, model, reason)


    def check_program(self, command: WorkerProgramRequest, tasks: list[Task], caller: Agent | None,
                    route: WorkerRoute | None, context: Context | None, program: str) -> None:
        if caller is None or route is None or not route.program or route.program == program:
            return
        if context is not None and ROUTE_GUARD in context.skipped_guards:
            return
        environment = self.environments.find(tasks[0].environment_id)
        if not self.states.state(route.program, Path(environment.folder)).is_ready:
            return
        model = f"; model {command.program_model} belongs to {program}" if command.program_model and not command.program else ""
        refusal = Refusal(f"task {tasks[0].id} goes to {route.program} by route {route.id}{model}",
                          "journal worker-route list shows the routes; use --tier for a model of that program")
        raise GuardRefusal(ROUTE_GUARD, refusal, f"--skip-guard {ROUTE_GUARD} --skip-reason '<why>'")

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
from suites.coding.modules.workers.support.worker_choice import WorkerChoice
from suites.coding.modules.workers.support.worker_counts import WorkerCounts
from suites.coding.modules.workers.support.worker_program_request import WorkerProgramRequest


class WorkerRouting:
    """Chooses a worker's program from an explicit request, the split or its caller."""

    def __init__(self, shares: ProgramShares, states: ProgramStates, counts: WorkerCounts,
                 environments: EnvironmentRows, providers: Providers, models: ProfileModels, programs: HelperPrograms) -> None:
        self.shares, self.states, self.counts, self.environments = shares, states, counts, environments
        self.providers, self.models, self.programs = providers, models, programs

    def choice(self, command: WorkerProgramRequest, tasks: list[Task], caller: Agent | None, profile: AgentProfile) -> WorkerChoice:
        if caller is None and not command.program:
            raise Refusal("a person's dispatch needs the program the worker runs", "add --program, such as the program of the environment's main agent")
        if command.program:
            self.programs.installed(command.program)
            return self.selected(command, profile, command.program, "named at dispatch")
        if self.shares.is_configured:
            environment = self.environments.find(tasks[0].environment_id)
            folder = Path(environment.folder)
            readiness = self.states.readiness(folder)
            program = self.shares.next_program(self.counts.recent(environment.id), readiness.ready_programs)
            if program is None:
                raise Refusal(f"no program can take this worker: {readiness.earliest_line}", "add --program, or wait")
            return self.selected(command, profile, program, "the split")
        self.programs.installed(caller.program)
        return self.selected(command, profile, caller.program, "the program of the agent that sent it")

    def selected(self, command: WorkerProgramRequest, profile: AgentProfile, program: str, reason: str) -> WorkerChoice:
        provider = self.providers.provider(program)
        model = command.program_model or self.models.model(profile, provider, command.tier)
        tier = next((row.tier for row in provider.models if row.name == model), None)
        if command.tier is not None and tier is not command.tier:
            reason = f"{reason}; the {command.tier.value} tier was not allowed, so it uses {model}"
        return WorkerChoice(program, model, reason)

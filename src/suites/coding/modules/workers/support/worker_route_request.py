from dataclasses import dataclass

from engine.enums.actor_type import ActorType
from engine.command.context import Context
from core.modules.agents.models.agent import Agent
from suites.coding.modules.workers.support.worker_program_request import WorkerProgramRequest


@dataclass(frozen=True)
class WorkerRouteRequest:
    """A program request checked against task routes."""

    program: str
    actor_type: ActorType
    skipped_guards: frozenset[str]
    model: str | None = None

    @classmethod
    def dispatch(cls, program: str, command: WorkerProgramRequest, caller: Agent | None,
                     context: Context | None) -> "WorkerRouteRequest":
        actor_type = ActorType.USER if caller is None else ActorType.AGENT
        skipped_guards: frozenset[str] = frozenset()
        if context is not None:
            actor_type, skipped_guards = context.actor.type, context.skipped_guards
        model = command.program_model if command.program_model and not command.program else None
        return cls(program, actor_type, skipped_guards, model)

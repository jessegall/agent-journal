from argparse import Namespace

from engine.enums.actor_type import ActorType
from engine.caller.caller import Caller
from engine.errors.refusal import Refusal
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.messages.support.work_source_copy import WorkSourceCopy
from core.modules.messages.support.work_sources import WorkSources


class WorkSourceSubcommand(ReadSubcommand[WorkSourceCopy]):
    """Shows the request that supplies attribution for the caller's next write."""

    cli_name = "message"
    name = "work-source"
    help = "Show the active request, selecting actor, environment and selection or job origin without changing them."

    def __init__(self, sources: WorkSources) -> None:
        self.sources = sources

    def read(self, arguments: Namespace, caller: Caller) -> WorkSourceCopy:
        if caller.actor.type is not ActorType.AGENT or caller.environment_id is None:
            raise Refusal("inspect the active request as an agent in one environment")
        source = self.sources.work_source(caller)
        if source is not None:
            return source
        return WorkSourceCopy(None, 0, caller.environment_id, selecting_actor_id=caller.actor.id, origin="clear")

    def write_output(self, value: object, output: Output) -> None:
        if not isinstance(value, WorkSourceCopy):
            return
        reference = f"message:{value.message_id}" if value.message_id is not None else "none"
        availability = " (unavailable)" if value.unavailable else ""
        output.write(f"active request: {reference}{availability}\nselecting actor: agent:{value.selecting_actor_id}\n"
                     f"environment: {value.environment_id}\norigin: {value.origin}", output.values(value))

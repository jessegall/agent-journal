from dataclasses import replace
from datetime import timedelta

from engine.enums.helper_role import HelperRole
from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.conditions.among import Among
from engine.query.conditions.greater import Greater
from engine.time.timestamp import Timestamp
from core.modules.agents.commands.end_agent.end_agent import EndAgent
from core.modules.agents.models.agent import Agent
from core.modules.drivers.commands.end_silent_helpers.end_silent_helpers import EndSilentHelpers
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.agents.support.agent_rows import AgentRows

SILENT_HELPER_SECONDS = 1800


class EndSilentHelpersHandler(Handler[EndSilentHelpers, None]):
    """A helper's stop never arrives when the journal was away or its program was killed, so a helper that has
    sent no hook for half an hour ends and stops counting as running. A helper stopped at its program's usage
    limit is left alone, and its half hour starts when the limit ends."""

    command = EndSilentHelpers

    def __init__(self, agents: AgentRows, hook_calls: HookCallQuery, bus: Bus) -> None:
        self.agents, self.hook_calls, self.bus = agents, hook_calls, bus

    def handle(self, command: EndSilentHelpers, context: Context) -> None:
        helpers = self.agents.running(HelperRole.HELPER)
        recent_limit = Timestamp(context.timestamp.value - timedelta(seconds=SILENT_HELPER_SECONDS))
        helpers = tuple(helpers)
        recently_called = set(self.hook_calls.matching(Among("session_agent_id", [helper.id for helper in helpers])).matching(Greater("created_at", recent_limit.text)).group_by("session_agent_id").count_by())
        for helper in helpers:
            if helper.id not in recently_called and self.is_past_silence(helper, context.timestamp):
                self.bus.dispatch(EndAgent(helper.id), replace(context, environment_id=helper.environment_id))

    @staticmethod
    def is_past_silence(helper: Agent, timestamp: Timestamp) -> bool:
        return helper.halted_at is None and helper.update_timestamp().elapsed_seconds(timestamp) >= SILENT_HELPER_SECONDS

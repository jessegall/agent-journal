from dataclasses import replace
from datetime import timedelta

from core.base.agent_role import AgentRole
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.conditions.among import Among
from core.base.query.conditions.greater import Greater
from core.base.timestamp import Timestamp
from core.modules.agents.commands.end_agent.end_agent import EndAgent
from core.modules.drivers.commands.end_silent_helpers.end_silent_helpers import EndSilentHelpers
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.agents.support.agent_rows import AgentRows

SILENT_HELPER_SECONDS = 1800


class EndSilentHelpersHandler(Handler[EndSilentHelpers, None]):
    """A helper's stop never arrives when the journal was away or its program was killed, so a helper that has
    sent no hook for half an hour ends and stops counting as running."""

    command = EndSilentHelpers

    def __init__(self, agents: AgentRows, hook_calls: HookCallQuery, bus: Bus) -> None:
        self.agents, self.hook_calls, self.bus = agents, hook_calls, bus

    def handle(self, command: EndSilentHelpers, context: Context) -> None:
        helpers = self.agents.running(AgentRole.HELPER)
        recent_limit = Timestamp(context.timestamp.value - timedelta(seconds=SILENT_HELPER_SECONDS))
        helpers = tuple(helpers)
        recently_called = {call.session_agent_id for call in self.hook_calls.matching(Among("session_agent_id", [helper.id for helper in helpers])).matching(Greater("created_at", recent_limit.text)).all_rows()}
        for helper in helpers:
            if helper.id not in recently_called and helper.creation_timestamp().elapsed_seconds(context.timestamp) >= SILENT_HELPER_SECONDS:
                self.bus.dispatch(EndAgent(helper.id), replace(context, environment_id=helper.environment_id))

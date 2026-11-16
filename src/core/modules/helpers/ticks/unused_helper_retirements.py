from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.container.container import Container
from engine.time.clock import Clock
from core.modules.agents.commands.retire_agent.retire_agent import RetireAgent
from core.modules.helpers.support.unused_helpers import UnusedHelpers

UNUSED_REASON = "it took no job for {hours} hours"


class UnusedHelperRetirements:
    """Retires each read-only helper that went unused past its idle hours, through the retire command and with that
    reason, with no agent needed to carry it."""

    def __call__(self, container: Container) -> None:
        unused = container.get(UnusedHelpers)
        for helper in unused.past_idle_hours(container.get(Clock).timestamp()):
            container.get(Bus).run(RetireAgent(helper.id, UNUSED_REASON.format(hours=unused.idle_hours())), Actor.core(), environment_id=helper.environment_id)

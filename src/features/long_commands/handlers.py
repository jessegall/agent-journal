import time

from engine.events import ClockTicked
from engine.hooks import LONG_COMMAND, cancelled
from features.long_commands.details import KEPT, MOVED
from features.parts import AgentContext, Handler
from providers import DRIVERS, PROVIDERS

FOREGROUND = "Bash"


class MoveLongCommands(Handler):
    def handle(self, context: AgentContext, event: ClockTicked) -> None:
        row = context.agent.row
        last = (row.data.get("commands") or [{}])[-1]
        if last.get("tool") != FOREGROUND:
            return
        started = str(float(last.get("at") or 0))
        if last.get("done"):
            if context.state.get("moved") == started and context.state.get("ended") != started:
                context.state.set("ended", started)
                context.journal.agents.card(row.n, label="The command moved to the background ended", icon="terminal", detail=str(last.get("command") or ""))
            return
        provider = row.data.get("provider") or ""
        driver = DRIVERS.get(provider)
        seconds = int(time.time() - float(started))
        if not driver or not driver.MOVE_TO_BACKGROUND or seconds < context.settings.after_seconds or context.state.get("asked") == started:
            return
        context.state.set("asked", started)
        reason = cancelled(LONG_COMMAND, PROVIDERS[provider]() if provider in PROVIDERS else None, context.record, None, row.title,
                           {"command": str(last.get("command") or ""), "seconds": seconds})
        if reason:
            context.agent.say(KEPT, reason=reason)
            return
        context.state.set("moved", started)
        context.agent.move_to_background()
        context.agent.say(MOVED, seconds=seconds)
        context.journal.agents.card(row.n, label="Moved a long command to the background", icon="terminal", detail=str(last.get("command") or ""))

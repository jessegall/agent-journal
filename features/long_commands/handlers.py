import time

from engine.events import ClockTicked
from features.parts import AgentContext, Handler
from providers import DRIVERS

FOREGROUND = "Bash"


class MoveLongCommands(Handler):
    def handle(self, context: AgentContext, event: ClockTicked) -> None:
        row = context.agent.row
        driver = DRIVERS.get(row.data.get("provider") or "")
        last = (row.data.get("commands") or [{}])[-1]
        if not driver or not driver.MOVE_TO_BACKGROUND or last.get("tool") != FOREGROUND or last.get("done"):
            return
        started = float(last.get("at") or 0)
        seconds = int(time.time() - started)
        if seconds < context.settings.after_seconds or context.state.get("moved") == str(started):
            return
        context.state.set("moved", str(started))
        context.agent.move_to_background()
        context.agent.say("moved", seconds=seconds)

import time

from engine.events import ClockTicked
from features.parts import AgentContext, Handler
from providers import DRIVERS

FOREGROUND = "Bash"


class MoveLongCommands(Handler):
    def handle(self, context: AgentContext, event: ClockTicked) -> None:
        row = context.agent.row
        driver = DRIVERS.get(row.data.get("provider") or "")
        running = [c for c in row.data.get("commands") or [] if c.get("tool") == FOREGROUND and not c.get("done")]
        if not driver or not driver.MOVE_TO_BACKGROUND or not running:
            return
        started = float(running[-1].get("at") or 0)
        minutes = int((time.time() - started) // 60)
        if minutes < context.settings.after_minutes or context.state.get("moved") == str(started):
            return
        context.state.set("moved", str(started))
        context.agent.move_to_background()
        context.agent.say("moved", minutes=minutes)

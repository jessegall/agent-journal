import time

from engine.events import ClockTicked
from engine.hooks import LONG_COMMAND, cancelled
from features.long_commands.details import KEPT, MOVED
from features.parts import AgentContext, Handler
from providers import DRIVERS, PROVIDERS
from features.status_bar.runs import CommandRun, command_runs

FOREGROUND = "Bash"


class MoveLongCommands(Handler):
    def handle(self, context: AgentContext, event: ClockTicked) -> None:
        row = context.agent.row
        runs = command_runs(row)
        last = runs[-1] if runs else CommandRun()
        if last.tool != FOREGROUND:
            return
        started = str(last.at)
        if last.done:
            if context.state.get("moved") == started and context.state.get("ended") != started:
                context.state.set("ended", started)
                context.journal.agents.card(row.n, key=f"command:{started}", state="done")
            return
        provider = row.provider
        driver = DRIVERS.get(provider)
        seconds = int(time.time() - float(started))
        if not driver or not driver.MOVE_TO_BACKGROUND or seconds < context.settings.after_seconds or context.state.get("asked") == started:
            return
        context.state.set("asked", started)
        reason = cancelled(LONG_COMMAND, PROVIDERS[provider]() if provider in PROVIDERS else None, context.record, None, row.title,
                           {"command": last.command, "seconds": seconds})
        if reason:
            context.agent.say(KEPT, reason=reason)
            return
        context.state.set("moved", started)
        context.agent.move_to_background()
        context.agent.say(MOVED, seconds=seconds)
        context.journal.agents.card(row.n, key=f"command:{started}", label="Moved a long command to the background", icon="terminal",
                                    command=last.command, state="running")

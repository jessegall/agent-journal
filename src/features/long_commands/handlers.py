import time
from pathlib import Path

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
        moved = context.state.get("moved")
        if moved and context.state.get("ended") != moved:
            self.follow(context, row, moved)
        runs = command_runs(row)
        last = runs[-1] if runs else CommandRun()
        if last.tool != FOREGROUND or last.done:
            return
        started = str(last.at)
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
        context.state.set("task", "")
        context.agent.move_to_background()
        context.agent.say(MOVED, seconds=seconds)
        context.journal.agents.card(row.n, key=f"command:{started}", label="Moved a long command to the background", icon="terminal",
                                    command=last.command, state="running", started=float(started))

    def follow(self, context: AgentContext, row, started: str) -> None:
        provider = PROVIDERS.get(row.provider)
        if not provider or not row.transcript:
            return
        tasks = provider().background_tasks(Path(row.transcript))
        task = context.state.get("task") or next((name for name, at in sorted(tasks.started.items(), key=lambda kv: kv[1])
                                                  if at >= float(started)), "")
        if not task:
            return
        context.state.set("task", task)
        if task in tasks.ended:
            context.state.set("ended", started)
            outcome = "failed" if task in tasks.failed else "done"
            context.journal.agents.card(row.n, key=f"command:{started}", state=outcome, ended=tasks.ended[task])


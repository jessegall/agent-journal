from datetime import datetime

from journal.engine.machine import Machine
from journal.events.agent.tool_starting import ToolStarting
from journal.events.agent_listener import AgentListener
from journal.features.registry import Registry
from journal.engine.nudge import Nudge
from journal.support.running import Running
from journal.support.requiring import Requiring
from journal.support.decision import Decision
from journal.support.sequence_run import SequenceRun
from journal.providers.providers import Providers
from journal.repositories.entries import Entries
from journal.repositories.setting_rows import SettingRows


class HoldWritesForTheStep(AgentListener[ToolStarting]):
    """A write waits while the step in hand is not taken up, or has stood for the set number of writes since it was; reads, journal commands and the commands the step names go through, and a command the step names takes it up. Quiet while the agent owes the journal the look, the mark or a skill, and for a subagent."""

    blocking = True

    def __init__(self, machine: Machine, running: Running, requiring: Requiring, providers: Providers, entries: Entries, settings: SettingRows, registry: Registry) -> None:
        self.machine, self.running, self.requiring, self.providers = machine, running, requiring, providers
        self.entries, self.settings, self.registry = entries, settings, registry

    def handle(self, event: ToolStarting) -> Decision | None:
        run = None if event.subagent else self.running.in_hand(event.session, event.environment_id)
        if run is None or run.parked_why:
            return None
        provider = self.providers.named(event.provider or "claude")
        if event.tool == provider.shell_tool and self.running.names(run, event.input.get("command", "")):
            if not run.taken_up_at:
                self.running.follow(event.session, event.environment_id)
            return None
        if not provider.writes(event.tool, event.input) or self.requiring.owes_anything(self.machine.agent(event.session, event.environment_id)):
            return None
        from journal.features.sequences.feature import Sequences
        values = {"n": run.sequence_id, "step": run.step + 1, "text": run.text}
        if not run.taken_up_at:
            return self.refused(Sequences.HELD.create(**values))
        writes = self.writes_since(event, run, provider)
        return self.refused(Sequences.STALE.create(writes=writes, **values)) if writes >= int(self.settings.option(Sequences.STALE_AFTER)) else None

    def refused(self, said: Nudge) -> Decision | None:
        return None if self.registry.silenced(said) else Decision.refuse(said.rendered())

    def writes_since(self, event: ToolStarting, run: SequenceRun, provider) -> int:
        since = datetime.fromisoformat(run.taken_up_at)
        uses = [e for e in self.entries.tool_starts(event.session)[1:] if e.created_at and e.created_at > since and not (e.data.get("agent_id") or e.data.get("subagent_id"))]
        return sum(1 for e in uses if provider.wrote(e))

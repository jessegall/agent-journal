from dataclasses import replace

from engine.actor.actor import Actor
from engine.command.context import Context
from engine.enums.actor_type import ActorType
from engine.event.changed import Changed
from engine.listener.save_listener import SaveListener
from engine.scope.environment_scope import EnvironmentScope
from core.modules.agents.models.agent import Agent
from core.modules.messages.support.work_sources import WorkSources


class NewSessionWorkSourceListener(SaveListener[Changed[Agent]]):
    """Clears the request the main agent had selected when it gets a new program session, in the same
    transaction: the new session did not read that request, so it starts with none."""

    name = "messages.new-session-work-source"
    disabled_scopes = [EnvironmentScope]

    def __init__(self, sources: WorkSources) -> None:
        self.sources = sources

    def handle(self, event: Changed[Agent], context: Context) -> None:
        if event.row.is_main and event.old_row is not None and event.old_row.session != event.row.session:
            self.sources.clear(replace(context, actor=Actor(event.row.id, ActorType.AGENT), environment_id=event.row.environment_id))

from engine.change.event_log import EventLog
from engine.database.actor_table import ActorTable
from engine.model.model import Model
from engine.model.tables import Tables
from core.modules.settings.bindings.support.setting_values import SettingValues

AGENT_EDITS_WAIT_SETTING = "journal.core.library.agent-edits-wait"


class AgentEdits:
    """Tells whether the last change of a row was made by an agent, read from the event log, and whether the project
    asks an agent's edit to wait for a person before it goes up to the team."""

    def __init__(self, settings: SettingValues, events: EventLog, tables: Tables, actors: ActorTable) -> None:
        self.settings, self.events, self.tables, self.actors = settings, events, tables, actors

    def edit_waits(self, row: Model) -> bool:
        return self.settings.project.flag(AGENT_EDITS_WAIT_SETTING) and self.agent_edited_last(row)

    def agent_edited_last(self, row: Model) -> bool:
        history = self.events.row_events(self.tables.table(type(row)).name, row.id)
        return bool(history) and self.actors.is_agent(history[-1].actor_id)

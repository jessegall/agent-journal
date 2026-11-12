from engine.event.created import Created
from engine.event.logged_event import LoggedEvent
from engine.scope.actor_scope import ActorScope
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.helpers.models.provider_outage import ProviderOutage
from core.modules.helpers.models.enums.program_mark_type import ProgramMarkType
from core.modules.helpers.models.enums.program_mark_variant import ProgramMarkVariant


class ProviderOutageMarkListener(MarkListener[Created[ProviderOutage]]):
    """Shows one notice when a program first becomes unavailable."""

    name = "helpers.program-outage-mark"
    module_name = "journal.core.helpers"
    disabled_scopes = [ActorScope]

    def handle(self, event: Created[ProviderOutage], logged: LoggedEvent) -> None:
        row = event.row
        if self.queries.query(ProviderOutage).filter(program=row.program).where("id", "<", row.id).where("ends_at", ">", row.creation_timestamp()).exists():
            return
        fix = "sign in to the program again (use /login if supported), then end the outage" if "login" in row.reason else "wait, or end the outage when the program is ready"
        self.show(logged, ProgramMarkType.OUTAGE, ProgramMarkVariant.UNAVAILABLE,
                  f"{row.program} is out until {row.ends_at.text}: {row.reason}; {fix}",
                  row_model=ProviderOutage.model_name, row_id=row.id, key=f"program-outage:{row.id}")

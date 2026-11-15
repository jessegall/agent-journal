from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.enums.actor_type import ActorType
from engine.enums.hook_event_name import HookEventName
from engine.event.created import Created
from engine.event.logged_event import LoggedEvent
from engine.listener.commit.commit_listener import CommitListener
from core.modules.drivers.models.hook_call import HookCall
from core.modules.skills.commands.record_kept_skills.record_kept_skills import RecordKeptSkills


class KeptSkillsRecordListener(CommitListener[Created[HookCall]]):
    """Once a tool use's answer is stored, records the skills the program put back into the agent's context, read
    from its transcript after the reply so the hook never waits on the file (doc 1310 section 6.7)."""

    name = "skills.record-kept"

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event: Created[HookCall], logged: LoggedEvent) -> None:
        call = event.row
        if call.hook != HookEventName.POST_TOOL_USE:
            return
        transcript = call.transcript
        self.bus.run(RecordKeptSkills(call.session_agent_id, transcript.program, transcript.event_id, transcript.text), Actor(call.session_agent_id, ActorType.AGENT),
                     cause_id=logged.id, environment_id=call.environment_id)

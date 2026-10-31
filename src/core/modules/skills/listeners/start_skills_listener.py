from core.base.agent_role import AgentRole
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.driver.hook_event_name import HookEventName
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.base.registry.registry import Registry
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.hook_call import HookCall
from core.modules.skills.commands.require_skill import RequireSkill
from core.modules.skills.listeners.skill_listener import SkillListener
from core.modules.skills.support.start_skills import StartSkills

START_ROLES = (AgentRole.MAIN, AgentRole.WORKER)


class StartSkillsListener(SkillListener):
    """When a main agent or a worker starts a session, the skills of the session-start setting become due for it;
    when it starts again right after a compaction, those of the after-compaction setting."""

    name = "skills.start"
    event = "hook_call.create"

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries, registry: Registry, start: StartSkills) -> None:
        super().__init__(bus, actors, queries, registry)
        self.start = start

    def handle(self, event: LoggedEvent) -> None:
        call = self.call(event)
        if call.hook != HookEventName.SESSION_START or self.queries.query(Agent).find(call.agent_id).role not in START_ROLES:
            return
        for skill in self.skills(call):
            self.run(event, RequireSkill(call.agent_id, skill))

    def skills(self, call: HookCall) -> list[str]:
        if self.follows_compaction(call):
            return self.start.after_compaction(call.environment_id)
        return self.start.session_start(call.environment_id)

    def follows_compaction(self, call: HookCall) -> bool:
        before = self.queries.query(HookCall).filter(agent_id=call.agent_id).newest().page(1, 2).rows
        return len(before) == 2 and before[1].hook == HookEventName.COMPACT

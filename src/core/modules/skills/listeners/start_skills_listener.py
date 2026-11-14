from core.modules.drivers.support.suite_choice import SuiteChoice
from engine.enums.agent_role import AgentRole
from engine.event.logged_event import LoggedEvent
from engine.command.bus import Bus
from engine.module.module_actors import ModuleActors
from engine.query.queries import Queries
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.models.hook_call import HookCall
from core.modules.skills.commands.require_skill.require_skill import RequireSkill
from core.modules.skills.listeners.skill_listener import SkillListener
from core.modules.skills.support.agent_profile_skills import AgentProfileSkills
from core.modules.skills.support.main_agent_skills import MainAgentSkills
from core.modules.skills.support.skill_catalogue import SkillCatalogue
from core.modules.skills.support.start_skills import StartSkills
from core.modules.skills.commands.reset_skills.reset_skills import ResetSkills
from core.modules.drivers.events.session_started import SessionStarted



class StartSkillsListener(SkillListener[SessionStarted]):
    """Requires startup skills for the prompt recipients declared by the suite. A new program session of an
    agent has read none of the skills the session before it loaded, so they are reset first."""

    name = "skills.start"

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries, catalogue: SkillCatalogue, start: StartSkills, suites: SuiteChoice, main_skills: MainAgentSkills, agents: AgentRows, profile_skills: AgentProfileSkills) -> None:
        super().__init__(bus, actors, queries, catalogue, suites, agents)
        self.start, self.main_skills, self.profile_skills = start, main_skills, profile_skills

    def handle(self, event: SessionStarted, logged: LoggedEvent) -> None:
        call = event.row
        if call.is_resumed:
            return
        previous_call = self.previous_call(call)
        if previous_call is not None and previous_call.program_session not in ("", call.program_session):
            self.run(logged, ResetSkills(call.session_agent_id))
        takes_start_skills = self.agents.find(call.session_agent_id).role in self.suites.agent_policy().prompt_roles
        start = self.skills(call, previous_call) if takes_start_skills else []
        profile_skills = self.profile_skills.required(call.session_agent_id)
        for skill in dict.fromkeys((*start, *profile_skills)):
            self.run(logged, RequireSkill(call.session_agent_id, skill))

    def skills(self, call: HookCall, previous_call: HookCall | None) -> list[str]:
        start = self.start.after_compaction() if previous_call is not None and previous_call.is_compaction else self.start.session_start()
        is_main = self.agents.find(call.session_agent_id).role == AgentRole.MAIN
        return [*start, *self.start.main_agent()] if is_main and self.main_skills.is_required else start

    def previous_call(self, call: HookCall) -> HookCall | None:
        recent = self.queries.query(HookCall).filter(session_agent_id=call.session_agent_id).newest().take(2)
        return recent[1] if len(recent) == 2 else None

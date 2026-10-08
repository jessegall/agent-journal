from features.base import Feature
from features.journal import Journal
from features.skill_loading.details import SkillLoadingDetails
from features.skill_loading.handlers import HoldUntilReloaded, NameStaleSkills, RemindUnloaded, RequireAlwaysSkills, RequireSkillsTheUserNames, ShowLoadsInChat
from features.skill_loading.interceptors import RefuseUntilLoaded, RequireCommandSkill
from features.skill_loading.catalogue import handed
from features.session_briefing.start import SKILLS, START_PARTS
from features.skill_loading.commands import LoadSkill, SetKeywords, ShowSkill, ShowSkills
from features.skill_loading.routes import get_skill, get_skills, post_skill_always, post_skill_keywords, post_skill_load


class SkillLoading(Feature):
    details = SkillLoadingDetails

    def register(self, journal: Journal) -> None:
        journal.routes.add(get_skills, get_skill, post_skill_load, post_skill_always, post_skill_keywords)
        for command in (ShowSkills(), ShowSkill(), LoadSkill(), SetKeywords()):
            journal.commands.add("agent", command)
        START_PARTS.add(self, handed, key=SKILLS)
        journal.events.handler(RemindUnloaded())
        journal.events.handler(HoldUntilReloaded())
        journal.events.handler(NameStaleSkills())
        journal.events.handler(RequireAlwaysSkills())
        journal.events.handler(ShowLoadsInChat())
        journal.events.handler(RequireSkillsTheUserNames())
        journal.agent.interceptor(RequireCommandSkill())
        journal.agent.interceptor(RefuseUntilLoaded())

from features.base import Feature
from features.journal import Journal
from features.skill_loading.details import SkillsDetails
from features.skill_loading.handlers import HoldUntilReloaded, NameStaleSkills, RemindUnloaded, RequireAlwaysSkills, ShowLoadsInChat
from features.skill_loading.interceptors import RefuseUntilLoaded, RequireCommandSkill


class Skills(Feature):
    details = SkillsDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(RemindUnloaded())
        journal.events.handler(HoldUntilReloaded())
        journal.events.handler(NameStaleSkills())
        journal.events.handler(RequireAlwaysSkills())
        journal.events.handler(ShowLoadsInChat())
        journal.agent.interceptor(RequireCommandSkill())
        journal.agent.interceptor(RefuseUntilLoaded())

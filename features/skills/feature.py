from features.base import Feature
from features.journal import Journal
from features.skills.details import SkillsDetails
from features.skills.handlers import HoldUntilReloaded, NameStaleSkills, RemindUnloaded
from features.skills.interceptors import NameSkillForCommand


class Skills(Feature):
    details = SkillsDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(RemindUnloaded())
        journal.events.handler(HoldUntilReloaded())
        journal.events.handler(NameStaleSkills())
        journal.agent.interceptor(NameSkillForCommand())

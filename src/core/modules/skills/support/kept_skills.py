from pathlib import Path

from core.base.driver.agent_hook import AgentHook
from core.base.provider.providers import Providers
from core.base.skill.skill_contents import SkillContents
from core.base.skill.skill_digest import SkillDigest
from core.modules.skills.commands.load_skill.load_skill import LoadSkill
from core.modules.skills.support.skill_catalogue import SkillCatalogue


class KeptSkills:
    """The skills still due that the agent's program put back into its context after a compaction, each only
    while the text it put back is the skill's current text. The program writes that record after its
    session start hook, so it is read at the agent's first tool use."""

    def __init__(self, providers: Providers, catalogue: SkillCatalogue) -> None:
        self.providers, self.catalogue = providers, catalogue

    def loads(self, hook: AgentHook, due: list[str]) -> list[LoadSkill]:
        kept = self.providers.provider(hook.event.program).skills_kept_after_compaction(hook.event)
        return [LoadSkill(hook.agent_id, skill.folder, skill.digest) for skill in self.catalogue.skills()
                if skill.folder in due and skill.folder in kept and kept[skill.folder] == SkillDigest.digest(SkillContents.read(Path(skill.path)).body)]

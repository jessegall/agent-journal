from collections.abc import Mapping
from pathlib import Path

from core.base.driver.hook_transcript import HookTranscript
from core.base.provider.providers import Providers
from core.base.skill.skill_contents import SkillContents
from core.base.skill.skill_digest import SkillDigest
from core.modules.skills.commands.load_skill.load_skill import LoadSkill
from core.modules.skills.support.skill_catalogue import SkillCatalogue


class KeptSkills:
    """The skills still due that the agent's program put back into its context after a compaction, each only
    while the text it put back is the skill's current text. The program writes that record after its session
    start hook, so it is read at the agent's first tool use, and read once for one hook."""

    def __init__(self, providers: Providers, catalogue: SkillCatalogue) -> None:
        self.providers, self.catalogue = providers, catalogue
        self.last: tuple[str, Mapping[str, str]] | None = None

    def loads(self, agent_id: int, transcript: HookTranscript, due: list[str]) -> list[LoadSkill]:
        kept = self.digests(transcript)
        return [LoadSkill(agent_id, skill.folder, skill.digest) for skill in self.catalogue.skills()
                if skill.folder in due and skill.folder in kept and kept[skill.folder] == SkillDigest.digest(SkillContents.read(Path(skill.path)).body)]

    def digests(self, transcript: HookTranscript) -> Mapping[str, str]:
        if self.last is None or self.last[0] != transcript.firing:
            self.last = (transcript.firing, self.providers.provider(transcript.program).skills_kept_after_compaction(transcript.path))
        return self.last[1]

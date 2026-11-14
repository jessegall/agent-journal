from core.modules.drivers.support.current_context_window import COMPACTION_ENDED_AT
from engine.module.driver_entries import DRIVERS_MODULE
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.skills.support.kept_skill_records import KeptSkillRecords
from engine.journal.journal_home import JournalHome
from collections.abc import Mapping
from pathlib import Path

from engine.driver.hook_transcript import HookTranscript
from engine.provider.providers import Providers
from engine.skill.skill_contents import SkillContents
from engine.skill.skill_digest import SkillDigest
from core.modules.skills.commands.load_skill.load_skill import LoadSkill
from core.modules.skills.support.skill_catalogue import SkillCatalogue


class KeptSkills:
    """The skills still due that the agent's program put back into its context after a compaction, each only
    while the text it put back is the skill's current text. The program writes that record after its session
    start hook, so it is read at the agent's first tool use after it, and kept until the next start."""

    def __init__(self, providers: Providers, catalogue: SkillCatalogue, agents: AgentRows, home: JournalHome) -> None:
        self.providers, self.catalogue, self.agents, self.home = providers, catalogue, agents, home
        self.last: tuple[str, Mapping[str, str]] | None = None

    def loads(self, agent_id: int, transcript: HookTranscript, due: list[str]) -> list[LoadSkill]:
        kept = self.kept_digests(agent_id, transcript)
        return [LoadSkill(agent_id, skill.folder, skill.digest) for skill in self.catalogue.skills()
                if skill.folder in due and skill.folder in kept and kept[skill.folder] == SkillDigest.digest(SkillContents.read(Path(skill.path)).body)]

    # the transcript's record is kept until the agent's session is replaced or compacted, the only times the program
    # writes it
    def kept_digests(self, agent_id: int, transcript: HookTranscript) -> Mapping[str, str]:
        if self.last is not None and self.last[0] == transcript.firing:
            return self.last[1]
        agent = self.agents.find(agent_id)
        session_mark = f"{agent.session} {agent.metadata.module_part(DRIVERS_MODULE).get(COMPACTION_ENDED_AT)}"
        digests = KeptSkillRecords.shared(self.home).digests(str(transcript.path), session_mark, lambda: self.read_digests(transcript))
        self.last = (transcript.firing, digests)
        return digests

    def read_digests(self, transcript: HookTranscript) -> Mapping[str, str]:
        return self.providers.provider(transcript.program).skills_kept_after_compaction(transcript.path)

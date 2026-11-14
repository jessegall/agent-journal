from core.modules.skills.commands.load_skill.support.kept_skill_records import KeptSkillRecords
from core.modules.drivers.models.hook_call import HookCall
from engine.query.queries import Queries
from engine.journal.journal_home import JournalHome
from engine.enums.hook_event_name import HookEventName
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

    def __init__(self, providers: Providers, catalogue: SkillCatalogue, queries: Queries, home: JournalHome) -> None:
        self.providers, self.catalogue, self.queries, self.home = providers, catalogue, queries, home
        self.last: tuple[str, Mapping[str, str]] | None = None

    def loads(self, agent_id: int, transcript: HookTranscript, due: list[str]) -> list[LoadSkill]:
        kept = self.kept_digests(agent_id, transcript)
        return [LoadSkill(agent_id, skill.folder, skill.digest) for skill in self.catalogue.skills()
                if skill.folder in due and skill.folder in kept and kept[skill.folder] == SkillDigest.digest(SkillContents.read(Path(skill.path)).body)]

    # the transcript's record is kept until the agent's session starts again, the only time the program writes it
    def kept_digests(self, agent_id: int, transcript: HookTranscript) -> Mapping[str, str]:
        start = self.queries.query(HookCall).filter(session_agent_id=agent_id, hook=HookEventName.SESSION_START).newest().first()
        return KeptSkillRecords.shared(self.home).digests(str(transcript.path), start.id if start is not None else 0, lambda: self.digests(transcript))

    def digests(self, transcript: HookTranscript) -> Mapping[str, str]:
        if self.last is None or self.last[0] != transcript.firing:
            self.last = (transcript.firing, self.providers.provider(transcript.program).skills_kept_after_compaction(transcript.path))
        return self.last[1]

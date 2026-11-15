from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.driver.hook_transcript import HookTranscript
from engine.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.skills.commands.load_skill.support.kept_skills import KeptSkills
from core.modules.skills.commands.record_kept_skills.record_kept_skills import RecordKeptSkills
from core.modules.skills.support.kept_skill_mark import KeptSkillMark
from core.modules.skills.support.unread_skills import UnreadSkills


class RecordKeptSkillsHandler(Handler[RecordKeptSkills, Agent]):
    """Reads the kept skills once with the reader the skill needs already use, loads each due one, then marks the agent's
    session and compaction as recorded."""

    command = RecordKeptSkills

    def __init__(self, unread_skills: UnreadSkills, kept: KeptSkills, agents: AgentRows, bus: Bus, repository: Repository) -> None:
        self.unread_skills, self.kept, self.agents, self.bus, self.repository = unread_skills, kept, agents, bus, repository

    def handle(self, command: RecordKeptSkills, context: Context) -> Agent:
        due = self.unread_skills.names(command.agent_id)
        transcript = HookTranscript(command.program, command.firing, command.transcript_path)
        for read in self.kept.loads(command.agent_id, transcript, due) if due else ():
            self.bus.dispatch(read, context)
        agent = self.agents.find(command.agent_id)
        return self.repository.save_metadata(agent, KeptSkillMark.recorded(agent), context)

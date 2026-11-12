from uuid import uuid4

from engine.command.bus import Bus
from engine.command.context import Context
from engine.enums.helper_role import HelperRole
from engine.enums.model_tier import ModelTier
from engine.profile.agent_profile import AgentProfile
from engine.repository.repository import Repository
from core.modules.agents.commands.start_agent.start_agent import StartAgent
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.helper_job import HelperJob

REVIEWER_PROFILE_NAME = "journal-reviewer"
REVIEWER_PROFILE = AgentProfile(
    REVIEWER_PROFILE_NAME, "Reads finished work and compares it with what was asked. Read-only.",
    "You review finished work and change no file. Read what the work changed with the journal and with version control commands that only read, and compare it with the brief you are given. "
    "Answer in a short report: what matches, what is missing and what differs, with the files and lines that show each point.",
    title="Reviewer", agent_type="helper", tier=ModelTier.GENERAL, model="sonnet", codex_model="gpt-6.1-terra",
    skills=("journal", "journal-shell", "journal-documents"))
JOB_DESCRIPTION = "Review"
INSTRUCTION_CHARACTERS = 200


class ReviewerStart:
    """Starts a read-only reviewer: its agent on a session of its own, and, for a reviewer that has a brief to
    work on, the job that starts its program on that brief."""

    def __init__(self, bus: Bus, repository: Repository) -> None:
        self.bus, self.repository = bus, repository

    def started(self, program: str, model: str, parent: Agent | None, context: Context) -> Agent:
        return self.bus.dispatch(StartAgent(str(uuid4()), program, HelperRole.REVIEWER, parent.id if parent is not None else None, program_model=model,
                                            profile=REVIEWER_PROFILE_NAME, access="read-only"), context)

    def launched(self, reviewer: Agent, parent: Agent, brief: str, context: Context) -> HelperJob:
        return self.repository.save(HelperJob(session_agent_id=parent.id, creator_id=context.actor.id, tool_key=reviewer.session, helper_id=reviewer.id, profile=reviewer.profile,
                                              program_model=reviewer.program_model, program=reviewer.program, description=JOB_DESCRIPTION, instruction=brief[:INSTRUCTION_CHARACTERS],
                                              brief=brief, started_at=context.timestamp, cost_baseline=0.0, new_session=True), context)

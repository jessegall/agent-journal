from declaring.details import FeatureDetails
from declaring.groups import Group
from declaring.settings import ModelsSetting
from resources.base import PROJECT

MODEL = "profile_model"


class AgentProfilesDetails(FeatureDetails):
    explains = "The journal writes a researcher, a planner and a debugger as agent profiles, so Claude and Codex can start a subagent for each job."
    name = "agent_profiles"
    group = Group.SESSIONS
    label = "Write agent profiles for research, planning and debugging"
    has_skill = False

    title = "Agent profiles"

    abstract = "A researcher, a planner and a debugger are written as agent profiles for every agent the project uses"

    help = """
        The journal writes three agent profiles into the project, for Claude in .claude/agents and for Codex in
        .codex/agents: a researcher that answers a question from the code, the record and the web, a planner that
        designs how to build a change, and a debugger that traces a fault to where it starts. Each only reads and
        reports back to the agent that started it, which does the writing. The model each runs on is set here, per agent.
    """

    settings = [
        ModelsSetting(
            name=MODEL,
            title="Model for the researcher, the planner and the debugger",
            scope=PROJECT,
        ),
    ]

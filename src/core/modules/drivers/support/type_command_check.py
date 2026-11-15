from collections.abc import Sequence

from engine.driver.agent_message import AgentMessage
from engine.helper_type.command_allow_list import CommandAllowList
from engine.helper_type.helper_type_book import HelperTypeBook
from engine.helper_type.helper_type_entry import HelperTypeEntry
from engine.helper_type.journal_line import JournalLine
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.base_commands import BASE_COMMANDS
from core.modules.drivers.support.command_refusal_text import CommandRefusalText
from core.modules.profiles.support.profile_files import ProfileFiles


class TypeCommandCheck:
    """Whether an agent may run journal lines: a helper runs its type's list, narrowed by its profile's list
    when the profile declares one, beside the base list every helper has; the main agent runs every line.
    The command policy and the server both ask it."""

    def __init__(self, types: HelperTypeBook, profiles: ProfileFiles) -> None:
        self.types, self.profiles = types, profiles

    def refusal(self, agent: Agent, lines: Sequence[JournalLine]) -> AgentMessage | None:
        if not self.types.is_helper(agent.role):
            return None
        helper_type = self.types.find(agent.role)
        commands = self.commands(helper_type, agent.profile)
        refused_line = commands.refused_line(lines)
        return CommandRefusalText(helper_type.label, commands).agent_message(refused_line) if refused_line is not None else None

    def commands(self, helper_type: HelperTypeEntry, profile_name: str) -> CommandAllowList:
        profile = self.profiles.registered(profile_name) if profile_name else None
        listed = helper_type.commands.intersection(profile.commands) if profile is not None and profile.commands is not None else helper_type.commands
        return BASE_COMMANDS.joined(listed)

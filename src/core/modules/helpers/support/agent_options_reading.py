from dataclasses import dataclass

from core.modules.helpers.support.agent_field_options import AgentFieldOptions


@dataclass(frozen=True)
class AgentOptionsReading:
    """The options one agent type and profile has now, where they were set (environment, project or default) and
    what is wrong with the stored lines. While something is wrong, the options deny every new job and resume."""

    options: AgentFieldOptions
    source: str
    problems: tuple[str, ...] = ()

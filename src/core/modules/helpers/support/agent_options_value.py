import re
from collections.abc import Collection
from dataclasses import dataclass, replace

from core.modules.helpers.support.agent_field_options import AgentFieldOptions
from core.modules.helpers.support.malformed_agent_options import MalformedAgentOptions

LINE = re.compile(r"^(?P<agent_type>[\w.-]+)(?::(?P<profile>[\w.-]+))? (?P<field>\w+)=(?P<value>.*)$")


@dataclass(frozen=True)
class AgentOptionsValue:
    """The agent options setting, a line each as `agent_type field=value` or `agent_type:profile field=value`.
    A list value has its items separated by commas, and an empty value is an explicit empty list."""

    targets: tuple[tuple[str, AgentFieldOptions], ...]
    set_fields: tuple[tuple[str, frozenset[str]], ...] = ()

    @classmethod
    def parse(cls, lines: Collection[str], agent_types: Collection[str]) -> "AgentOptionsValue":
        options: dict[str, AgentFieldOptions] = {}
        fields: dict[str, set[str]] = {}
        for line in lines:
            match = LINE.fullmatch(line)
            if match is None:
                raise MalformedAgentOptions.line(line, "expected `agent_type field=value` or `agent_type:profile field=value`")
            if match["agent_type"] not in agent_types:
                raise MalformedAgentOptions.line(line, f"{match['agent_type']} is not one of {', '.join(sorted(agent_types))}")
            target = match["agent_type"] if match["profile"] is None else f"{match['agent_type']}:{match['profile']}"
            if match["field"] in fields.get(target, set()):
                raise MalformedAgentOptions.line(line, f"{match['field']} is set twice for {target}")
            options[target] = options.get(target, AgentFieldOptions()).with_field(line, match["field"], match["value"])
            fields.setdefault(target, set()).add(match["field"])
        for target, target_options in options.items():
            for problem in target_options.relation_problems():
                raise MalformedAgentOptions.line(target, problem)
        return cls(tuple(options.items()), tuple((target, frozenset(names)) for target, names in fields.items()))

    @classmethod
    def problems(cls, lines: Collection[str], agent_types: Collection[str]) -> list[str]:
        try:
            cls.parse(lines, agent_types)
        except MalformedAgentOptions as error:
            return [str(error)]
        return []

    def effective_options(self, agent_type: str, profile: str) -> AgentFieldOptions:
        targets = dict(self.targets)
        type_options = targets.get(agent_type, AgentFieldOptions())
        profile_target = f"{agent_type}:{profile}"
        if profile_target not in targets:
            return type_options
        names = dict(self.set_fields)[profile_target]
        return replace(type_options, **{name: getattr(targets[profile_target], name) for name in names})

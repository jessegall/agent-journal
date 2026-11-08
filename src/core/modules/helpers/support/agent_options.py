from core.base.registry.registry import Registry
from core.base.type_guards import is_text_list, is_tuple
from core.modules.helpers.support.agent_field_options import AgentFieldOptions
from core.modules.helpers.support.agent_options_reading import AgentOptionsReading
from core.modules.helpers.support.agent_options_value import AgentOptionsValue
from core.modules.helpers.support.helper_settings import AGENT_OPTIONS
from core.modules.settings.support.setting_reader import SettingReader

DENY_ALL = AgentFieldOptions(allow_new=False, allow_resume=False, allowed_profiles=(), allowed_providers=(), allowed_models=(), model_defaults=())


class AgentOptions:
    """Reads the agent options setting once for an environment and answers the options of an agent type and
    profile. Stored lines that do not follow the declared shape are reported, and deny everything until
    they are repaired."""

    def __init__(self, reader: SettingReader, registry: Registry) -> None:
        self.reader, self.registry = reader, registry

    def reading(self, agent_type: str, profile: str = "") -> AgentOptionsReading:
        current = self.reader.current(AGENT_OPTIONS)
        stored = list(current.value) if is_tuple(current.value) else current.value
        if not is_text_list(stored):
            return AgentOptionsReading(DENY_ALL, current.source, tuple([f"{AGENT_OPTIONS} holds {current.value!r}, not a list of text lines"]))
        problems = AgentOptionsValue.problems(stored, self.registry.role_names)
        if problems:
            return AgentOptionsReading(DENY_ALL, current.source, tuple(problems))
        value = AgentOptionsValue.parse(stored, self.registry.role_names)
        return AgentOptionsReading(value.effective_options(agent_type, profile), current.source)

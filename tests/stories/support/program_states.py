import importlib
import importlib.util
from unittest.mock import Mock
from core.base.provider.providers import Providers

STATES_MODULE = 'core.modules.helpers.support.program_states'
STATE_MODULE = 'core.modules.helpers.support.program_state'


def bind_ready_programs(story):
    if importlib.util.find_spec(STATES_MODULE) is None:
        return
    states_type = importlib.import_module(STATES_MODULE).ProgramStates
    state_type = importlib.import_module(STATE_MODULE).ProgramState
    states = Mock(spec=states_type)
    states.state.return_value = state_type.ready()
    states.ready_programs.return_value = tuple(provider.name for provider in story.container.get(Providers).all())
    story.container.bind(states_type, states)


def real_program_states(story):
    if importlib.util.find_spec(STATES_MODULE) is None:
        return
    states_type = importlib.import_module(STATES_MODULE).ProgramStates
    story.container.bind(states_type, story.container.constructed(states_type))

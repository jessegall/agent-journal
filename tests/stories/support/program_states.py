import importlib
import importlib.util
from unittest.mock import Mock
from engine.provider.providers import Providers

STATES_MODULE = 'core.modules.helpers.support.program_states'
STATE_MODULE = 'core.modules.helpers.support.program_state'


def bind_ready_programs(story):
    if importlib.util.find_spec(STATES_MODULE) is None:
        return
    states_type = importlib.import_module(STATES_MODULE).ProgramStates
    state_type = importlib.import_module(STATE_MODULE).ProgramState
    states = Mock(spec=states_type)
    states.state.return_value = state_type.ready()
    states.outage_state.return_value = state_type.ready()
    states.windows.return_value = ()
    ready = {provider.name: state_type.ready() for provider in story.container.get(Providers).all()}
    states.ready_programs.return_value = tuple(ready)
    readiness_type = importlib.import_module('core.modules.helpers.support.program_readiness').ProgramReadiness
    states.readiness.return_value = readiness_type(ready)
    story.replace(states_type, states)


def real_program_states(story):
    if importlib.util.find_spec(STATES_MODULE) is None:
        return
    states_type = importlib.import_module(STATES_MODULE).ProgramStates
    story.rebuild(states_type)

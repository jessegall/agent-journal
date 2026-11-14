from engine.registry.registry import Registry
from engine.scope.scopes import Scopes
from tests.unit.engine.samples.sample_container import sample_container


def test_scopes_reset_clears_round_state(tmp_path):
    scopes = sample_container(tmp_path, Registry("abc", {}, {}, {}, (), ())).get(Scopes)
    scopes.causing_agents[1] = 7
    scopes.reset()
    assert scopes.causing_agents == {}

from pathlib import Path

from framework.loaded import discover
from serving import SERVED, Providers


def written(project: Path, record) -> list[Path]:
    """Writes every feature's agent types for each provider present in the project, each with the model its feature's settings pick."""
    from framework.base import REGISTRY
    discover()
    return [path for agent in SERVED.given(Providers).every() if agent.present(project)
            for feature in REGISTRY.values() if feature.agent_types
            for path in agent.agent_types(project, [(kind, getattr(feature.details.values(record), kind.setting)[agent.name]) for kind in feature.agent_types])]

import time

from resources.agent_starts import DetachedStart
from serving import SERVED, Processes, Providers


def launch(environments, place, provider: str, conversation: str = ""):
    root = environments.record.root
    SERVED.given(Processes).start_detached(root, DetachedStart(root.parent, place.title, provider, tuple(SERVED.given(Providers).driver(provider).AUTO_ARGS), conversation))
    return environments.update(place.n, launched=time.time(), launched_agent=provider)

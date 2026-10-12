import time

from agents.terminal import detached
from serving import SERVED, Providers


def launch(environments, place, provider: str, conversation: str = ""):
    root = environments.record.root
    detached(root, root.parent, place.title, provider, [*SERVED.given(Providers).driver(provider).AUTO_ARGS], conversation=conversation)
    return environments.update(place.n, launched=time.time(), launched_agent=provider)

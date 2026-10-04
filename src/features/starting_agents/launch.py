import time

from agents.terminal import detached
from providers import DRIVERS


def launch(environments, place, provider: str, conversation: str = ""):
    root = environments.record.root
    detached(root, root.parent, place.title, provider, [*DRIVERS[provider].AUTO_ARGS], conversation=conversation)
    return environments.update(place.n, launched=time.time(), launched_agent=provider)

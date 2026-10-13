import time

from serving import SERVED, Processes, Providers


def launch(environments, place, provider: str, conversation: str = ""):
    root = environments.record.root
    SERVED.given(Processes).start_detached(root, root.parent, place.title, provider, [*SERVED.given(Providers).driver(provider).AUTO_ARGS], conversation)
    return environments.update(place.n, launched=time.time(), launched_agent=provider)

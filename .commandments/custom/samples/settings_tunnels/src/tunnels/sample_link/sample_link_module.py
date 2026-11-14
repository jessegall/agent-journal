from engine.module.module import Module

# @sin architecture_tunnels_secret_literal_in_tunnel
ACCESS_TOKEN = "f3a9c2d1e4b5"
HOST_NAME = "tunler"


class SampleLinkModule(Module):
    """A tunnel module sample that keeps its token in its code."""

    name = "journal.tunnels.sample_link"

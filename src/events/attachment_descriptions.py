"""What attachment descriptions recognises: media attached to a row that has no tags, and a video to sample into frames."""

from dataclasses import dataclass

from events import Fact


@dataclass(frozen=True, kw_only=True)
class MediaAttached(Fact):
    """A picture or video was attached to a row and has no tags yet, so every live agent is asked for them."""

    type: str
    n: int
    name: str


@dataclass(frozen=True, kw_only=True)
class MediaUntagged(Fact):
    """A picture or video attached earlier still has no tags, and the agent that just started is asked for them."""

    type: str
    n: int
    name: str


@dataclass(frozen=True, kw_only=True)
class ManyMediaUntagged(Fact):
    """Many pictures and videos still have no tags: this is how many, and the first of them."""

    count: int
    listed: str


@dataclass(frozen=True, kw_only=True)
class VideoToSample(Fact):
    """A video was attached to a message and is to be sampled into frames."""

    message: int
    name: str

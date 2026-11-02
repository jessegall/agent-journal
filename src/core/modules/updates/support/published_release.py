from dataclasses import dataclass


@dataclass(frozen=True)
class PublishedRelease:
    """The newest release at the release address: the SHA-256 its checksums.txt gives its archive, and its tag
    when the address led to one."""

    address: str
    checksum: str
    tag: str

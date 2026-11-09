from core.base.refusal import Refusal


class MissingCgroupRefusal(Refusal):
    """A hosted journal was started on a host without cgroup v2."""

    @classmethod
    def no_cgroup(cls) -> "MissingCgroupRefusal":
        return cls("a hosted journal needs cgroup v2, and /sys/fs/cgroup/cgroup.controllers is missing", "boot the host with the unified cgroup hierarchy")

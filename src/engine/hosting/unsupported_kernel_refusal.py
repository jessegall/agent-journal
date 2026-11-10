from engine.errors.refusal import Refusal


class UnsupportedKernelRefusal(Refusal):
    """A hosted journal was started on a host that is not Linux."""

    @classmethod
    def wrong_kernel(cls, kernel: str) -> "UnsupportedKernelRefusal":
        return cls(f"a hosted journal runs only on Linux, and this host is {kernel}", "remove the hosted file to run a local journal")

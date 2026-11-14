from engine.errors.refusal import Refusal


class MissingReleaseDownloadError(Refusal):
    """The release address has no download files for an installable version 5 release."""

    @classmethod
    def create(cls, address: str) -> "MissingReleaseDownloadError":
        return cls(f"No installable release was found at {address}",
                   "Check the address, or try again after a version 5 release is published.")

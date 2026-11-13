from core.modules.library.errors.library_failure_error import LibraryFailureError


class LibraryStoppedError(LibraryFailureError):
    """The server or the connection needs a user before anything more is sent: sync stops until they connect again."""

    @classmethod
    def address_changed(cls) -> "LibraryStoppedError":
        return cls("The address changed. Connect again to send your token to it.")

    @classmethod
    def changed_server(cls) -> "LibraryStoppedError":
        return cls("This address now answers as another server.", "journal library disconnect --forget removes the copies of the old one")

    @classmethod
    def disconnected(cls) -> "LibraryStoppedError":
        return cls("This journal is not connected to a shared server.", "journal library connect <address> --token <token>")

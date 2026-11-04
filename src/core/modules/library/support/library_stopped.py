from core.modules.library.support.library_failure import LibraryFailure


class LibraryStopped(LibraryFailure):
    """The server or the connection needs a person before anything more is sent: sync stops until they connect again."""

    @classmethod
    def address_changed(cls) -> "LibraryStopped":
        return cls("The address changed. Connect again to send your token to it.")

    @classmethod
    def changed_server(cls) -> "LibraryStopped":
        return cls("This address now answers as another server.", "journal library disconnect --forget removes the copies of the old one")

    @classmethod
    def disconnected(cls) -> "LibraryStopped":
        return cls("This journal is not connected to a shared server.", "journal library connect <address> --token <token>")

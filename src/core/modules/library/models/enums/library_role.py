from enum import StrEnum


class LibraryRole(StrEnum):
    """What a person may do on the shared server: administer it, edit its items or only read them."""

    ADMIN = "admin"
    EDIT = "edit"
    READ = "read"

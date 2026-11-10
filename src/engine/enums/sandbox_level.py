from enum import StrEnum


class SandboxLevel(StrEnum):
    NONE = "none"
    MACOS = "macos-sandbox"
    LANDLOCK = "landlock"
    NAMESPACE = "namespace"
    PARTIAL = "landlock-partial"

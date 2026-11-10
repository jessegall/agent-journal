from abc import ABC, abstractmethod
from contextlib import AbstractContextManager


class SettingSource(ABC):
    """Where the value of a declared setting is read from, bound by the settings module to its reader. The current
    value is the one for the environment in hand, else for the project, else the declared default; the project
    value never reads a row of one environment. Inside keep_rows each stored row is read once and kept."""

    @abstractmethod
    def current_value(self, key: str) -> object: ...

    @abstractmethod
    def project_value(self, key: str) -> object: ...

    @abstractmethod
    def keep_rows(self) -> AbstractContextManager[None]: ...

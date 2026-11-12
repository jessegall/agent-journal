from collections.abc import Mapping
from types import MappingProxyType

from server.viewer.answer_headers import AnswerHeaders


class LocalHeaders(AnswerHeaders):
    """The headers of a journal on a user's own machine: no added header and a plain cookie."""

    def common_headers(self) -> Mapping[str, str]:
        return MappingProxyType({})

    def shell_page(self) -> Mapping[str, str]:
        return MappingProxyType({})

    def listener_origin(self, host: str) -> str:
        return f"http://{host}"

    def cookie(self, name: str, value: str) -> str:
        return f"{name}={value}; HttpOnly; SameSite=Strict; Path=/"

from collections.abc import Mapping


class AnswerHeaders:
    """The headers a viewer listener adds to its answers, its shell page and its cookies."""

    cookie_prefix = ""

    def common_headers(self) -> Mapping[str, str]:
        raise NotImplementedError

    def shell_page(self) -> Mapping[str, str]:
        raise NotImplementedError

    def listener_origin(self, host: str) -> str:
        raise NotImplementedError

    def cookie(self, name: str, value: str) -> str:
        raise NotImplementedError

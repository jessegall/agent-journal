from email.parser import BytesParser
from email.policy import default


class Multipart:
    """A multipart form body read into its fields and its files, with the standard library's mail parser."""

    def __init__(self, content_type: str, raw: bytes) -> None:
        self.message = BytesParser(policy=default).parsebytes(f"Content-Type: {content_type}\r\n\r\n".encode() + raw)

    def fields(self) -> dict:
        return {part.get_param("name", header="content-disposition"): part.get_payload(decode=True).decode(errors="replace") for part in self.parts() if not part.get_filename()}

    def files(self) -> dict:
        return {part.get_filename(): part.get_payload(decode=True) for part in self.parts() if part.get_filename()}

    def parts(self):
        return [part for part in self.message.iter_parts()] if self.message.is_multipart() else []

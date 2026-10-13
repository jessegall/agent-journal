"""Hiding a secret's value wherever it would be printed, in every form a program may print it in."""

import base64
import json
import urllib.parse


def forms(value: str) -> list[bytes]:
    raw = value.encode()
    found = {raw, base64.b64encode(raw), base64.urlsafe_b64encode(raw), urllib.parse.quote(value, safe="").encode(),
             json.dumps(value)[1:-1].encode(), raw.hex().encode()}
    return sorted((form.rstrip(b"=") for form in found if form), key=len, reverse=True)


class Masker:
    def __init__(self, masks: dict[str, str]):
        self.masks = [(form, f"[secret {name}]".encode()) for value, name in masks.items() for form in forms(value)]
        self.carried = max((len(form) for form, _ in self.masks), default=1) - 1
        self.held = b""

    def feed(self, chunk: bytes) -> bytes:
        self.held = self.masked(self.held + chunk)
        cut = max(len(self.held) - self.carried, 0)
        ready, self.held = self.held[:cut], self.held[cut:]
        return ready

    def flush(self) -> bytes:
        ready, self.held = self.masked(self.held), b""
        return ready

    def masked(self, text: bytes) -> bytes:
        for form, mask in self.masks:
            text = text.replace(form, mask)
        return text

    def masked_text(self, text: str) -> str:
        return self.masked(text.encode()).decode(errors="replace")

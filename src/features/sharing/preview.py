import struct
import zlib
from functools import lru_cache
from html import escape

CARD = (1200, 630)
DESCRIBED = 200
DARKER = 90
FALLBACK = (0, 144, 255)


def rgb(color: str) -> tuple[int, int, int]:
    code = color.lstrip("#")
    return tuple(int(code[i:i + 2], 16) for i in (0, 2, 4)) if len(code) == 6 else FALLBACK


def chunk(kind: bytes, body: bytes) -> bytes:
    return struct.pack(">I", len(body)) + kind + body + struct.pack(">I", zlib.crc32(kind + body))


@lru_cache(maxsize=16)
def card(color: str) -> bytes:
    width, height = CARD
    top = rgb(color)
    bottom = tuple(max(0, value - DARKER) for value in top)
    shade = lambda y: bytes(round(a + (b - a) * y / height) for a, b in zip(top, bottom))
    pixels = b"".join(b"\x00" + shade(y) * width for y in range(height))
    header = struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0)
    return b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", header) + chunk(b"IDAT", zlib.compress(pixels, 9)) + chunk(b"IEND", b"")


def tags(title: str, description: str, image: str, url: str, site: str) -> str:
    text = " ".join(description.split())[:DESCRIBED]
    fields = [("property", "og:type", "website"), ("property", "og:site_name", site), ("property", "og:title", title),
              ("property", "og:description", text), ("property", "og:url", url), ("property", "og:image", image),
              ("name", "twitter:card", "summary_large_image"), ("name", "twitter:title", title),
              ("name", "twitter:description", text), ("name", "twitter:image", image), ("name", "description", text)]
    return "".join(f'<meta {key}="{name}" content="{escape(value)}">' for key, name, value in fields if value)

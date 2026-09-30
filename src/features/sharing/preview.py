import struct
import zlib
from functools import lru_cache
from html import escape

CARD = (1200, 630)
DESCRIBED = 200
DARKER = 90
DISC = 0.22
WHITE = b"\xff\xff\xff"
FALLBACK = (0, 144, 255)


def rgb(color: str) -> tuple[int, int, int]:
    code = color.lstrip("#")
    return tuple(int(code[i:i + 2], 16) for i in (0, 2, 4)) if len(code) == 6 else FALLBACK


def chunk(kind: bytes, body: bytes) -> bytes:
    return struct.pack(">I", len(body)) + kind + body + struct.pack(">I", zlib.crc32(kind + body))


def shades(color: str, height: int) -> list[bytes]:
    top = rgb(color)
    bottom = tuple(max(0, value - DARKER) for value in top)
    return [bytes(round(a + (b - a) * y / height) for a, b in zip(top, bottom)) for y in range(height)]


def png(width: int, rows: list[bytes]) -> bytes:
    header = struct.pack(">IIBBBBB", width, len(rows), 8, 2, 0, 0, 0)
    pixels = b"".join(b"\x00" + row for row in rows)
    return b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", header) + chunk(b"IDAT", zlib.compress(pixels, 9)) + chunk(b"IEND", b"")


@lru_cache(maxsize=16)
def card(color: str) -> bytes:
    width, height = CARD
    return png(width, [shade * width for shade in shades(color, height)])


@lru_cache(maxsize=16)
def icon(color: str, side: int) -> bytes:
    middle, radius = side / 2, side * DISC
    rows = []
    for y, shade in enumerate(shades(color, side)):
        reach = radius ** 2 - (y + 0.5 - middle) ** 2
        left, right = (round(middle - reach ** 0.5), round(middle + reach ** 0.5)) if reach > 0 else (side, side)
        rows.append(shade * left + WHITE * (right - left) + shade * (side - right))
    return png(side, rows)


def tags(title: str, description: str, image: str, url: str, site: str) -> str:
    text = " ".join(description.split())[:DESCRIBED]
    fields = [("property", "og:type", "website"), ("property", "og:site_name", site), ("property", "og:title", title),
              ("property", "og:description", text), ("property", "og:url", url), ("property", "og:image", image),
              ("name", "twitter:card", "summary_large_image"), ("name", "twitter:title", title),
              ("name", "twitter:description", text), ("name", "twitter:image", image), ("name", "description", text)]
    return "".join(f'<meta {key}="{name}" content="{escape(value)}">' for key, name, value in fields if value)

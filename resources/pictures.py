import struct
from pathlib import Path


def png(head: bytes) -> tuple[int, int] | None:
    return struct.unpack(">II", head[16:24]) if head[:8] == b"\x89PNG\r\n\x1a\n" and head[12:16] == b"IHDR" else None


def gif(head: bytes) -> tuple[int, int] | None:
    return struct.unpack("<HH", head[6:10]) if head[:6] in (b"GIF87a", b"GIF89a") else None


def webp(head: bytes) -> tuple[int, int] | None:
    if head[:4] != b"RIFF" or head[8:12] != b"WEBP":
        return None
    kind = head[12:16]
    if kind == b"VP8X":
        return int.from_bytes(head[24:27], "little") + 1, int.from_bytes(head[27:30], "little") + 1
    if kind == b"VP8L":
        bits = int.from_bytes(head[21:25], "little")
        return (bits & 0x3FFF) + 1, ((bits >> 14) & 0x3FFF) + 1
    if kind == b"VP8 ":
        return struct.unpack("<HH", head[26:30])[0] & 0x3FFF, struct.unpack("<HH", head[28:32])[0] & 0x3FFF
    return None


def jpeg(data: bytes) -> tuple[int, int] | None:
    if data[:2] != b"\xff\xd8":
        return None
    i = 2
    while i + 9 < len(data):
        if data[i] != 0xFF:
            i += 1
            continue
        marker = data[i + 1]
        if marker in (0xD8, 0x01) or 0xD0 <= marker <= 0xD7:
            i += 2
            continue
        length = struct.unpack(">H", data[i + 2:i + 4])[0]
        if marker in (0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7, 0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF):
            height, width = struct.unpack(">HH", data[i + 5:i + 9])
            return width, height
        i += 2 + length
    return None


def dimensions(path: Path) -> tuple[int, int] | None:
    try:
        with path.open("rb") as f:
            head = f.read(65536)
    except OSError:
        return None
    for read in (png, gif, webp, jpeg):
        got = read(head)
        if got and all(got):
            return int(got[0]), int(got[1])
    return None

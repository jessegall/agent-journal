import struct
import zlib

DIM_PERCENT = 90
DISC_RATIO = 0.22
WHITE = b"\xff\xff\xff"


class PhoneIcon:
    """The phone app's icon, as version 3 drew it: the project's colour shading darker downwards, a white disc in the middle, a PNG made without any image library."""

    def __init__(self, color: str) -> None:
        code = color.lstrip("#")
        self.top = tuple(int(code[i:i + 2], 16) for i in (0, 2, 4))

    def png(self, side: int) -> bytes:
        middle, radius = side / 2, side * DISC_RATIO
        rows = []
        for y, tint in enumerate(self.shades(side)):
            reach = radius ** 2 - (y + 0.5 - middle) ** 2
            remaining, right = (round(middle - reach ** 0.5), round(middle + reach ** 0.5)) if reach > 0 else (side, side)
            rows.append(tint * remaining + WHITE * (right - remaining) + tint * (side - right))
        header = struct.pack(">IIBBBBB", side, len(rows), 8, 2, 0, 0, 0)
        pixels = b"".join(b"\x00" + row for row in rows)
        return b"\x89PNG\r\n\x1a\n" + self.chunk(b"IHDR", header) + self.chunk(b"IDAT", zlib.compress(pixels, 9)) + self.chunk(b"IEND", b"")

    def shades(self, height: int) -> list[bytes]:
        bottom = tuple(max(0, value - DIM_PERCENT) for value in self.top)
        return [bytes(round(item + (b - item) * y / height) for item, b in zip(self.top, bottom)) for y in range(height)]

    @staticmethod
    def chunk(kind: bytes, body: bytes) -> bytes:
        return struct.pack(">I", len(body)) + kind + body + struct.pack(">I", zlib.crc32(kind + body))

import struct
import zlib
from dataclasses import dataclass
from pathlib import Path

from resources.base import Refused

CELL = 256
OPAQUE = 21
REACH_X = 40
REACH_Y = 20
FEET = 14
SEAT_ABOVE, SEAT_BELOW, SEAT_WIDTH = 8, 44, 45
CHANNELS = {4: 2, 6: 4}
FIRM = 0.2


@dataclass(frozen=True)
class Region:
    """The part of a frame that stays still when its character does: the rows and columns of its feet, or of its seat, in a 256 px cell."""
    top: int
    bottom: int
    left: int = 0
    right: int = CELL

    @classmethod
    def of(cls, first: list[int], sits: bool, seat: int, line: int) -> "Region":
        """Where a voice stays still: the rows of its feet when it stands, the rows and columns around its seat when it sits, read off the first frame."""
        if not sits:
            bottom = max(y for y, row in enumerate(first) if row) + 1
            return cls(bottom - FEET, bottom + 2)
        return cls(line - SEAT_ABOVE, line + SEAT_BELOW, max(0, seat - SEAT_WIDTH), CELL)


def silhouettes(path: Path) -> list[list[int]]:
    """The shape of each 256 px frame of an atlas, a row at a time: bit x of a row is set where the pixel at x is opaque."""
    data = path.read_bytes()
    if data[:8] != b"\x89PNG\r\n\x1a\n":
        raise Refused(f"{path.name} is not a PNG")
    chunks, at = {}, 8
    while at < len(data):
        size, kind = struct.unpack(">I4s", data[at:at + 8])
        chunks.setdefault(kind, b"")
        chunks[kind] += data[at + 8:at + 8 + size]
        at += 12 + size
    width, height, depth, color, _, _, interlace = struct.unpack(">IIBBBBB", chunks[b"IHDR"])
    if depth != 8 or color not in CHANNELS or interlace:
        raise Refused(f"{path.name} must be an 8-bit PNG with transparency, not interlaced")
    step = CHANNELS[color]
    raw = zlib.decompress(chunks[b"IDAT"])
    rows, previous, line = [], bytearray(width * step), width * step + 1
    for y in range(height):
        kind, scan = raw[y * line], bytearray(raw[y * line + 1:(y + 1) * line])
        for i in range(len(scan)):
            left = scan[i - step] if i >= step else 0
            up = previous[i]
            corner = previous[i - step] if i >= step else 0
            if kind == 1:
                scan[i] = (scan[i] + left) & 255
            elif kind == 2:
                scan[i] = (scan[i] + up) & 255
            elif kind == 3:
                scan[i] = (scan[i] + (left + up) // 2) & 255
            elif kind == 4:
                guess = left + up - corner
                near = min((abs(guess - left), left), (abs(guess - up), up), (abs(guess - corner), corner))[1]
                scan[i] = (scan[i] + near) & 255
        rows.append(scan)
        previous = scan
    alpha = step - 1
    shapes = []
    for frame in range(width // CELL):
        shapes.append([sum(1 << x for x in range(CELL) if rows[y][((frame * CELL) + x) * step + alpha] >= OPAQUE) for y in range(min(height, CELL))])
    return shapes


def settled(shapes: list[list[int]], region: Region) -> list[tuple[int, int, int]]:
    """For each frame, how far to move it right and down so that its still part lies where the first frame's does, and how many pixels still differ then: the shift that leaves the fewest."""
    window = ((1 << (region.right - region.left)) - 1) << region.left
    reference = shapes[0]
    found = []
    for shape in shapes:
        best = None
        for dy in range(-REACH_Y, REACH_Y + 1):
            for dx in range(-REACH_X, REACH_X + 1):
                miss = 0
                for y in range(region.top, region.bottom):
                    source = shape[y - dy] if 0 <= y - dy < len(shape) else 0
                    moved = (source << dx if dx >= 0 else source >> -dx) & ((1 << CELL) - 1)
                    miss += ((moved ^ reference[y]) & window).bit_count()
                if best is None or (miss, abs(dx) + abs(dy)) < best[0]:
                    best = ((miss, abs(dx) + abs(dy)), dx, dy)
        found.append((best[1], best[2], best[0][0]))
    return found


def anchored(shapes: list[list[int]], region: Region) -> tuple[list[tuple[int, int]], bool]:
    """The shifts that keep the still part of an animation where its first frame has it, and whether they are firm: the still part matches within a fifth of its pixels and no shift ran to the search's limit."""
    area = max(1, sum(row.bit_count() for row in shapes[0][region.top:region.bottom]))
    found = settled(shapes, region)
    firm = all(missed / area <= FIRM and abs(dx) < REACH_X and abs(dy) < REACH_Y for dx, dy, missed in found)
    return [(dx, dy) for dx, dy, _ in found], firm

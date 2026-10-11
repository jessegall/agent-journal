"""The clips every voice plays on the one rig: each is a pose of bones and eyes for a moment in its run.

A clip function takes the Posing, the Stance, the figure (for its eyes, which start each frame open) and where the clip
stands in its run, from 0 up to but not including 1, and poses the bones parent first. Angles are degrees about the world's axes (see rig.Posing).
"""
import math
from dataclasses import dataclass
from typing import Callable

from rig import SIDES

HANG = 82
HOLD_LIFT = 12
HOLD_SWING = 55
HOLD_TWIST = 25
HOLD_ROLL = 20
RAISED_ROLL = 85
LEVEL_ITEMS = {"butler_tray", "butler_tablet", "colleague_mug"}
BUSY_ITEMS = LEVEL_ITEMS | {"squire_shield", "coach_clipboard"}
BLINK_OPENNESS = (1.0, 0.5, 0.06, 0.5)


@dataclass(frozen=True)
class Stance:
    """How a voice stands: the hands holding something that must stay level, and those too busy to wave."""
    level: frozenset = frozenset()
    busy: frozenset = frozenset()

    @classmethod
    def of(cls, figure):
        sides = lambda items: frozenset(hand.removeprefix("hand_") for hand in figure.hands_holding(items))
        return cls(sides(LEVEL_ITEMS), sides(BUSY_ITEMS))

    @property
    def free(self):
        return "l" if "r" in self.busy else "r"


@dataclass(frozen=True)
class Clip:
    name: str
    frames: int
    fps: int
    loops: bool
    pose: Callable


def wave_of(t, turns=1):
    return math.sin(2 * math.pi * turns * t)


def breathe(pose, t, amount=1.0):
    pose.turn("spine", x=1.0 * amount * wave_of(t))
    pose.turn("chest", x=1.5 * amount * wave_of(t - 0.05))
    pose.turn("neck", x=-0.8 * amount * wave_of(t - 0.1))
    pose.turn("head", x=-1.2 * amount * wave_of(t - 0.12))


def trunk(pose, lean=0.0, twist=0.0, nod=0.0, turn=0.0, tilt=0.0):
    """The bones from the hips up to the head, in the order they hang from each other."""
    pose.turn("spine", x=lean * 0.4, z=twist * 0.4)
    pose.turn("chest", x=lean * 0.6, z=twist * 0.6)
    pose.turn("neck", x=nod * 0.3, z=turn * 0.3, y=tilt * 0.3)
    pose.turn("head", x=nod * 0.7, z=turn * 0.7, y=tilt * 0.7)


def hang(pose, side, swing=0.0, bend=10.0):
    """An arm at the robot's side, the forearm bent forward a little."""
    pose.turn(f"upper_arm_{side}", y=SIDES[side] * HANG)
    pose.turn(f"upper_arm_{side}", x=swing)
    pose.turn(f"forearm_{side}", x=-bend)


def hold(pose, side):
    """An arm carrying something level: the upper arm hangs and rolls so the elbow bends toward the front, the forearm points out in front a little above flat, the hand turned part way so what it holds still faces the viewer."""
    sign = SIDES[side]
    pose.turn(f"upper_arm_{side}", y=sign * HANG)
    pose.turn(f"upper_arm_{side}", z=sign * HOLD_ROLL)
    pose.face(f"forearm_{side}", y=-sign * HOLD_LIFT, z=-sign * HOLD_SWING)
    pose.face(f"hand_{side}", z=-sign * HOLD_TWIST)


def arms_at_rest(pose, stance, apart=(), swing=None):
    """Every arm not named in apart: hanging, or carrying when it holds something level."""
    for side in SIDES:
        if side in apart:
            continue
        if side in stance.level:
            hold(pose, side)
            continue
        hang(pose, side, swing=(swing or {}).get(side, 0.0))


def blink_at(t, start, frames):
    """How open the eyes are at t in a clip of this many frames, when a blink starts at `start` (a share of the run); 1 outside it."""
    index = int((t - start) * frames) if t >= start else -1
    return BLINK_OPENNESS[index] if 0 <= index < len(BLINK_OPENNESS) else 1.0


def idle(pose, stance, figure, t):
    breathe(pose, t)
    arms_at_rest(pose, stance)
    figure.shut_eyes(blink_at(t, 0.62, 24))


def blink(pose, stance, figure, t):
    arms_at_rest(pose, stance)
    figure.shut_eyes(blink_at(t, 0.15, 6))


def nod(pose, stance, figure, t):
    dip = max(wave_of(t, 2), 0)
    trunk(pose, lean=4 * dip, nod=26 * dip)
    arms_at_rest(pose, stance)


def shake(pose, stance, figure, t):
    trunk(pose, turn=28 * wave_of(t, 2), tilt=4 * wave_of(t, 2))
    arms_at_rest(pose, stance)


def wave(pose, stance, figure, t):
    side = stance.free
    sign = SIDES[side]
    trunk(pose, twist=-sign * 4, turn=-sign * 8, tilt=-sign * 6)
    arms_at_rest(pose, stance, apart=(side,))
    pose.turn(f"upper_arm_{side}", x=-RAISED_ROLL)
    pose.turn(f"upper_arm_{side}", y=-sign * 10)
    pose.bend(f"forearm_{side}", 45 + 22 * wave_of(t))


def think(pose, stance, figure, t):
    side = stance.free
    sign = SIDES[side]
    trunk(pose, nod=8 + 3 * wave_of(t), turn=-sign * 10 + 3 * wave_of(t), tilt=-sign * 5)
    arms_at_rest(pose, stance, apart=(side,))
    pose.turn(f"upper_arm_{side}", y=sign * HANG)
    pose.turn(f"upper_arm_{side}", x=-40)
    pose.turn(f"forearm_{side}", x=-100)
    pose.turn(f"forearm_{side}", z=-sign * 45)


def celebrate(pose, stance, figure, t):
    jump = max(math.sin(2 * math.pi * 2 * t), 0)
    pose.lift("root", z=0.28 * jump)
    pose.turn("hips", z=6 * wave_of(t, 2))
    trunk(pose, lean=-5, turn=-6 * wave_of(t, 2))
    cheering = tuple(side for side in SIDES if side not in stance.busy)
    arms_at_rest(pose, stance, apart=cheering)
    for side in cheering:
        sign = SIDES[side]
        pose.turn(f"upper_arm_{side}", y=-sign * (62 + 8 * wave_of(t, 2)))
        pose.bend(f"forearm_{side}", 10 + 6 * wave_of(t, 4))
    for side in SIDES:
        pose.turn(f"thigh_{side}", x=-18 * jump)
        pose.turn(f"shin_{side}", x=34 * jump)
        pose.turn(f"foot_{side}", x=-10 * jump)


def sleep(pose, stance, figure, t):
    breath = wave_of(t)
    trunk(pose, lean=8 + 1.5 * breath, nod=22 + 2 * breath, tilt=5)
    arms_at_rest(pose, stance)
    figure.shut_eyes(0.0)


def walk(pose, stance, figure, t):
    phase = 2 * math.pi * t
    pose.lift("root", z=0.05 * math.cos(2 * phase))
    pose.turn("hips", z=5 * math.sin(phase))
    trunk(pose, lean=3, twist=-7 * math.sin(phase), turn=3 * math.sin(phase))
    arms_at_rest(pose, stance, swing={"l": 22 * math.sin(phase), "r": -22 * math.sin(phase)})
    for side, offset in (("l", 0.0), ("r", math.pi)):
        angle = phase + offset
        thigh, knee = -30 * math.sin(angle), 42 * max(math.cos(angle), 0)
        pose.turn(f"thigh_{side}", x=thigh)
        pose.turn(f"shin_{side}", x=knee)
        pose.turn(f"foot_{side}", x=-0.8 * (thigh + knee) + 6)


CLIPS = {clip.name: clip for clip in (
    Clip("idle", 24, 8, True, idle),
    Clip("blink", 6, 12, False, blink),
    Clip("nod", 10, 12, False, nod),
    Clip("shake", 12, 12, False, shake),
    Clip("wave", 12, 12, True, wave),
    Clip("think", 12, 6, True, think),
    Clip("celebrate", 12, 10, True, celebrate),
    Clip("sleep", 18, 6, True, sleep),
    Clip("walk", 12, 12, True, walk),
)}

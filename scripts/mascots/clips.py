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
WAVE_BACK = 40
WAVE_BEND = 25
WAVE_SWING = 10
CHIN_REST = (0.4, -0.92, 2.1)
THINK_ELBOW = (0.6, 0.3, -1.0)
THINK_HAND = (1.0, -0.4, 0.35)
THINK_TIP = 25
SLEEP_TILT = 4
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
    pose.turn(f"upper_arm_{side}", z=sign * WAVE_BACK)
    pose.bend(f"forearm_{side}", WAVE_BEND + WAVE_SWING * wave_of(t))


def think(pose, stance, figure, t):
    side = stance.free
    sign = SIDES[side]
    trunk(pose, nod=8 + 3 * wave_of(t), turn=-sign * 10 + 3 * wave_of(t), tilt=-sign * 5)
    arms_at_rest(pose, stance, apart=(side,))
    x, y, z = CHIN_REST
    pose.reach("arm", side, (sign * x, y, z), bend=THINK_ELBOW)
    across, forward, up = THINK_HAND
    pose.aim(f"hand_{side}", (-sign * across, forward, up))
    pose.turn(f"hand_{side}", x=THINK_TIP)


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
    trunk(pose, lean=4 + 1.5 * breath, nod=8 + 2 * breath, tilt=SIDES[stance.free] * SLEEP_TILT)
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

# These clips share the existing rig and pose vocabulary. A non-looping clip's
# last *rendered* frame must reach its final pose: the renderer samples n / frames,
# not n / (frames - 1). Keep this mapping in the browser port too.
ENTRY_DISTANCE = 4.4
ENTRY_TRAVEL_END = 0.72
ENTRY_TURN_END = 0.94
SEAT_LIFT = 0.20
PULL_GRIP_X = 1.51
PULL_GRIP_Y = -0.0233463035019455
PULL_GRIP_Z = 3.17
PULL_WRIST_X = 1.25
PULL_WRIST_Z = 2.91


def ease(t):
    """An endpoint-flat 0..1 easing, unlike wave_of (which is signed)."""
    t = min(max(t, 0.0), 1.0)
    return t * t * (3.0 - 2.0 * t)


def once_time(t, frames):
    return min(max(t * frames / (frames - 1), 0.0), 1.0)


def supports_clip(name, stance):
    """Pull-ups need BOTH hands free. The caller can select idle instead.

    The clip itself also guards this, because the sheet renderer visits every
    voice/clip pair. It must not swing a tray, mug, shield or clipboard overhead.
    """
    return name != "pull_ups" or not (stance.busy or stance.level)


def sit_on_edge(pose, stance, figure, t):
    """A seated idle, not a stand-to-sit transition; pin the pelvis to the edge."""
    sway = wave_of(t)
    pose.lift("root", z=SEAT_LIFT)
    trunk(pose, lean=1.5 * sway, nod=-1.5 * sway, turn=3.0 * wave_of(t, 1))
    arms_at_rest(pose, stance)
    for side, sign in SIDES.items():
        pose.turn(f"thigh_{side}", x=-88.0)
        knee = 88.0 + sign * 9.0 * sway
        pose.bend(f"shin_{side}", knee)
        pose.turn(f"foot_{side}", x=-sign * 5.0 * sway)
    figure.shut_eyes(blink_at(t, 0.625, 24))


def stride_foot(phase, stride, duty, clearance):
    """Foot offset and lift; the full stride cancels root travel during stance.

    Root travel advances `stride` per full cycle. The stance offset advances by
    the same amount in the opposite direction; flight returns it to the front.
    The entrance's final braking blend then brings both feet back to rest.
    """
    phase %= 1.0
    span = stride * duty
    if phase < duty:
        return -span / 2.0 + stride * phase, 0.0
    flight = (phase - duty) / (1.0 - duty)
    return span / 2.0 - span * ease(flight), clearance * math.sin(math.pi * flight)


def step_leg(pose, side, forward, lift, root_height, toe=0.0):
    """Solve the sagittal stride about the rig's actual X knee hinge.

    The bones already splay in X in their bind pose. A generic straight-chain
    reach near full extension would erase that splay and tilt the knee hinge.
    Read their vertical reaches instead; X rotations preserve the bind splay.
    """
    bones = pose.arm.data.bones
    thigh = bones[f"thigh_{side}"].head_local
    shin = bones[f"shin_{side}"].head_local
    foot = bones[f"foot_{side}"].head_local
    upper, lower = thigh.z - shin.z, shin.z - foot.z
    down = upper + lower + root_height - lift
    cosine = (forward * forward + down * down - upper * upper - lower * lower) / (2.0 * upper * lower)
    # Do not clamp an unreachable request or a joint angle. The geometry of the
    # authored stride keeps this within reach; only roundoff at rest is tolerated.
    if not -1.0 - 1e-10 <= cosine <= 1.0 + 1e-10:
        raise ValueError(f"{side} stride target is outside the unchanged leg reach")
    knee = math.acos(round(cosine, 10))
    hip = math.atan2(forward, down) - math.atan2(lower * math.sin(knee), upper + lower * math.cos(knee))
    pose.turn(f"thigh_{side}", x=math.degrees(hip))
    pose.bend(f"shin_{side}", math.degrees(knee))
    pose.face(f"foot_{side}", x=toe)


def entering(pose, stance, figure, t, *, frames, running=False):
    u = once_time(t, frames)
    q = min(u / ENTRY_TRAVEL_END, 1.0)
    progress = ease(q)
    distance = ENTRY_DISTANCE * (1.0 - progress)
    motion = 1.0 - ease((q - 0.76) / 0.24)
    stride, duty, clearance = (1.84, 0.38, 0.20) if running else (1.36, 0.60, 0.16)
    cycle = ENTRY_DISTANCE * progress / stride
    half_phase = cycle % 0.5
    flight = max(0.0, math.sin(math.pi * (half_phase - duty) / (0.5 - duty))) if running and half_phase > duty else 0.0
    root_height = motion * (-(0.075 if running else 0.11) + (0.055 * flight if running else 0.0))
    pose.lift("root", y=distance, z=root_height)
    trunk(pose, lean=(10.0 if running else 3.0) * motion,
          nod=(-6.0 if running else -2.0) * motion)
    # Busy non-level hands also remain quiet, not just spill-prone level items.
    swing = (24.0 if running else 14.0) * wave_of(cycle) * motion
    # The supplied legacy BUSY_ITEMS omits the Squire's quill. Keep that held
    # hand quiet here without changing the stance or the original nine clips.
    carried = stance.busy | frozenset(hand.removeprefix("hand_") for hand in figure.hands_holding({"squire_quill"}))
    jogging = tuple(side for side in SIDES if running and side not in (carried | stance.level))
    arms_at_rest(pose, stance, apart=jogging,
                 swing={side: 0.0 if side in carried else sign * swing for side, sign in SIDES.items()})
    for side in jogging:
        hang(pose, side, swing=SIDES[side] * swing, bend=10.0 + 40.0 * motion)
    if motion > 0.0:
        for side, offset in (("l", 0.0), ("r", 0.5)):
            step, lift = stride_foot(cycle + offset, stride, duty, clearance)
            phase = (cycle + offset) % 1.0
            flight_phase = (phase - duty) / (1.0 - duty) if phase >= duty else 0.0
            toe = (14.0 if running else 11.0) * math.sin(math.pi * flight_phase) * motion
            step_leg(pose, side, motion * step, motion * lift, root_height, toe)
    # Turn in place only after the travel has finished. Revolve carries all bones
    # together; no child is stranded by moving a cached parent after posing it.
    facing = 90.0 * (1.0 - ease((u - ENTRY_TRAVEL_END) / (ENTRY_TURN_END - ENTRY_TRAVEL_END)))
    pose.revolve(facing)


def walk_in(pose, stance, figure, t):
    """Walk from the left of the front camera, stop, then turn toward the viewer."""
    entering(pose, stance, figure, t, frames=40)


def run_in(pose, stance, figure, t):
    """A quicker entrance with flight phases, braking and a held front-facing end."""
    entering(pose, stance, figure, t, frames=28, running=True)


def pull_ups(pose, stance, figure, t):
    """Short-range pull-ups on TWO separated handles outside the oversized head.

    The wrist anchors stay fixed; a straight bar between them would intersect
    the head, so callers must provide side handles, not a bar through the face.
    Hands carrying items use the documented idle fallback without dropping them.
    """
    if not supports_clip("pull_ups", stance):
        idle(pose, stance, figure, t)
        return
    pull = 0.5 - 0.5 * math.cos(2.0 * math.pi * t)
    pose.lift("root", z=0.20 + 0.38 * pull)
    trunk(pose, nod=-3.0 * pull)
    for side, sign in SIDES.items():
        bones = pose.arm.data.bones
        shoulder = pose.standing(f"upper_arm_{side}").to_translation()
        upper = abs(bones[f"forearm_{side}"].head_local.x - bones[f"upper_arm_{side}"].head_local.x)
        lower = abs(bones[f"hand_{side}"].head_local.x - bones[f"forearm_{side}"].head_local.x)
        across, up = PULL_WRIST_X - sign * shoulder.x, PULL_WRIST_Z - shoulder.z
        bend = math.acos((across * across + up * up - upper * upper - lower * lower) / (2.0 * upper * lower))
        raise_by = math.atan2(up, across) - math.atan2(lower * math.sin(bend), upper + lower * math.cos(bend))
        # Roll the existing arm hinge into the raising plane; no new IK rig.
        pose.turn(f"upper_arm_{side}", x=-90.0)
        pose.turn(f"upper_arm_{side}", y=-sign * math.degrees(raise_by))
        pose.bend(f"forearm_{side}", math.degrees(bend))
        pose.face(f"hand_{side}", x=-90.0, y=-sign * 45.0)
        pose.turn(f"thigh_{side}", x=-8.0)
        pose.bend(f"shin_{side}", 18.0)
        pose.turn(f"foot_{side}", x=-10.0)


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
    Clip("sit_on_edge", 24, 8, True, sit_on_edge),
    Clip("walk_in", 40, 12, False, walk_in),
    Clip("run_in", 28, 12, False, run_in),
    Clip("pull_ups", 24, 10, True, pull_ups),
)}

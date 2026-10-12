from dataclasses import dataclass


@dataclass(frozen=True)
class Lens:
    name: str
    critic: str
    looks: str


LENSES = {lens.name: lens for lens in (
    Lens("first-time", "Rosa Firstlook", "a person who has never seen the app: what is unclear, where they get lost, what they would tap first"),
    Lens("access", "Ada Ramp", "accessibility: contrast, tap target sizes, focus order, what a screen reader says, reduced motion"),
    Lens("native", "Jony Swipe", "native feel on a phone: gestures, sheets, the keyboard, motion and spacing as a polished iOS app would do them"),
    Lens("words", "Strunk Plain", "the words on screen: plain, literal, short, saying what happens, never the app's own machinery"),
    Lens("edges", "Murphy Edge", "edge cases: offline, long text, empty states, many items, slow answers, a failed action"),
)}
DEFAULT = ("first-time", "native", "words")

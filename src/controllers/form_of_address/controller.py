import json
import tempfile
from pathlib import Path

from controllers.base import Controller
from controllers.features import settings_of
from declaring.registries import SETTINGS_CHANGED
from controllers.marks import action
from engine import runtime
from controllers.form_of_address.anchoring import Region, anchored, silhouettes
from controllers.form_of_address.animations import FRAME, OFFSETS, Animation, Schedule, Tuning, offsets_document, offsets_name, shipped_animations, tuning_of, unpacked, voice_of
from resources.form_of_address import Profile
from resources.voices import PLAIN_WORDS, BUTLER, NAMINGS, SCIENTISTS, SHIPPED, Calling, Voice, filled
from resources.base import SYSTEM, Refused
from resources.pictures import dimensions

COPY = " (my copy)"
SHAPE = ("brief", "calling", "sample", "introduction", "humour", "naming", "address", "art", "emoji")


class Profiles(Controller):
    resource = Profile

    def user_first_name(self) -> str:
        return str(settings_of(self.record, "form_of_address").first_name).strip() or (runtime.git_user(self.record.root).split() or [""])[0]

    def user_title(self) -> str:
        return str(settings_of(self.record, "form_of_address").title).strip()

    def user_called(self) -> str:
        return Calling.TITLE_AND_NAME.called(self.user_title(), self.user_first_name())

    def profile_in_use(self) -> int:
        chosen = settings_of(self.record, "form_of_address").profile
        return int(chosen) if str(chosen).isdigit() else 0

    def voice(self, n: int) -> Voice:
        r = self.rows.peek(n)
        return Voice(title=r.title, text=r.brief, calling=Calling(r.calling), sample=r.sample, introduction=r.introduction, humour=r.humour, naming=r.naming,
                     agent_name=r.agent_name, address=r.address, art=r.art, emoji=r.emoji)

    def how_to_talk(self) -> str:
        """The line that tells an agent how the user wants it to talk, in their own words."""
        voice = self.standing()
        instruction = voice.calling.instruction(voice.calling.called(self.user_title(), self.user_first_name(), voice.address))
        text = " ".join(part for part in (voice.text, instruction, voice.humour, voice.reacts(), PLAIN_WORDS) if part)
        return f"HOW THE USER WANTS YOU TO TALK, in their own words: {text}"

    def standing(self) -> Voice:
        try:
            return self.voice(self.profile_in_use())
        except (ValueError, Refused):
            return BUTLER

    @action
    def create(self, title: str, abstract: str = "", brief: str = "", calling: str = Calling.TITLE_AND_NAME.value, sample: str = "", introduction: str = "", humour: str = "",
               naming: str = SCIENTISTS.text, agent_name: str = Voice.agent_name, **data):
        return super().create(title, abstract, brief, calling=self._calling(calling), sample=sample, introduction=introduction, humour=humour, naming=naming,
                              agent_name=agent_name, **data)

    @action
    def update(self, n: int, title: str | None = None, abstract: str | None = None, brief: str | None = None, outcome: str | None = None,
               calling: str | None = None, **data):
        if calling is not None:
            data["calling"] = self._calling(calling)
        row = super().update(n, title, abstract, brief, outcome, **data)
        if n == self.profile_in_use():
            self._tell()
        return row

    @action
    def delete(self, n: int, why: str = ""):
        if n == self.profile_in_use():
            self._refuse(f"profile {n} is in use: choose another profile first")
        return super().delete(n, why)

    @action
    def duplicate(self, n: int):
        row = self.load(n)
        return self.create(f"{row.title}{COPY}", brief=row.brief, calling=row.calling, sample=self._sample(row), introduction=row.introduction, humour=row.humour, naming=row.naming,
                           agent_name=row.agent_name, address=row.address, art=row.art, emoji=row.emoji)

    @action
    def animations(self) -> dict:
        """Every voice's animations by profile number, found by file name: the sheets it ships with and the ones dropped on it."""
        return {row.n: self._animations_of(row) for row in (self.peek(row.n) for row in self.rows.summaries() if not row.deleted)}

    @action
    def schedules(self) -> dict:
        """When each voice's mascot plays what, by profile number, with the defaults filled in."""
        return {row.n: Schedule.from_payload(row.animation_schedule, {a["path"] for a in self._animations_of(row)}).view()
                for row in (self.peek(row.n) for row in self.rows.summaries() if not row.deleted)}

    @action
    def schedule(self, n: int, plan: dict | None = None):
        """Saves how long a voice's mascot waits between blinks and between its other idle animations, and the weight of each idle animation; with no plan it goes back to the defaults."""
        row = self.load(n)
        known = {animation["path"] for animation in self._animations_of(row)}
        return self.update(n, animation_schedule=Schedule.from_payload(plan, known).view() if plan else {})

    def _animations_of(self, row) -> list[dict]:
        from commands.dispatch import WEB
        shipped = shipped_animations(WEB / "voices", row.art)
        dropped = [a for a in (Animation.of(name, voice_of(row.art)) for name in row.files) if a]
        return [{**animation.view(), "edit": tuning_of(self._offsets_of(row, animation) or {}), "edited": offsets_name(animation.file) in row.files}
                for animation in [*shipped, *dropped]]

    def _offsets_of(self, row, animation: Animation) -> dict | None:
        """The offsets file of an animation: the one saved with the voice, else the one it was delivered with."""
        from commands.dispatch import WEB
        name = offsets_name(animation.file)
        kept = self.folder(row.n) / name if name in row.files else None
        delivered = WEB / "voices" / Path(animation.file).parent / name if animation.shipped else None
        found = next((path for path in (kept, delivered) if path and path.is_file()), None)
        return json.loads(found.read_text()) if found else None

    def _animation_at(self, row, path: str) -> Animation:
        found = next((a for a in (Animation.of(item["file"], voice_of(row.art), item["shipped"]) for item in self._animations_of(row)) if a and a.file == path), None)
        if found is None:
            raise Refused(f"{row.title} has no animation {path}")
        return found

    def _sheet_of(self, row, animation: Animation) -> Path:
        from commands.dispatch import WEB
        return WEB / "voices" / animation.file if animation.shipped else self.folder(row.n) / animation.file

    @action
    def anchor(self, n: int, path: str, sits: bool = False, seat: int = 0, line: int = 0):
        """The offsets that keep the feet of a voice that stands, or the seat of one that sits, where the first frame of an animation has them, from the pixels of its sheet; nothing is saved until the frames are."""
        row = self.load(n)
        shapes = silhouettes(self._sheet_of(row, self._animation_at(row, path)))
        shifts, firm = anchored(shapes, Region.of(shapes[0], bool(sits), int(seat), int(line)))
        return {"frames": [{"x": x, "y": y} for x, y in shifts], "firm": firm}

    @action
    def tune(self, n: int, path: str, edit: dict | None = None):
        """Saves how one animation of a voice is shown as its offsets file, offset_x and offset_y per frame and the optional frame_ms and duration_ms, beside the voice; with no edit it goes back to the delivered file."""
        from commands.dispatch import WEB
        row = self.load(n)
        animation = self._animation_at(row, path)
        name = offsets_name(animation.file)
        if not edit:
            return self.detach(n, name, "back to the delivered offsets") if name in row.files else row
        size = dimensions(self._sheet_of(row, animation)) or (FRAME, FRAME)
        document = offsets_document(animation, Tuning.from_payload(edit), self._offsets_of(row, animation), size, voice_of(row.art))
        with tempfile.TemporaryDirectory() as folder:
            written = Path(folder) / name
            written.write_text(json.dumps(document, indent=2) + "\n")
            return self.attach(n, str(written))

    @action
    def attach(self, n: int, path: str, description: str = ""):
        source = Path(path)
        if source.suffix.lower() == ".zip":
            with tempfile.TemporaryDirectory() as folder:
                for sheet in unpacked(source, Path(folder)):
                    super().attach(n, str(sheet), description)
            return self.load(n)
        if source.name.endswith(OFFSETS):
            if not isinstance(json.loads(source.read_text()).get("frames"), list):
                raise Refused(f"{source.name} is not an offsets file: it lists its frames with offset_x and offset_y")
            return super().attach(n, path, description)
        if not Animation.of(source.name, voice_of(self.load(n).art)):
            raise Refused(f"{source.name} is not an animation: name it <kind>_<name>.png, such as idle_wave.png, or drop a ZIP of them")
        return super().attach(n, path, description)

    @action
    def callings(self) -> dict:
        return {call.value: self._called(call) for call in Calling if call is not Calling.OWN}

    @action
    def namings(self) -> list[dict]:
        return [{"label": naming.label, "text": naming.text} for naming in NAMINGS]

    @action
    def samples(self) -> dict:
        return {r.n: self._sample(r) for r in (self.peek(row.n) for row in self.rows.summaries() if not row.deleted)}

    def _called(self, calling: Calling, address: str = "") -> str:
        return calling.called(self.user_title(), self.user_first_name(), address)

    def _sample(self, row) -> str:
        return filled(row.sample, self._called(Calling(row.calling), row.address))

    def _calling(self, given: str) -> str:
        if given not in {call.value for call in Calling}:
            raise Refused(f"a profile calls you by one of {', '.join(call.value for call in Calling)}, not {given!r}")
        return given

    def _tell(self) -> None:
        changed = SETTINGS_CHANGED.keyed().get("form_of_address")
        if changed:
            changed(self.record, self.actor)


def ship(record) -> list[str]:
    profiles = Profiles(record, actor=SYSTEM)
    held = {r.title: r for r in (profiles.load(row.n) for row in profiles.rows.summaries() if not row.deleted) if r.system}
    made = []
    for voice in SHIPPED:
        shape = {"brief": voice.text, "calling": voice.calling.value, "sample": voice.sample, "introduction": voice.introduction, "humour": voice.humour, "naming": voice.naming, "address": voice.address, "art": voice.art, "emoji": voice.emoji}
        if voice.title not in held:
            profiles.create(voice.title, **shape, agent_name=voice.agent_name, system=True)
        elif {name: getattr(held[voice.title], name) for name in SHAPE} != shape:
            for name, value in shape.items():
                setattr(held[voice.title], name, value)
            profiles.save(held[voice.title], "updated")
        else:
            continue
        made.append(voice.title)
    return made

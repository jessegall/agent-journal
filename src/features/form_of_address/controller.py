import tempfile
from pathlib import Path

import controllers.types as types_module
import resources.types as resources_module
from controllers.base import Controller
from controllers.marks import action
from features.form_of_address.animations import Animation, shipped_animations, unpacked, voice_of
from features.form_of_address.names import first_name, in_use, title
from features.form_of_address.resource import Profile
from features.form_of_address.voices import BUTLER, NAMINGS, SCIENTISTS, SHIPPED, Calling, Voice, filled
from resources.base import SYSTEM, Refused

COPY = " (my copy)"
SHAPE = ("brief", "calling", "sample", "introduction", "humour", "naming", "address", "art")


class Profiles(Controller):
    resource = Profile

    def voice(self, n: int) -> Voice:
        r = self.rows.peek(n)
        return Voice(title=r.title, text=r.brief, calling=Calling(r.calling), sample=r.sample, introduction=r.introduction, humour=r.humour, naming=r.naming,
                     agent_name=r.agent_name, address=r.address, art=r.art)

    def standing(self) -> Voice:
        try:
            return self.voice(in_use(self.record))
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
        if n == in_use(self.record):
            self._tell()
        return row

    @action
    def delete(self, n: int, why: str = ""):
        if n == in_use(self.record):
            self._refuse(f"profile {n} is in use: choose another profile first")
        return super().delete(n, why)

    @action
    def duplicate(self, n: int):
        row = self.load(n)
        return self.create(f"{row.title}{COPY}", brief=row.brief, calling=row.calling, sample=self._sample(row), introduction=row.introduction, humour=row.humour, naming=row.naming,
                           agent_name=row.agent_name, address=row.address, art=row.art)

    @action
    def animations(self) -> dict:
        """Every voice's animations by profile number, found by file name: the sheets it ships with and the ones dropped on it."""
        from commands.dispatch import WEB
        found = {}
        for row in (self.load(row["n"]) for row in self.rows.summaries() if not row["deleted"]):
            shipped = [(a, a.file) for a in shipped_animations(WEB / "voices", row.art)]
            dropped = [(a, a.file) for a in (Animation.of(name, voice_of(row.art)) for name in row.files) if a]
            found[row.n] = [animation.view(path) for animation, path in [*shipped, *dropped]]
        return found

    @action
    def attach(self, n: int, path: str, description: str = ""):
        source = Path(path)
        if source.suffix.lower() == ".zip":
            with tempfile.TemporaryDirectory() as folder:
                for sheet in unpacked(source, Path(folder)):
                    super().attach(n, str(sheet), description)
            return self.load(n)
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
        return {r.n: self._sample(r) for r in (self.load(row["n"]) for row in self.rows.summaries() if not row["deleted"])}

    def _called(self, calling: Calling, address: str = "") -> str:
        return calling.called(title(self.record), first_name(self.record), address)

    def _sample(self, row) -> str:
        return filled(row.sample, self._called(Calling(row.calling), row.address))

    def _calling(self, given: str) -> str:
        if given not in {call.value for call in Calling}:
            raise Refused(f"a profile calls you by one of {', '.join(call.value for call in Calling)}, not {given!r}")
        return given

    def _tell(self) -> None:
        from features import running
        from features.form_of_address.feature import FormOfAddress
        running(FormOfAddress).settings_changed(self.record, self.actor)


def ship(record) -> list[str]:
    profiles = Profiles(record, actor=SYSTEM)
    held = {r.title: r for r in (profiles.load(row["n"]) for row in profiles.rows.summaries() if not row["deleted"]) if r.system}
    made = []
    for voice in SHIPPED:
        shape = {"brief": voice.text, "calling": voice.calling.value, "sample": voice.sample, "introduction": voice.introduction, "humour": voice.humour, "naming": voice.naming, "address": voice.address, "art": voice.art}
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


resources_module.register(Profile)
types_module.register(Profiles)

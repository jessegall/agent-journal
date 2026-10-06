import controllers.types as types_module
import resources.types as resources_module
from controllers.base import Controller
from controllers.marks import action
from features.form_of_address.names import first_name, in_use, title
from features.form_of_address.resource import Profile
from features.form_of_address.voices import SHIPPED, Calling, Voice, filled
from resources.base import SYSTEM, Refused

COPY = " (my copy)"
SHAPE = ("brief", "calling", "sample")


class Profiles(Controller):
    resource = Profile

    def voice(self, n: int) -> Voice:
        r = self.load(n)
        return Voice(title=r.title, text=r.brief, calling=Calling(r.calling), sample=r.sample)

    @action
    def create(self, title: str, abstract: str = "", brief: str = "", calling: str = Calling.TITLE_AND_NAME.value, sample: str = "", **data):
        return super().create(title, abstract, brief, calling=self._calling(calling), sample=sample, **data)

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
        return self.create(f"{row.title}{COPY}", brief=row.brief, calling=row.calling, sample=self._sample(row))

    @action
    def callings(self) -> dict:
        return {call.value: self._called(call) for call in Calling}

    @action
    def samples(self) -> dict:
        return {r.n: self._sample(r) for r in (self.load(row["n"]) for row in self.rows.summaries() if not row["deleted"])}

    def _called(self, calling: Calling) -> str:
        return calling.called(title(self.record), first_name(self.record))

    def _sample(self, row) -> str:
        return filled(row.sample, self._called(Calling(row.calling)))

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
        shape = {"brief": voice.text, "calling": voice.calling.value, "sample": voice.sample}
        if voice.title not in held:
            profiles.create(voice.title, brief=voice.text, calling=voice.calling.value, sample=voice.sample, system=True)
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

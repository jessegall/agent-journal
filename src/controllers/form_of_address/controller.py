from pathlib import Path

from controllers.base import Controller
from controllers.features import settings_of
from declaring.registries import SETTINGS_CHANGED
from controllers.marks import action
from engine import runtime
from resources.form_of_address import Profile
from resources.voices import PLAIN_WORDS, BUTLER, NAMINGS, SCIENTISTS, SHIPPED, Calling, Voice, filled
from resources.base import SYSTEM, Refused

COPY = " (my copy)"
SHAPE = ("brief", "calling", "sample", "introduction", "humour", "naming", "address", "voice", "emoji")


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
                     agent_name=r.agent_name, address=r.address, voice=r.voice, emoji=r.emoji)

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
                           agent_name=row.agent_name, address=row.address, voice=row.voice, emoji=row.emoji)

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
        shape = {"brief": voice.text, "calling": voice.calling.value, "sample": voice.sample, "introduction": voice.introduction, "humour": voice.humour, "naming": voice.naming, "address": voice.address, "voice": voice.voice, "emoji": voice.emoji}
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

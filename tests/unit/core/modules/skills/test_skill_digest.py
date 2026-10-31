import hashlib

from core.base.skill.skill_digest import SkillDigest


def test_the_digest_is_the_first_twelve_characters_of_the_sha1_of_the_text():
    text = "Write a note for every decision."
    assert SkillDigest.of(text) == hashlib.sha1(text.encode()).hexdigest()[:12]


def test_the_digest_changes_with_the_text():
    assert SkillDigest.of("one") != SkillDigest.of("two")

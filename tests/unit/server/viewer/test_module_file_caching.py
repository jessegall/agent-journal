from server.viewer.module_file_caching import IMMUTABLE, REVALIDATE, ModuleFileCaching


def test_a_name_with_its_hash_or_a_version_in_its_address_is_kept_forever():
    assert ModuleFileCaching.built("/viewer/assets/index-BGl3q02T.js", b"a").cache_control == IMMUTABLE
    assert ModuleFileCaching.built("/modules/messages/chat.js?v=3f9a", b"a").cache_control == IMMUTABLE


def test_any_other_file_is_checked_again_and_a_repeat_with_its_tag_is_unchanged():
    caching = ModuleFileCaching.built("/viewer/", b"<html>")
    assert caching.cache_control == REVALIDATE
    assert caching.is_unchanged(caching.etag)
    assert not caching.is_unchanged('"other"') and not caching.is_unchanged(None)
    assert not ModuleFileCaching.built("/viewer/", b"<html>changed").is_unchanged(caching.etag)


def test_a_window_entry_named_by_words_is_checked_again_after_an_update():
    assert ModuleFileCaching.built("/modules/coding/agent-settings.js", b"a").cache_control == REVALIDATE
    assert ModuleFileCaching.built("/modules/coding/work-mode.js", b"a").cache_control == REVALIDATE

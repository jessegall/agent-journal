from core.base.viewer.window_place import WindowPlace


def test_existing_pane_and_page_place_keeps_its_value():
    assert WindowPlace.EITHER.value == "pane_or_page"
    assert WindowPlace.EITHER is WindowPlace.EITHER

from core.base.viewer.window_place import WindowPlace


def test_existing_pane_and_page_place_keeps_its_value():
    assert WindowPlace.ANYWHERE.value == "pane_or_page"
    assert WindowPlace.ANYWHERE is WindowPlace.PANE_OR_PAGE

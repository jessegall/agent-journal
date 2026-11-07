import pytest

from datetime import timedelta

from tests.stories.core.modules.documents.docs import doc_story


def test_each_person_edit_is_a_separate_revision(new_story):
    story = doc_story(new_story)
    story.advance(timedelta(minutes=10))
    story.run('doc edit 1 --body "## Totals\\nin cents"', actor=story.user)
    story.expect_ordered_lines("doc revisions 1", "1", "first version", actor=story.user)
    story.expect_text("doc revision 1 2", "in cents", actor=story.user)


def test_an_edit_after_the_window_opens_the_next_revision_with_what_changed(old_document):
    story = old_document
    story.run('doc edit 1 --body "Intro line\\n## Totals\\n- in cents\\n- rounded once\\n## Shipping\\nPriced by zone\\n## Returns\\nWithin 30 days"', actor=story.user)
    story.expect_text("doc revisions 1", "rewrote Shipping", "added Returns", actor=story.user)


def test_a_saved_revision_stays_when_the_person_edits_again(new_story):
    story = doc_story(new_story)
    story.run('doc edit 1 --body "## Totals\\nin cents"', actor=story.user)
    story.expect_text("doc revision 1 2", "doc 1, revision 2 of 2: Cart rules", actor=story.user)


def test_a_revision_out_of_range_is_refused_with_the_range(new_story):
    story = doc_story(new_story)
    story.expect_refusal("doc revision 1 5", "doc 1 has revisions 1 to 1", actor=story.user)


def test_an_edit_with_the_same_text_writes_no_revision(old_document):
    story = old_document
    story.run('doc edit 1 --body "Intro line\\n## Totals\\n- in cents\\n- rounded once\\n## Shipping\\nPriced by weight"', actor=story.user)
    story.expect_absent("doc revisions 1", "2", actor=story.user)


@pytest.fixture
def old_document(new_story):
    story = doc_story(new_story)
    story.advance(timedelta(minutes=31))
    return story

<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Fixtures;

use Domain\Documents\Tests\TestCase;
use Tests\Support\RefreshHookDatabase;

/**
 * Documents written through the journal: each revision keeps its own author and body, an older one stays addressable,
 * and a draft's body survives until its editor closes it.
 */
final class DocumentFixturesTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_each_revision_keeps_its_author_and_body_and_an_older_one_stays_addressable(): void
    {
        $documents = $this->journal->owner()->agent('Ada')->fixtures(DocumentFixtures::class)
            ->publishedDocument('Design', author: 'Owner', body: 'First words.')
            ->revision('Design', author: 'Ada', body: 'Second words.');

        $documents->withDocument('Design', fn (TestDocument $document) => $document
            ->assertRevision(
                1,
                author: 'Owner',
                body: 'First words.',
            )->assertRevision(2, author: 'Ada', body: 'Second words.'))
            ->assertClosed('Design', editor: 'Ada', number: 2);
    }

    public function test_a_draft_keeps_its_body_until_its_editor_closes_it(): void
    {
        $documents = $this->journal->owner()->fixtures(DocumentFixtures::class)
            ->publishedDocument('Design', author: 'Owner', body: 'First words.')
            ->draft('Design', editor: 'Owner', body: 'Unsaved words.');

        $documents->withDocument('Design', fn (TestDocument $document) => $document
            ->assertDraft(editor: 'Owner', body: 'Unsaved words.')->assertRevision(
                1,
                author: 'Owner',
                body: 'First words.',
            ));
    }

    public function test_an_empty_document_has_no_revision_and_is_its_authors(): void
    {
        $document = $this->journal->owner()->agent('Ada')->fixtures(DocumentFixtures::class)
            ->emptyDocument('Notes', author: 'Ada')
            ->documentCalled('Notes');

        $this->assertSame(
            [$this->journal->agentCalled('Ada')->id, null],
            [$document->creator_id, $document->current_revision_id],
        );
    }

    public function test_the_revision_of_a_number_is_that_revision_of_the_document(): void
    {
        $documents = $this->journal->owner()->fixtures(DocumentFixtures::class)
            ->publishedDocument('Design', author: 'Owner', body: 'First words.')
            ->revision('Design', author: 'Owner', body: 'Second words.');

        $revision = $documents->revisionOf('Design', 2);

        $this->assertSame(
            [$documents->documentCalled('Design')->id, 'Second words.'],
            [$revision->document_id, $revision->body],
        );
    }

    public function test_an_editors_open_draft_is_found_by_the_documents_name(): void
    {
        $documents = $this->journal->owner()->fixtures(DocumentFixtures::class)
            ->publishedDocument('Design', author: 'Owner', body: 'First words.')
            ->draft('Design', editor: 'Owner', body: 'Unsaved words.');

        $this->journal->assertResult('Unsaved words.', $documents->draftOf('Design', 'Owner')->body);
    }
}

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

        $documents->assertRevision('Design', 1, author: 'Owner', body: 'First words.')
            ->assertRevision('Design', 2, author: 'Ada', body: 'Second words.')
            ->assertClosed('Design', editor: 'Ada', number: 2);
    }

    public function test_a_draft_keeps_its_body_until_its_editor_closes_it(): void
    {
        $documents = $this->journal->owner()->fixtures(DocumentFixtures::class)
            ->publishedDocument('Design', author: 'Owner', body: 'First words.')
            ->draft('Design', editor: 'Owner', body: 'Unsaved words.');

        $documents->assertDraft('Design', editor: 'Owner', body: 'Unsaved words.')
            ->assertRevision('Design', 1, author: 'Owner', body: 'First words.');
    }
}

<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Fixtures;

use PHPUnit\Framework\Assert;
use Tests\Support\Seeding\TestJournal;

/**
 * A document the test named, asserted in its own scope: who wrote each revision and what an editor's draft holds.
 */
final readonly class TestDocument
{
    public function __construct(
        private DocumentFixtures $documents,
        private TestJournal $journal,
        private string $name,
    ) {}

    /**
     * The revision of this number was written by the named author and holds this body.
     */
    public function assertRevision(int $number, string $author, string $body): self
    {
        $revision = $this->documents->revisionOf($this->name, $number);
        $writer = $this->journal->actorCalled($author);

        Assert::assertSame(
            [$writer->type, $writer->id, $body],
            [$revision->author_type, $revision->author_id, $revision->body],
            "Revision {$number} of {$this->name} was written otherwise.",
        );

        return $this;
    }

    /**
     * The editor keeps an open draft of the document with this body.
     */
    public function assertDraft(string $editor, string $body): self
    {
        Assert::assertSame(
            $body,
            $this->documents->draftOf($this->name, $editor)->body,
            "{$editor}'s draft of {$this->name} holds another body.",
        );

        return $this;
    }
}

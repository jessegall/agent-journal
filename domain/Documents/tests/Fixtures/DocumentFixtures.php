<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Fixtures;

use Closure;
use Domain\Documents\Commands\CloseDocument\CloseDocumentCommand;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Commands\OpenDocument\OpenDocumentCommand;
use Domain\Documents\Commands\ReplaceDocumentBody\ReplaceDocumentBodyCommand;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\DocumentDraft;
use Domain\Documents\Models\DocumentRevision;
use Domain\Documents\Values\DraftTarget;
use PHPUnit\Framework\Assert;
use Tests\Support\Seeding\FixtureAliases;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\TestProjects;

/**
 * Documents kept under the names a test gives them, written by named users and agents through the Documents
 * commands: a published document, a new revision of it, and a draft an editor keeps open.
 */
final class DocumentFixtures
{
    private const string ABSTRACT = 'What the document holds.';

    private readonly FixtureAliases $aliases;

    public function __construct(private readonly TestJournal $journal)
    {
        $this->aliases = new FixtureAliases('DocumentFixtures');
    }

    /**
     * A document with no revision yet, as its author's first step makes one.
     */
    public function emptyDocument(string $name, string $author): self
    {
        $this->aliases->claim($name);
        $maker = $this->journal->userOrAgentCalled($author);
        $this->aliases->remember($name, Document::create($maker, TestProjects::ownerOf($maker)));

        return $this;
    }

    public function publishedDocument(
        string $name,
        string $author,
        string $body,
        string|null $title = null,
        string $abstract = self::ABSTRACT,
    ): self {
        $this->aliases->claim($name);
        $owner = TestProjects::ownerOf($this->journal->userOrAgentCalled($author))->key();
        $created = $this->journal->runAs($author, new CreateDocumentCommand($title ?? $name, $abstract, $body, $owner));
        $this->aliases->rememberResult($name, $created->id, Document::class);

        return $this;
    }

    /**
     * The author opens the document, gives it this body and closes it: its next revision, title and abstract kept.
     */
    public function revision(string $name, string $author, string $body): self
    {
        $this->draft($name, $author, $body);
        $this->journal->runAs($author, new CloseDocumentCommand($this->draftTarget($name, $author)));

        return $this;
    }

    /**
     * The editor opens the document and gives the open draft this body.
     */
    public function draft(string $name, string $editor, string $body): self
    {
        $number = (string) $this->documentCalled($name)->number;
        $opened = $this->journal->runAs($editor, new OpenDocumentCommand($number));

        $this->journal->runAs(
            $editor,
            new ReplaceDocumentBodyCommand(new DraftTarget($number, $opened->token, $opened->version), $body),
        );

        return $this;
    }

    public function documentCalled(string $name): Document
    {
        return $this->aliases->model(Document::class, $name);
    }

    public function revisionOf(string $name, int $number): DocumentRevision
    {
        return DocumentRevision::query()
            ->where('document_id', $this->documentCalled($name)->id)
            ->where('number', $number)
            ->firstOrFail();
    }

    /**
     * The document the test named, handed to the scope to assert its revisions and drafts.
     *
     * @param  Closure(TestDocument): mixed  $scope
     */
    public function withDocument(string $name, Closure $scope): self
    {
        $this->documentCalled($name);
        $scope(new TestDocument($this, $this->journal, $name));

        return $this;
    }

    /**
     * The editor has no open draft of the document, and its current revision has this number.
     */
    public function assertClosed(string $name, string $editor, int $number): self
    {
        $document = $this->documentCalled($name)->load('currentRevision');

        Assert::assertNull($this->findDraftOf($document, $editor), "{$editor} still has {$name} open.");
        Assert::assertSame($number, $document->currentRevision?->number, "{$name} has another current revision.");

        return $this;
    }

    private function draftTarget(string $name, string $editor): DraftTarget
    {
        $draft = $this->draftOf($name, $editor);

        return new DraftTarget((string) $this->documentCalled($name)->number, $draft->token, $draft->version);
    }

    /**
     * The editor's open draft of the named document.
     */
    public function draftOf(string $name, string $editor): DocumentDraft
    {
        return $this->findDraftOf(
            $this->documentCalled($name),
            $editor,
        ) ?? Assert::fail("{$editor} has no draft of {$name}.");
    }

    private function findDraftOf(Document $document, string $editor): DocumentDraft|null
    {
        $author = $this->journal->actorCalled($editor);

        return DocumentDraft::query()
            ->where('document_id', $document->id)
            ->where('author_type', $author->type)
            ->where('author_id', $author->id)
            ->first();
    }
}

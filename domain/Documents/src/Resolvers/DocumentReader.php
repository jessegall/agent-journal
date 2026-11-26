<?php

declare(strict_types=1);

namespace Domain\Documents\Resolvers;

use App\Mcp\Contracts\Continuations;
use App\Mcp\Data\ToolResult;
use App\Mcp\Exceptions\ToolArgumentInvalid;
use App\Mcp\Support\Continuation;
use App\Mcp\Support\ToolArguments;
use App\Support\MarkdownText;
use App\Support\RecordIdentity;
use App\Text\TextPreview;
use Domain\Documents\Contracts\Documents\DocumentReader as DocumentReaderContract;
use Domain\Documents\Enums\PublicationView;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\DocumentRevision;
use Domain\Documents\Support\Mcp\PublicationChunks;
use Domain\Documents\Support\Mcp\PublicationPages;
use Domain\Documents\Values\DocumentReadCard;

final readonly class DocumentReader implements DocumentReaderContract
{
    public const string TOOL = 'docs_read';

    private const string KEY = 'doc_id';

    private const int REVISIONS = 8;

    public function __construct(
        private Continuations $continuations,
        private PublicationChunks $chunks,
        private PublicationPages $pages,
    ) {}

    public function document(int|string $id, ToolArguments $arguments): ToolResult
    {
        $document = DocumentResolver::published($id);
        $current = DocumentRevision::findCurrentOf($document);
        $cursor = $arguments->continuation();

        $position = $cursor === null
            ? $this->firstRead((string) $id, $current->number, $arguments)
            : $this->continuations->open($cursor, self::TOOL, (string) $id);

        if (! $position->filters['explicit_revision']) {
            $position->assertCurrentRevision($current->number);
        }

        $revision = $position->revision === $current->number
            ? $current
            : DocumentRevision::findPublishedOf($document, (string) $position->revision);

        $view = PublicationView::from($position->filters['view']);
        $card = new DocumentReadCard($document->number, $document->id, $revision->number);

        return match ($view) {
            PublicationView::Summary => $this->pages->summary(
                MarkdownText::body($revision->body),
                $revision->abstract,
                $position,
                self::KEY,
                $card,
            ),
            PublicationView::Body => $this->body($revision, $position, $arguments, $card),
            PublicationView::Revisions => $this->revisions($document, $position, $card),
            PublicationView::Comments => $this->pages->comments(
                new RecordIdentity(Document::linkType(), $document->id),
                $position,
                self::KEY,
                $card,
            ),
        };
    }

    private function firstRead(string $selector, int $current, ToolArguments $arguments): Continuation
    {
        $requestedRevision = $arguments->optionalWholeNumber('revision');

        if ($requestedRevision === 0) {
            throw ToolArgumentInvalid::for('revision', 'a positive revision number');
        }

        return new Continuation(
            self::TOOL,
            $selector,
            [
                'view' => $arguments->enumOr('view', PublicationView::Summary)->value,
                'explicit_revision' => $requestedRevision !== null,
            ],
            1,
            revision: $requestedRevision ?? $current,
        );
    }

    private function body(
        DocumentRevision $revision,
        Continuation $position,
        ToolArguments $arguments,
        DocumentReadCard $card,
    ): ToolResult {
        $bodyPosition = $arguments->continuation() === null
            ? $this->chunks->range($position, MarkdownText::body($revision->body), $arguments)
            : $position;

        return $this->chunks->page($revision->body, $bodyPosition, self::KEY, $card->toArray());
    }

    private function revisions(Document $document, Continuation $position, DocumentReadCard $card): ToolResult
    {
        $matching = $document->revisions()->sharedPublished()->orderBy('number')
            ->where('number', '>=', $position->offset)->limit(self::REVISIONS + 1)->get();

        $page = $matching->take(self::REVISIONS);
        $last = $page->last();

        $next = $last !== null && $matching->count() > $page->count() ? [$this->continuations->link(new Continuation(
            $position->tool,
            $position->selector,
            $position->filters,
            $last->number + 1,
            revision: $position->revision,
        ), self::KEY)] : [];

        return ToolResult::ok([
            ...$card->toArray(),
            'revisions' => $page->map(fn (DocumentRevision $revision) => [
                'revision' => $revision->number,
                'title' => TextPreview::within($revision->title, 100),
                'author_type' => $revision->author_type,
                'author_id' => $revision->author_id,
            ])->all(),
        ], $next);
    }
}

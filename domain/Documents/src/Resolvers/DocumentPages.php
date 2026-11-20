<?php

declare(strict_types=1);

namespace Domain\Documents\Resolvers;

use App\Mcp\Data\ToolResult;
use App\Mcp\Exceptions\ToolArgumentInvalid;
use App\Mcp\Support\Continuation;
use App\Mcp\Contracts\Continuations;
use App\Mcp\Support\ToolArguments;
use App\Records\Support\RecordIdentity;
use App\Text\Support\MarkdownText;
use Domain\Documents\Contracts\DocumentReader;
use Domain\Documents\Contracts\DocumentResolver;
use Domain\Documents\Data\DocumentFilters;
use Domain\Documents\Data\DocumentList;
use Domain\Documents\Enums\AttentionFilter;
use Domain\Documents\Enums\PublicationView;
use Domain\Documents\Mcp\PublicationChunks;
use Domain\Documents\Mcp\PublicationPages;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\DocumentRevision;

final readonly class DocumentPages implements DocumentReader
{
    public const string TOOL = 'docs_read';

    private const string KEY = 'doc_id';

    private const int REVISIONS = 8;

    public function __construct(
        private DocumentResolver $documents,
        private Continuations $continuations,
        private PublicationChunks $chunks,
        private PublicationPages $pages,
    ) {}

    public function list(string $search, int $page, int $size = 8): DocumentList
    {
        return $this->documents->list(new DocumentFilters(AttentionFilter::All, $page, $size, $search));
    }

    public function document(int|string $id, ToolArguments $arguments): ToolResult
    {
        $document = DocumentRecords::published($id);
        $current = $document->currentRevisionOrFail();
        $cursor = $arguments->continuation();
        $position = $cursor === null
            ? $this->firstRead((string) $id, $current->number, $arguments)
            : $this->continuations->open($cursor, self::TOOL, (string) $id);
        if (! $position->filters['explicit_revision']) {
            $position->assertCurrentRevision($current->number);
        }

        $revision = $position->revision === $current->number ? $current : $document->publishedRevision(
            (string) $position->revision,
        );
        $view = PublicationView::from($position->filters['view']);
        $card = ['doc_id' => $document->number, 'document_id' => $document->id, 'revision' => $revision->number];

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
                new RecordIdentity(Document::LINK_TYPE, $document->id),
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

    /** @param array<string, mixed> $card */
    private function body(
        DocumentRevision $revision,
        Continuation $position,
        ToolArguments $arguments,
        array $card,
    ): ToolResult {
        $position = $arguments->continuation() === null
            ? $this->chunks->range($position, MarkdownText::body($revision->body), $arguments)
            : $position;

        return $this->chunks->page($revision->body, $position, self::KEY, $card);
    }

    /** @param array<string, mixed> $card */
    private function revisions(Document $document, Continuation $position, array $card): ToolResult
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
            ...$card,
            'revisions' => $page->map(fn (DocumentRevision $revision): array => [
                'revision' => $revision->number,
                'title' => mb_strcut($revision->title, 0, 100),
                'author_type' => $revision->author_type->value,
                'author_id' => $revision->author_id,
            ])->all(),
        ], $next);
    }
}

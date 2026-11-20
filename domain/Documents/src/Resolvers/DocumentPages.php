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
use Domain\Documents\Enums\PublicationView;
use Domain\Documents\Mcp\PublicationChunks;
use Domain\Documents\Mcp\PublicationPages;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\DocumentRevision;
use Domain\Documents\Values\DocumentReadCard;

final readonly class DocumentPages implements DocumentReader
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
        $document = DocumentRecords::published($id);
        $current = $document->currentRevisionOrFail();
        $cursor = $arguments->continuation();
        $read = $cursor === null
            ? $this->firstRead((string) $id, $current->number, $arguments)
            : $this->continuations->open($cursor, self::TOOL, (string) $id);
        if (! $read->filters['explicit_revision']) {
            $read->assertCurrentRevision($current->number);
        }

        $revision = $read->revision === $current->number ? $current : $document->publishedRevision(
            (string) $read->revision,
        );
        $view = PublicationView::from($read->filters['view']);
        $card = new DocumentReadCard($document->number, $document->id, $revision->number);

        return match ($view) {
            PublicationView::Summary => $this->pages->summary(
                MarkdownText::body($revision->body),
                $revision->abstract,
                $read,
                self::KEY,
                $card->toArray(),
            ),
            PublicationView::Body => $this->body($revision, $read, $arguments, $card),
            PublicationView::Revisions => $this->revisions($document, $read, $card),
            PublicationView::Comments => $this->pages->comments(
                new RecordIdentity(Document::LINK_TYPE, $document->id),
                $read,
                self::KEY,
                $card->toArray(),
            ),
        };
    }

    private function firstRead(string $selector, int $current, ToolArguments $arguments): Continuation
    {
        $explicit = $arguments->optionalWholeNumber('revision');
        if ($explicit === 0) {
            throw ToolArgumentInvalid::for('revision', 'a positive revision number');
        }

        return new Continuation(
            self::TOOL,
            $selector,
            [
                'view' => $arguments->enumOr('view', PublicationView::Summary)->value,
                'explicit_revision' => $explicit !== null,
            ],
            1,
            revision: $explicit ?? $current,
        );
    }

    private function body(
        DocumentRevision $revision,
        Continuation $read,
        ToolArguments $arguments,
        DocumentReadCard $card,
    ): ToolResult {
        $position = $arguments->continuation() === null
            ? $this->chunks->range($read, MarkdownText::body($revision->body), $arguments)
            : $read;

        return $this->chunks->page($revision->body, $position, self::KEY, $card->toArray());
    }

    private function revisions(Document $document, Continuation $read, DocumentReadCard $card): ToolResult
    {
        $matching = $document->revisions()->sharedPublished()->orderBy('number')
            ->where('number', '>=', $read->offset)->limit(self::REVISIONS + 1)->get();
        $page = $matching->take(self::REVISIONS);
        $last = $page->last();
        $next = $last !== null && $matching->count() > $page->count() ? [$this->continuations->link(new Continuation(
            $read->tool,
            $read->selector,
            $read->filters,
            $last->number + 1,
            revision: $read->revision,
        ), self::KEY)] : [];

        return ToolResult::ok([
            ...$card->toArray(),
            'revisions' => $page->map(fn (DocumentRevision $revision) => [
                'revision' => $revision->number,
                'title' => mb_strcut($revision->title, 0, 100),
                'author_type' => $revision->author_type->value,
                'author_id' => $revision->author_id,
            ])->all(),
        ], $next);
    }
}

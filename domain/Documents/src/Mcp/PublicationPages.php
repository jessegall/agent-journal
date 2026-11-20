<?php

declare(strict_types=1);

namespace Domain\Documents\Mcp;

use App\Assignments\Support\Page;
use App\Comments\Contracts\CommentResolver;
use App\Mcp\Contracts\Continuations;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\Continuation;
use App\Records\Support\RecordIdentity;
use App\Text\Support\MarkdownText;
use App\Text\Support\TextPreview;
use Domain\Documents\Values\DocumentReadCard;
use Domain\Documents\Values\ReportReadCard;

final readonly class PublicationPages
{
    private const int OUTLINE_ENTRIES = 20;

    public function __construct(
        private CommentResolver $comments,
        private Continuations $continuations,
        private PublicationChunks $chunks,
    ) {}

    public function summary(
        MarkdownText $body,
        string $abstract,
        Continuation $position,
        string $key,
        DocumentReadCard|ReportReadCard $card,
    ): ToolResult {
        $outline = $body->outline();
        $entries = [];
        $length = strlen(json_encode($abstract, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE));
        foreach (array_slice($outline, $position->offset - 1, self::OUTLINE_ENTRIES) as $heading) {
            $excerpt = TextPreview::within($heading, 70);
            $length += strlen(json_encode($excerpt, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE)) + 1;
            if ($entries !== [] && $length > 6200) {
                break;
            }

            $entries[] = $excerpt;
        }
        $next = $position->offset + count($entries);
        $actions = $next <= count($outline) ? [$this->continuations->link(new Continuation(
            $position->tool,
            $position->selector,
            $position->filters,
            $next,
            revision: $position->revision,
        ), $key)] : [];

        return ToolResult::ok([
            ...$card->toArray(),
            'abstract' => $abstract,
            'outline' => $entries,
        ], $actions);
    }

    public function comments(
        RecordIdentity $record,
        Continuation $position,
        string $key,
        DocumentReadCard|ReportReadCard $card,
    ): ToolResult {
        $page = $this->comments->list($record, new Page($position->filters['after_comment'] ?? null, 1));
        $entry = $page->comments[0] ?? null;
        if ($entry === null) {
            return ToolResult::ok([...$card->toArray(), 'comments' => []]);
        }
        $comment = $entry->comment;
        $commentPage = $this->chunks->page($comment->body, $position, $key, [
            ...$card->toArray(),
            'comment' => [
                'id' => $comment->id,
                'author_type' => $comment->authorType->value,
                'author_id' => $comment->authorId,
                'created_at' => $comment->createdAt,
            ],
        ]);
        if ($commentPage->nextActions !== [] || $page->nextAfter === null) {
            return $commentPage;
        }

        return ToolResult::ok($commentPage->responseFields, [$this->continuations->link(new Continuation(
            $position->tool,
            $position->selector,
            [...$position->filters, 'after_comment' => $page->nextAfter],
            1,
            revision: $position->revision,
        ), $key)]);
    }
}

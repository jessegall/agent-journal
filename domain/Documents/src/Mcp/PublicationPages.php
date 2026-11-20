<?php

declare(strict_types=1);

namespace Domain\Documents\Mcp;

use App\Assignments\Support\Page;
use App\Comments\Contracts\CommentResolver;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\Continuation;
use App\Mcp\Contracts\Continuations;
use App\Records\Support\RecordIdentity;
use App\Text\Support\MarkdownText;

final readonly class PublicationPages
{
    private const int OUTLINE_ENTRIES = 20;

    public function __construct(
        private CommentResolver $comments,
        private Continuations $continuations,
        private PublicationChunks $chunks,
    ) {}

    /** @param array<string, mixed> $card */
    public function summary(MarkdownText $body, string $abstract, Continuation $read, string $key, array $card): ToolResult
    {
        $outline = $body->outline();
        $entries = [];
        $length = strlen(json_encode($abstract, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE));
        foreach (array_slice($outline, $read->offset - 1, self::OUTLINE_ENTRIES) as $heading) {
            $short = mb_strcut($heading, 0, 70);
            $length += strlen(json_encode($short, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE)) + 1;
            if ($entries !== [] && $length > 6200) {
                break;
            }

            $entries[] = $short;
        }
        $next = $read->offset + count($entries);
        $actions = $next <= count($outline) ? [$this->continuations->link(new Continuation(
            $read->tool, $read->selector, $read->filters, $next, revision: $read->revision,
        ), $key)] : [];

        return ToolResult::ok([
            ...$card,
            'abstract' => $abstract,
            'outline' => $entries,
        ], $actions);
    }

    /** @param array<string, mixed> $card */
    public function comments(RecordIdentity $record, Continuation $read, string $key, array $card): ToolResult
    {
        $page = $this->comments->list($record, new Page($read->filters['after_comment'] ?? null, 1));
        $entry = $page->items[0] ?? null;
        if ($entry === null) {
            return ToolResult::ok([...$card, 'comments' => []]);
        }
        $comment = $entry->comment;
        $answer = $this->chunks->page($comment->body, $read, $key, [
            ...$card,
            'comment' => [
                'id' => $comment->id,
                'author_type' => $comment->authorType->value,
                'author_id' => $comment->authorId,
                'created_at' => $comment->createdAt,
            ],
        ]);
        if ($answer->nextActions !== [] || $page->nextAfter === null) {
            return $answer;
        }

        return ToolResult::ok($answer->payload, [$this->continuations->link(new Continuation(
            $read->tool,
            $read->selector,
            [...$read->filters, 'after_comment' => $page->nextAfter],
            1,
            revision: $read->revision,
        ), $key)]);
    }
}

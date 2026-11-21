<?php

declare(strict_types=1);

namespace App\Comments\Data;

use App\Actors\Enums\ActorType;
use App\Comments\Models\Comment;
use App\Text\Support\MarkdownText;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One comment as it is shown: who left it and when, its text and its text as safe HTML.
 */
#[TypeScript]
final class CommentDetails extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly ActorType $authorType,
        public readonly string $authorId,
        public readonly string $createdAt,
        public readonly string $body,
        public readonly string $bodyHtml,
    ) {}

    /**
     * A comment as it is shown, its text also as safe HTML.
     */
    public static function fromComment(Comment $comment): self
    {
        return new self(
            $comment->id,
            $comment->author_type,
            $comment->author_id,
            (string) $comment->created_at?->toIso8601String(),
            $comment->body,
            MarkdownText::safeHtmlOf($comment->body),
        );
    }
}

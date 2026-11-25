<?php

declare(strict_types=1);

namespace Domain\Comments\Support;

use Domain\Comments\Data\CommentDetails;
use Domain\Comments\Models\Comment;
use App\Support\MarkdownText;

/**
 * How a comment becomes the details it is shown with; kept out of the exported Data class.
 */
final readonly class CommentDetailsFactory
{
    /**
     * A comment as it is shown, its text also as safe HTML.
     */
    public static function details(Comment $comment): CommentDetails
    {
        return new CommentDetails(
            $comment->id,
            $comment->author_type,
            $comment->author_id,
            (string) $comment->created_at?->toIso8601String(),
            $comment->body,
            MarkdownText::safeHtmlOf($comment->body),
        );
    }
}

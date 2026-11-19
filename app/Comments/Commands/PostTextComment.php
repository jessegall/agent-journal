<?php

declare(strict_types=1);

namespace App\Comments\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use App\Comments\Enums\CommentAbility;
use App\Comments\Handlers\PostTextCommentHandler;
use App\Comments\Models\Comment;
use App\Comments\Policies\CommentPolicy;
use App\Records\Support\RecordIdentity;
use App\Text\Values\TextRange;

/**
 * Leaves a comment about an exact place in one version of a record's text. The submission key makes a retry return
 * the first comment instead of a second one.
 *
 * @extends Command<string> the comment's id
 */
#[HandledBy(PostTextCommentHandler::class)]
#[Authorize(CommentPolicy::class, CommentAbility::Work)]
final readonly class PostTextComment extends Command implements HasAuthorizationSubject
{
    public function __construct(
        public RecordIdentity $target,
        public string $body,
        public TextRange $range,
        public string $submissionKey,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Comment::class;
    }
}

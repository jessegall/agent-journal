<?php

declare(strict_types=1);

namespace App\Comments\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Comments\Enums\CommentAbility;
use App\Comments\Handlers\PostCommentHandler;
use App\Comments\Models\Comment;
use App\Comments\Policies\CommentPolicy;
use App\Records\Support\RecordIdentity;

/**
 * Leaves a comment about a whole record the actor may read. The submission key makes a retry return the first comment
 * instead of a second one.
 *
 * @implements Command<string> the comment's id
 */
#[HandledBy(PostCommentHandler::class)]
#[Authorize(CommentPolicy::class, CommentAbility::Work)]
final readonly class PostComment implements Command, HasAuthorizationSubject
{
    public function __construct(
        public RecordIdentity $target,
        public string $body,
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

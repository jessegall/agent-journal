<?php

declare(strict_types=1);

namespace App\Commands\Comments\PostComment;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Policies\CommentPolicy;
use App\Support\Command;
use App\Support\RecordIdentity;

/**
 * Leaves a comment about a whole record the actor may read. The submission key makes a retry return the first comment
 * instead of a second one.
 *
 * @extends Command<string> the comment's id
 */
#[Authorize(CommentPolicy::class, AccessType::Create)]
final readonly class PostCommentCommand extends Command
{
    public function __construct(
        public RecordIdentity $target,
        public string $body,
        public string $submissionKey,
    ) {}
}

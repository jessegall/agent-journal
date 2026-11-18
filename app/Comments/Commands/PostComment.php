<?php

declare(strict_types=1);

namespace App\Comments\Commands;

use App\Assignments\Support\RecordIdentity;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Comments\Handlers\PostCommentHandler;

/**
 * Leaves a comment about a whole record the actor may read. The submission key makes a retry return the first comment
 * instead of a second one.
 *
 * @implements Command<string> the comment's id
 */
#[HandledBy(PostCommentHandler::class)]
final readonly class PostComment implements Command
{
    public function __construct(
        public RecordIdentity $target,
        public string $body,
        public string $submissionKey,
    ) {}
}

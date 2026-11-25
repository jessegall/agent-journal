<?php

declare(strict_types=1);

namespace Domain\Comments\Commands\PostComment;

use Domain\Comments\Commands\Support\CommentCommandHandler;
use Domain\Comments\Enums\WholeRecord;
use Domain\Comments\Support\CommentWriter;

final readonly class PostCommentHandler extends CommentCommandHandler
{
    public function __construct(private CommentWriter $comments) {}

    public function handle(PostCommentCommand $command): string
    {
        return $this->comments->post(
            $command->target,
            $command->body,
            WholeRecord::Record,
            $command->submissionKey,
            $command->dispatchedBy(),
        );
    }
}

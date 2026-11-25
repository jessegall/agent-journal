<?php

declare(strict_types=1);

namespace Domain\Comments\Commands\PostTextComment;

use Domain\Comments\Commands\Support\CommentCommandHandler;
use Domain\Comments\Support\CommentWriter;

final readonly class PostTextCommentHandler extends CommentCommandHandler
{
    public function __construct(private CommentWriter $comments) {}

    public function handle(PostTextCommentCommand $command): string
    {
        return $this->comments->post(
            $command->target,
            $command->body,
            $command->range,
            $command->submissionKey,
            $command->dispatchedBy(),
        );
    }
}

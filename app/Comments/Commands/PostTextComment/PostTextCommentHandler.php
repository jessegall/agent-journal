<?php

declare(strict_types=1);

namespace App\Comments\Commands\PostTextComment;

use App\Comments\Support\CommentWriter;
use App\Contracts\CommandHandler;

final readonly class PostTextCommentHandler implements CommandHandler
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

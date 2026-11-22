<?php

declare(strict_types=1);

namespace App\Commands\PostTextComment;

use App\Contracts\Bus\CommandHandler;
use App\Support\CommentWriter;

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

<?php

declare(strict_types=1);

namespace App\Commands\Comments\PostComment;

use App\Contracts\Bus\CommandHandler;
use App\Enums\WholeRecord;
use App\Support\CommentWriter;

final readonly class PostCommentHandler implements CommandHandler
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

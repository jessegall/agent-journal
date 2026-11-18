<?php

declare(strict_types=1);

namespace App\Comments\Handlers;

use App\Comments\Commands\PostComment;
use App\Comments\Enums\WholeRecord;
use App\Comments\Support\CommentWriter;
use App\Contracts\CommandHandler;

final readonly class PostCommentHandler implements CommandHandler
{
    public function __construct(private CommentWriter $comments) {}

    public function handle(PostComment $command): string
    {
        return $this->comments->post($command->target, $command->body, WholeRecord::Record, $command->submissionKey);
    }
}

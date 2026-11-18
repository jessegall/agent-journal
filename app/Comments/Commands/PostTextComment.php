<?php

declare(strict_types=1);

namespace App\Comments\Commands;

use App\Assignments\Support\RecordIdentity;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Comments\Handlers\PostTextCommentHandler;
use App\Text\Values\TextRange;

/**
 * Leaves a comment about an exact place in one version of a record's text. The submission key makes a retry return
 * the first comment instead of a second one.
 *
 * @implements Command<string> the comment's id
 */
#[HandledBy(PostTextCommentHandler::class)]
final readonly class PostTextComment implements Command
{
    public function __construct(
        public RecordIdentity $target,
        public string $body,
        public TextRange $range,
        public string $submissionKey,
    ) {}
}

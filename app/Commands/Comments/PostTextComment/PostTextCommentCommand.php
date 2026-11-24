<?php

declare(strict_types=1);

namespace App\Commands\Comments\PostTextComment;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Policies\CommentPolicy;
use App\Support\Command;
use App\Support\RecordIdentity;
use App\Values\TextRange;

/**
 * Leaves a comment about an exact place in one version of a record's text. The submission key makes a retry return
 * the first comment instead of a second one.
 *
 * @extends Command<string> the comment's id
 */
#[Authorize(CommentPolicy::class, AccessType::Create)]
final readonly class PostTextCommentCommand extends Command
{
    public function __construct(
        public RecordIdentity $target,
        public string $body,
        public TextRange $range,
        public string $submissionKey,
    ) {}
}

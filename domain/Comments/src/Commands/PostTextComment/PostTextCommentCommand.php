<?php

declare(strict_types=1);

namespace Domain\Comments\Commands\PostTextComment;

use App\Attributes\Commands\Authorize;
use App\Enums\Agents\AccessType;
use App\Support\Command;
use App\Support\RecordIdentity;
use App\Values\TextRange;
use Domain\Comments\Policies\CommentPolicy;

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

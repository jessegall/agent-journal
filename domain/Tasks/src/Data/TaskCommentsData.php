<?php

declare(strict_types=1);

namespace Domain\Tasks\Data;

use App\Data\CommentList;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The props of a task's Comments tab: its comments, and the label a new comment is written on.
 */
#[TypeScript]
final class TaskCommentsData extends Data
{
    public function __construct(
        public readonly CommentList $comments,
        public readonly string $target,
    ) {}
}
